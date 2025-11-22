import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertCartItemSchema, insertOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Get cart items
  app.get("/api/cart", async (req, res) => {
    try {
      const cartItems = await storage.getCartItems();
      const itemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return { ...item, product };
        })
      );
      res.json(itemsWithProducts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  });

  // Add to cart
  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      
      // Check if product exists and has stock
      const product = await storage.getProduct(validatedData.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (parseInt(product.stock.toString()) < validatedData.quantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }

      const cartItem = await storage.addToCart(validatedData);
      
      // Return cart item with product data for consistent frontend state
      const itemWithProduct = {
        ...cartItem,
        product,
      };
      
      res.status(201).json(itemWithProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add to cart" });
    }
  });

  // Update cart item quantity
  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      
      // Validate quantity
      const quantitySchema = z.number().int().min(0);
      const validatedQuantity = quantitySchema.parse(quantity);

      // Get the cart item to verify it exists
      const cartItems = await storage.getCartItems();
      const cartItem = cartItems.find(item => item.id === req.params.id);
      
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      // Check stock availability if increasing quantity
      const product = await storage.getProduct(cartItem.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (validatedQuantity > parseInt(product.stock.toString())) {
        return res.status(400).json({ error: "Insufficient stock" });
      }

      const updated = await storage.updateCartItemQuantity(req.params.id, validatedQuantity);
      
      // If quantity is 0, item is deleted, return success without item
      if (validatedQuantity === 0 || !updated) {
        return res.json({ success: true, deleted: true });
      }
      
      // Return updated item with product data for consistent frontend state
      const updatedProduct = await storage.getProduct(updated.productId);
      const itemWithProduct = {
        ...updated,
        product: updatedProduct,
      };
      
      res.json({ success: true, item: itemWithProduct });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid quantity value", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  // Remove from cart
  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const success = await storage.removeFromCart(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from cart" });
    }
  });

  // Checkout - create order
  app.post("/api/checkout", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      
      const cartItems = await storage.getCartItems();
      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      // First, validate that all items have sufficient stock
      const insufficientStockItems: string[] = [];
      for (const item of cartItems) {
        const product = await storage.getProduct(item.productId);
        if (!product) {
          return res.status(404).json({ 
            error: "Product not found",
            productId: item.productId 
          });
        }

        const currentStock = parseInt(product.stock.toString());
        if (currentStock < item.quantity) {
          insufficientStockItems.push(product.name);
        }
      }

      // If any items have insufficient stock, reject the order
      if (insufficientStockItems.length > 0) {
        return res.status(409).json({ 
          error: "Insufficient stock for one or more items",
          items: insufficientStockItems,
          message: "El stock ha cambiado. Por favor actualiza tu carrito."
        });
      }

      // All items have sufficient stock, proceed with order
      // Reduce stock for purchased items
      for (const item of cartItems) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          const currentStock = parseInt(product.stock.toString());
          const newStock = currentStock - item.quantity;
          await storage.updateProductStock(product.id, newStock);
        }
      }

      const order = await storage.createOrder(validatedData);
      await storage.clearCart();

      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Admin: Get stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  // Admin: Update product stock
  app.patch("/api/admin/inventory/:id", async (req, res) => {
    try {
      const { stock } = req.body;
      
      // Validate stock with Zod
      const stockSchema = z.number().int().min(0);
      const validatedStock = stockSchema.parse(stock);

      const product = await storage.updateProductStock(req.params.id, validatedStock);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid stock value", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update product stock" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
