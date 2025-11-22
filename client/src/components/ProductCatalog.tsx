import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import type { Product } from "@shared/schema";

type CategoryType = "hombres" | "mujeres" | "accesorios";

interface ProductCatalogProps {
  products: Product[];
  selectedCategories: CategoryType[];
  onCategoryToggle: (category: CategoryType) => void;
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
}

export function ProductCatalog({
  products,
  selectedCategories,
  onCategoryToggle,
  onAddToCart,
  isLoading,
}: ProductCatalogProps) {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const categories: { id: CategoryType; label: string }[] = [
    { id: "hombres", label: "Hombres" },
    { id: "mujeres", label: "Mujeres" },
    { id: "accesorios", label: "Accesorios" },
  ];

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Categorías</h3>
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3">
              <Checkbox
                id={cat.id}
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => onCategoryToggle(cat.id)}
                data-testid={`checkbox-category-${cat.id}`}
              />
              <label
                htmlFor={cat.id}
                className="text-sm font-medium cursor-pointer"
                data-testid={`label-category-${cat.id}`}
              >
                {cat.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      {selectedCategories.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            selectedCategories.forEach((cat) => onCategoryToggle(cat));
          }}
          className="w-full"
          data-testid="button-clear-filters"
        >
          Limpiar Filtros
        </Button>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <section id="catalogo" className="py-12 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Nuestro Catálogo
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="catalogo" className="py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          data-testid="text-catalog-title"
        >
          Nuestro Catálogo
        </h2>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-48 flex-shrink-0">
            <div className="sticky top-24 border-r pr-6">
              <FilterSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6 flex items-center justify-between">
              <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" data-testid="button-open-filters">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>
              {selectedCategories.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {products.length} producto{products.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground" data-testid="text-no-products">
                  No hay productos en esta categoría
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
