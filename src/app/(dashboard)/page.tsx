import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { financeService } from '@/lib/financeService';
import { DashboardHeader } from './_components/DashboardHeader';
import { KpiCards } from './_components/KpiCards';
import { GoalsWidget } from './_components/GoalsWidget';
import { ExpenseChart } from './_components/ExpenseChart';
import { GeoEconomyWidget } from './_components/GeoEconomyWidget';
import { Fab } from './_components/Fab';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    console.log(session);
    const userId = session.id as string;
    const userName = (session as any).name || (session.email as string)?.split('@')[0] || "Usuário";

    // Fetch real data
    const dashboardData = await financeService.getDashboardData(userId);

    return (
        <div className="min-h-screen p-6 md:p-8 pb-24">
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
