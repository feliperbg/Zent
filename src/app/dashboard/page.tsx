import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { financeService } from '@/lib/financeService';
import { DashboardHeader } from './_components/DashboardHeader';
import { KpiCards } from './_components/KpiCards';
import { GoalsWidget } from './_components/GoalsWidget';
import { ExpenseChart } from './_components/ExpenseChart';
import { GeoEconomyWidget } from './_components/GeoEconomyWidget';
import { Fab } from './_components/Fab';

export default async function DashboardPage() {
    const session = await getSession();
    const userEmail = (session as any)?.email;
    let userId = '';
    let userName = "Usuário";

    if (userEmail) {
        const user = await prisma.user.findUnique({ where: { email: userEmail } });
        if (user) {
            userId = user.id;
            userName = user.name || "Usuário";
        }
    }

    // Default empty data structure
    const emptyData = {
        balance: 0,
        monthIncome: 0,
        monthExpense: 0,
        freeMoney: 0,
        goals: [],
        chartData: [],
        recentTransactions: [],
        routeEconomy: 0
    };

    const dashboardData = userId ? await financeService.getDashboardData(userId) : emptyData;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8 pb-24">
            <div className="max-w-7xl mx-auto space-y-6">
                <DashboardHeader
                    userName={userName}
                    freeMoney={dashboardData.freeMoney || 0}
                />

                <KpiCards
                    monthIncome={dashboardData.monthIncome || 0}
                    monthExpense={dashboardData.monthExpense || 0}
                    routeEconomy={dashboardData.routeEconomy || 0}
                />

                <GoalsWidget goals={dashboardData.goals || []} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ExpenseChart data={dashboardData.chartData || []} />
                    <GeoEconomyWidget transactions={dashboardData.recentTransactions || []} />
                </div>
            </div>

            <Fab />
        </div>
    );
}
