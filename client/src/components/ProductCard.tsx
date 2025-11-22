import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isLowStock = parseInt(product.stock.toString()) < 5;
  const isOutOfStock = parseInt(product.stock.toString()) === 0;

  return (
    <Card
      className="group hover-elevate overflow-hidden transition-all duration-300"
      data-testid={`card-product-${product.id}`}
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`img-product-${product.id}`}
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-semibold text-lg line-clamp-2"
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </h3>
          {isLowStock && !isOutOfStock && (
            <Badge variant="secondary" className="text-xs shrink-0">
              Pocas unidades
            </Badge>
          )}
        </div>
        <p
          className="text-2xl font-semibold text-primary"
          data-testid={`text-product-price-${product.id}`}
        >
          S/ {parseFloat(product.price.toString()).toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          data-testid={`button-add-to-cart-${product.id}`}
        >
          <Plus className="h-4 w-4 mr-2" />
          {isOutOfStock ? "Agotado" : "Añadir al Carrito"}
        </Button>
      </CardFooter>
    </Card>
  );
}
