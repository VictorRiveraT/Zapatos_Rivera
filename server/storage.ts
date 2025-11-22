import {
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type AdminStats,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStock(id: string, stock: number): Promise<Product | undefined>;

  // Cart
  getCartItems(): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(): Promise<void>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;

  // Admin
  getAdminStats(): Promise<AdminStats>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.initializeProducts();
  }

  private initializeProducts() {
    const initialProducts: InsertProduct[] = [
      {
        sku: "MOC-001",
        name: "Mocasín Clásico",
        price: "150.00",
        stock: 12,
        image: "https://images.unsplash.com/photo-1533867617858-e7b97e0605df?auto=format&fit=crop&q=80&w=800",
        category: "hombres",
      },
      {
        sku: "BOT-002",
        name: "Botín Cuero Premium",
        price: "220.00",
        stock: 8,
        image: "https://images.unsplash.com/photo-1608256246200-53e635b5b69f?auto=format&fit=crop&q=80&w=800",
        category: "mujeres",
      },
      {
        sku: "FOR-003",
        name: "Zapato Formal Oxford",
        price: "180.00",
        stock: 15,
        image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&q=80&w=800",
        category: "hombres",
      },
      {
        sku: "SAN-004",
        name: "Sandalia Artesanal",
        price: "95.00",
        stock: 4,
        image: "https://images.unsplash.com/photo-1603487742131-4160d6e243c6?auto=format&fit=crop&q=80&w=800",
        category: "accesorios",
      },
      {
        sku: "CHE-005",
        name: "Chelsea Boot Castaño",
        price: "240.00",
        stock: 6,
        image: "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&q=80&w=800",
        category: "mujeres",
      },
      {
        sku: "SNE-006",
        name: "Sneaker Casual Cuero",
        price: "165.00",
        stock: 10,
        image: "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&q=80&w=800",
        category: "hombres",
      },
    ];

    initialProducts.forEach((product) => {
      const id = randomUUID();
      this.products.set(id, { ...product, id });
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProductStock(id: string, stock: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, stock };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // Cart
  async getCartItems(): Promise<CartItem[]> {
    return Array.from(this.cartItems.values());
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists
    const existing = Array.from(this.cartItems.values()).find(
      (item) => item.productId === insertItem.productId
    );

    if (existing) {
      const updated: CartItem = {
        ...existing,
        quantity: existing.quantity + insertItem.quantity,
      };
      this.cartItems.set(existing.id, updated);
      return updated;
    }

    const id = randomUUID();
    const cartItem: CartItem = { ...insertItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }

    const updated = { ...item, quantity };
    this.cartItems.set(id, updated);
    return updated;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(): Promise<void> {
    this.cartItems.clear();
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      status: "pending",
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  // Admin
  async getAdminStats(): Promise<AdminStats> {
    const orders = await this.getOrders();
    const products = await this.getProducts();

    const totalSales = orders.reduce(
      (sum, order) => sum + parseFloat(order.total.toString()),
      0
    );

    const ordersPending = orders.filter((order) => order.status === "pending").length;

    const lowStockAlerts = products.filter(
      (product) => parseInt(product.stock.toString()) < 5
    ).length;

    return {
      totalSales,
      ordersPending,
      lowStockAlerts,
    };
  }
}

export const storage = new MemStorage();
