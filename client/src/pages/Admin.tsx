import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AdminStats } from "@/components/AdminStats";
import { InventoryTable } from "@/components/InventoryTable";
import { SalesChart } from "@/components/SalesChart";
import { ArrowLeft } from "lucide-react";
import type { Product, AdminStats as AdminStatsType } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function Admin() {
  const { toast } = useToast();

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStatsType>({
    queryKey: ["/api/admin/stats"],
  });

  // Update stock mutation
  const updateStockMutation = useMutation({
    mutationFn: async ({ productId, stock }: { productId: string; stock: number }) => {
      return apiRequest("PATCH", `/api/admin/inventory/${productId}`, { stock });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Stock actualizado",
        description: "El nivel de inventario se ha actualizado correctamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el stock. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateStock = (productId: string, newStock: number) => {
    updateStockMutation.mutate({ productId, stock: newStock });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <h1 className="text-xl md:text-2xl font-bold text-primary">
              Panel de Administración
            </h1>
            <Link href="/">
              <Button variant="outline" data-testid="button-back-to-store">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la Tienda
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" data-testid="text-dashboard-title">
            Resumen del Negocio
          </h2>
          <AdminStats
            stats={stats || { totalSales: 0, ordersPending: 0, lowStockAlerts: 0 }}
            isLoading={statsLoading}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" data-testid="text-sales-chart-title">
            Ventas de la Semana
          </h2>
          <SalesChart />
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6" data-testid="text-inventory-title">
            Gestión de Inventario
          </h2>
          <InventoryTable
            products={products}
            onUpdateStock={handleUpdateStock}
            isLoading={productsLoading}
          />
        </section>
      </main>
    </div>
  );
}
