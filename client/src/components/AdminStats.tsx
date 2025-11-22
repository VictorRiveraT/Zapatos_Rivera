import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Package, AlertTriangle } from "lucide-react";
import type { AdminStats as AdminStatsType } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminStatsProps {
  stats: AdminStatsType;
  isLoading?: boolean;
}

export function AdminStats({ stats, isLoading }: AdminStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-12 w-12 rounded-full mb-4" />
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div>
            <p
              className="text-3xl font-bold mb-1"
              data-testid="text-total-sales"
            >
              S/ {stats.totalSales.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Ventas Totales</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-accent">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Package className="h-6 w-6 text-accent" />
            </div>
          </div>
          <div>
            <p
              className="text-3xl font-bold mb-1"
              data-testid="text-orders-pending"
            >
              {stats.ordersPending}
            </p>
            <p className="text-sm text-muted-foreground">Pedidos Pendientes</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-destructive">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <div>
            <p
              className="text-3xl font-bold mb-1"
              data-testid="text-low-stock-alerts"
            >
              {stats.lowStockAlerts}
            </p>
            <p className="text-sm text-muted-foreground">Alertas de Stock Bajo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
