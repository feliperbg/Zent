import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Fuel, Leaf } from "lucide-react";

interface Transaction {
    id: string;
    description: string | null;
    amount: any;
    place?: {
        name: string;
        latitude: number;
        longitude: number;
    } | null;
}

interface GeoEconomyWidgetProps {
    transactions: Transaction[];
}

export function GeoEconomyWidget({ transactions }: GeoEconomyWidgetProps) {
    return (
        <Card className="col-span-1 border-slate-100 shadow-sm h-full">
            <CardHeader>
                <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-500" /> Geo-Eficiência
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="flex items-start gap-4">
                            <div className="bg-emerald-50 p-2 rounded-full">
                                <Car className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none text-slate-800">
                                    {tx.place?.name || tx.description || 'Desconhecido'}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Deslocamento eficiente
                                </p>
                            </div>
                            <div className="font-medium text-emerald-600 text-sm">
                                +R$ 2,50
                                {/* Mock value for now */}
                            </div>
                        </div>
                    ))}

                    {transactions.length === 0 && (
                        <p className="text-sm text-slate-400">Nenhuma compra recente.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
