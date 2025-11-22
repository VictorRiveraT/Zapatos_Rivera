import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Check, X } from "lucide-react";
import type { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface InventoryTableProps {
  products: Product[];
  onUpdateStock: (productId: string, newStock: number) => void;
  isLoading?: boolean;
}

export function InventoryTable({ products, onUpdateStock, isLoading }: InventoryTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditValue(product.stock.toString());
  };

  const handleSave = (productId: string) => {
    const newStock = parseInt(editValue);
    if (!isNaN(newStock) && newStock >= 0) {
      onUpdateStock(productId, newStock);
    }
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Agotado</Badge>;
    } else if (stock < 5) {
      return (
        <Badge className="bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 text-white">
          Bajo
        </Badge>
      );
    } else if (stock <= 10) {
      return (
        <Badge className="bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white">
          Medio
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white">
        Disponible
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-12 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/5 hover:bg-primary/5">
            <TableHead className="font-semibold">SKU</TableHead>
            <TableHead className="font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold">Precio</TableHead>
            <TableHead className="font-semibold">Stock</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow
              key={product.id}
              className={index % 2 === 1 ? "bg-muted/30" : ""}
              data-testid={`row-inventory-${product.id}`}
            >
              <TableCell className="font-mono text-sm" data-testid={`text-sku-${product.id}`}>
                {product.sku}
              </TableCell>
              <TableCell className="font-medium" data-testid={`text-name-${product.id}`}>
                {product.name}
              </TableCell>
              <TableCell className="font-semibold" data-testid={`text-price-${product.id}`}>
                S/ {parseFloat(product.price.toString()).toFixed(2)}
              </TableCell>
              <TableCell>
                {editingId === product.id ? (
                  <Input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-20"
                    min="0"
                    data-testid={`input-stock-${product.id}`}
                  />
                ) : (
                  <span className="font-semibold" data-testid={`text-stock-${product.id}`}>
                    {product.stock.toString()}
                  </span>
                )}
              </TableCell>
              <TableCell data-testid={`badge-stock-status-${product.id}`}>
                {getStockBadge(parseInt(product.stock.toString()))}
              </TableCell>
              <TableCell className="text-right">
                {editingId === product.id ? (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleSave(product.id)}
                      data-testid={`button-save-${product.id}`}
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={handleCancel}
                      data-testid={`button-cancel-${product.id}`}
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleEdit(product)}
                    data-testid={`button-edit-${product.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
