"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface DiseaseChartProps {
  data: Array<{
    name: string;
    count: number;
    color: string;
  }>;
  onAddCase?: () => void;
}

export function DiseaseChart({ data, onAddCase }: DiseaseChartProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Disease Breakdown Today</CardTitle>
        {onAddCase && (
          <Button onClick={onAddCase} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Log Cases
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Bar 
              dataKey="count" 
              radius={[8, 8, 0, 0]}
              fill="#8884d8"
            >
              {data.map((entry, index) => (
                <Bar key={`bar-${index}`} dataKey="count" fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
