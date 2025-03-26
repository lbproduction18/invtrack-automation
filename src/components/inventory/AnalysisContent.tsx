
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpIcon, ArrowDownIcon, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const AnalysisContent: React.FC = () => {
  // Données d'exemple pour l'analyse
  const analysisData = [
    { id: 1, sku: 'SKU-001', current: 5, threshold: 10, recommended: 15, trend: 'up', priority: 'high' },
    { id: 2, sku: 'SKU-002', current: 8, threshold: 20, recommended: 25, trend: 'down', priority: 'medium' },
    { id: 3, sku: 'SKU-003', current: 3, threshold: 8, recommended: 10, trend: 'up', priority: 'high' },
  ];

  return (
    <CardContent className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Stock Actuel</TableHead>
            <TableHead>Seuil</TableHead>
            <TableHead>Recommandé</TableHead>
            <TableHead>Tendance</TableHead>
            <TableHead>Priorité</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analysisData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.sku}</TableCell>
              <TableCell>{item.current}</TableCell>
              <TableCell>{item.threshold}</TableCell>
              <TableCell className="font-medium">{item.recommended}</TableCell>
              <TableCell>
                {item.trend === 'up' ? (
                  <ArrowUpIcon className="text-green-500 h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="text-red-500 h-4 w-4" />
                )}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={item.priority === 'high' ? 'destructive' : 'outline'}
                >
                  {item.priority === 'high' ? 'Haute' : 'Moyenne'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  );
};
