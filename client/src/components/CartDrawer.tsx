import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, CreditCard, Smartphone } from "lucide-react";
import type { CartItemWithProduct } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItemWithProduct[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: (paymentMethod: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const [showPayment, setShowPayment] = useState(false);

  const total = cartItems.reduce(
    (sum, item) =>
      sum + parseFloat(item.product.price.toString()) * item.quantity,
    0
  );

  const handleCheckout = () => {
    setShowPayment(true);
  };

  const handlePaymentMethod = (method: string) => {
    onCheckout(method);
    setShowPayment(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle data-testid="text-cart-title">
            {showPayment ? "Método de Pago" : "Carrito de Compras"}
          </SheetTitle>
        </SheetHeader>

        {!showPayment ? (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground" data-testid="text-empty-cart">
                    Tu carrito está vacío
                  </p>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  {cartItems.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden"
                      data-testid={`cart-item-${item.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-md"
                            data-testid={`img-cart-item-${item.id}`}
                          />
                          <div className="flex-1 min-w-0">
                            <h4
                              className="font-semibold text-sm mb-1 line-clamp-1"
                              data-testid={`text-cart-item-name-${item.id}`}
                            >
                              {item.product.name}
                            </h4>
                            <p
                              className="text-primary font-semibold mb-2"
                              data-testid={`text-cart-item-price-${item.id}`}
                            >
                              S/ {parseFloat(item.product.price.toString()).toFixed(2)}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2 border rounded-md">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    onUpdateQuantity(item.id, item.quantity - 1)
                                  }
                                  disabled={item.quantity <= 1}
                                  data-testid={`button-decrease-${item.id}`}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span
                                  className="w-8 text-center text-sm font-medium"
                                  data-testid={`text-quantity-${item.id}`}
                                >
                                  {item.quantity}
                                </span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    onUpdateQuantity(item.id, item.quantity + 1)
                                  }
                                  data-testid={`button-increase-${item.id}`}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive"
                                onClick={() => onRemoveItem(item.id)}
                                data-testid={`button-remove-${item.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>

            {cartItems.length > 0 && (
              <SheetFooter className="flex-col gap-4 -mx-6 px-6 pt-4 border-t">
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg font-semibold">Total:</span>
                  <span
                    className="text-2xl font-bold text-primary"
                    data-testid="text-cart-total"
                  >
                    S/ {total.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground text-center py-2" data-testid="text-payment-methods">
                  Aceptamos: Yape • Plin • Visa • Mastercard
                </div>
                <Button
                  className="w-full bg-accent hover:bg-accent text-accent-foreground"
                  size="lg"
                  onClick={handleCheckout}
                  data-testid="button-checkout"
                >
                  Proceder al Pago
                </Button>
              </SheetFooter>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center gap-6 py-8">
            <div
              role="button"
              tabIndex={0}
              className="hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => handlePaymentMethod("Tarjeta")}
              onKeyDown={(e) => e.key === "Enter" && handlePaymentMethod("Tarjeta")}
              data-testid="button-payment-card"
            >
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Tarjeta de Crédito/Débito</h3>
                    <p className="text-sm text-muted-foreground">Niubiz / Culqi</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div
              role="button"
              tabIndex={0}
              className="hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => handlePaymentMethod("Billetera Digital")}
              onKeyDown={(e) => e.key === "Enter" && handlePaymentMethod("Billetera Digital")}
              data-testid="button-payment-digital"
            >
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Billetera Digital</h3>
                    <p className="text-sm text-muted-foreground">Yape / Plin</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowPayment(false)}
              data-testid="button-back-to-cart"
            >
              Volver al Carrito
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
