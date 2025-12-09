import prisma from '@/lib/prisma';
import { TxType } from '@prisma/client';

export const financeService = {
    async getDashboardData(userId: string) {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        // 1. Overall Balance (Aggregate)
        const balanceStats = await prisma.transaction.groupBy({
            by: ['type'],
            where: { userId },
            _sum: { amount: true }
        });

        let totalBalance = 0;
        balanceStats.forEach(stat => {
            const amount = Number(stat._sum.amount || 0);
            if (stat.type === 'INCOME') totalBalance += amount;
            else if (stat.type === 'EXPENSE') totalBalance -= amount;
        });

        // 2. Monthly Stats
        const monthTransactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: { gte: startOfMonth },
                type: { in: ['INCOME', 'EXPENSE'] }
            }
        });

        let monthIncome = 0;
        let monthExpense = 0;
        monthTransactions.forEach(tx => {
            const amount = Number(tx.amount);
            if (tx.type === 'INCOME') monthIncome += amount;
            else if (tx.type === 'EXPENSE') monthExpense += amount;
        });

        // 3. Goals
        const goals = await prisma.goal.findMany({
            where: { userId },
            take: 5,
            orderBy: { deadline: 'asc' }
        });

        // 4. Weekly Expenses for Chart
        const weekExpenses = await prisma.transaction.findMany({
            where: {
                userId,
                date: { gte: sevenDaysAgo },
                type: 'EXPENSE'
            },
            orderBy: { date: 'asc' }
        });

        // Group by day for the chart
        const chartDataMap = new Map<string, number>();
        // Initialize last 7 days with 0
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            chartDataMap.set(d.toLocaleDateString('pt-BR', { weekday: 'short' }), 0);
        }

        weekExpenses.forEach(tx => {
            const day = tx.date.toLocaleDateString('pt-BR', { weekday: 'short' });
            const current = chartDataMap.get(day) || 0;
            chartDataMap.set(day, current + Number(tx.amount));
        });

        // Convert to array and reverse to show chronological order if needed, 
        // but map logic above might handle ordering if we iterate carefully. 
        // Simpler: Just map the days array.
        const chartData = Array.from(chartDataMap.entries()).map(([name, value]) => ({ name, value })).reverse();

        // 5. Recent Transactions for GeoWidget
        const recentTransactions = await prisma.transaction.findMany({
            where: { userId },
            take: 5,
            orderBy: { date: 'desc' },
            include: { place: true }
        });

        return {
            balance: totalBalance,
            monthIncome,
            monthExpense,
            freeMoney: monthIncome - monthExpense, // Simplified "Free Money"
            goals,
            chartData,
            recentTransactions,
            routeEconomy: 42.50 // Mocked Value
        };
    }
}
