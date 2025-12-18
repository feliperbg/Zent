import { Zap } from 'lucide-react';

interface DashboardHeaderProps {
    userName: string;
    freeMoney: number;
}

export function DashboardHeader({ userName, freeMoney }: DashboardHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
                    Bom dia, {userName}
                </h1>
                <p className="text-slate-500 text-sm">
                    Sua saúde financeira hoje
                </p>
            </div>

            <div className={`border px-6 py-4 rounded-2xl flex flex-col items-end min-w-[200px] ${freeMoney < 0
                    ? 'bg-red-50 border-red-100'
                    : 'bg-emerald-50 border-emerald-100'
                }`}>
                <span className={`text-xs font-medium uppercase tracking-widest flex items-center gap-1 ${freeMoney < 0 ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                    Dinheiro Livre <Zap className="w-3 h-3" />
                </span>
                <span className={`text-3xl font-bold mt-1 ${freeMoney < 0 ? 'text-red-900' : 'text-emerald-900'
                    }`}>
                    R$ {freeMoney.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
            </div>
        </div>
    );
}
