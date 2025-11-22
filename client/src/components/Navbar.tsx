import { ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export function Navbar({ cartItemCount, onCartClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" data-testid="link-home">
            <span className="text-xl md:text-2xl font-bold text-primary cursor-pointer">
              Calzados Rivera
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" data-testid="link-inicio">
              <span className="text-sm font-medium hover-elevate active-elevate-2 px-3 py-2 rounded-md cursor-pointer">
                Inicio
              </span>
            </Link>
            <Link href="/#catalogo" data-testid="link-catalogo">
              <span className="text-sm font-medium hover-elevate active-elevate-2 px-3 py-2 rounded-md cursor-pointer">
                Catálogo
              </span>
            </Link>
            <Link href="/admin" data-testid="link-admin">
              <span className="text-sm font-medium text-muted-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md cursor-pointer">
                Admin
              </span>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onCartClick}
            className="relative"
            data-testid="button-cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 px-1.5 text-xs"
                data-testid="badge-cart-count"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
