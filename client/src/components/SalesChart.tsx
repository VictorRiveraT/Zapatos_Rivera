import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export function SalesChart() {
  const data = [
    { day: "Lun", sales: 1200 },
    { day: "Mar", sales: 1900 },
    { day: "Mié", sales: 1400 },
    { day: "Jue", sales: 2200 },
    { day: "Vie", sales: 2800 },
    { day: "Sáb", sales: 3500 },
    { day: "Dom", sales: 2100 },
  ];

  return (
    <Card data-testid="card-sales-chart">
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" data-testid="axis-day" />
            <YAxis data-testid="axis-sales" />
            <Tooltip
              formatter={(value: any) => `S/ ${parseFloat(value).toFixed(2)}`}
              data-testid="tooltip-sales"
            />
            <Bar
              dataKey="sales"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
              data-testid="bar-sales"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
