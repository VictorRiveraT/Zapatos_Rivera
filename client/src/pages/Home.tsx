import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProductCatalog } from "@/components/ProductCatalog";
import { CartDrawer } from "@/components/CartDrawer";
import type { Product, CartItemWithProduct } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const { toast } = useToast();

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Fetch cart items
  const { data: cartItems = [], isLoading: cartLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (product: Product) => {
      return apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Producto añadido",
        description: "El producto se ha añadido a tu carrito",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo añadir el producto al carrito",
        variant: "destructive",
      });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      return apiRequest("PATCH", `/api/cart/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return apiRequest("DELETE", `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado de tu carrito",
      });
    },
  });

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async (paymentMethod: string) => {
      const total = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.product.price.toString()) * item.quantity,
        0
      );
      return apiRequest("POST", "/api/checkout", {
        total: total.toFixed(2),
        paymentMethod,
      });
    },
    onSuccess: () => {
      // Invalidate all related queries to sync inventory across views
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Pedido realizado",
        description: "Tu pedido ha sido procesado exitosamente. ¡Gracias por tu compra!",
      });
      setCartOpen(false);
    },
    onError: (error: any) => {
      // Handle stock synchronization errors
      const message = error.message || "No se pudo procesar tu pedido. Por favor intenta de nuevo.";
      
      toast({
        title: "Error al procesar el pedido",
        description: message,
        variant: "destructive",
      });

      // Refresh cart and products to show updated stock
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });

  const scrollToCatalog = () => {
    const catalogElement = document.getElementById("catalogo");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const addToCart = (product: Product) => {
    addToCartMutation.mutate(product);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    updateQuantityMutation.mutate({ itemId, quantity });
  };

  const removeItem = (itemId: string) => {
    removeItemMutation.mutate(itemId);
  };

  const handleCheckout = (paymentMethod: string) => {
    checkoutMutation.mutate(paymentMethod);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={cartItemCount} onCartClick={() => setCartOpen(true)} />
      <Hero onCatalogClick={scrollToCatalog} />
      <ProductCatalog
        products={products}
        onAddToCart={addToCart}
        isLoading={productsLoading}
      />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
