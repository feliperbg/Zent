import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, MapPin } from "lucide-react";

interface KpiCardsProps {
    monthIncome: number;
    monthExpense: number;
    routeEconomy: number;
}

export function KpiCards({ monthIncome, monthExpense, routeEconomy }: KpiCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Receitas (Mês)
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-800">
                        R$ {monthIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Despesas (Mês)
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-rose-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-800">
                        R$ {monthExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-emerald-900 text-white shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MapPin className="w-24 h-24" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-emerald-100">
                        Economia de Rota
                    </CardTitle>
                    <MapPin className="h-4 w-4 text-emerald-300" />
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-2xl font-bold">
                        R$ {routeEconomy.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-emerald-300 mt-1">
                        Economizado em combustível este mês
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
