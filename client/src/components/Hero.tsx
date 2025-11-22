import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/artisan_crafting_leather_shoes.png";

interface HeroProps {
  onCatalogClick: () => void;
}

export function Hero({ onCatalogClick }: HeroProps) {
  return (
    <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 md:mb-8 leading-tight"
          data-testid="text-hero-title"
        >
          20 años de tradición a tus pies
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto">
          Zapatos artesanales peruanos hechos a mano con cuero de primera calidad
        </p>
        <Button
          size="lg"
          variant="default"
          onClick={onCatalogClick}
          className="bg-accent hover:bg-accent text-accent-foreground px-8 py-6 text-lg font-semibold shadow-xl"
          data-testid="button-ver-catalogo"
        >
          Ver Catálogo
        </Button>
      </div>
    </section>
  );
}
