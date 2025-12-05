import prisma from '@/lib/prisma';

export const financeService = {
    async calculateBalance(userId: string) {
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            select: { amount: true, type: true }
        });

        let balance = 0;

        // Simple logic demonstration
        for (const tx of transactions) {
            const value = Number(tx.amount);
            if (tx.type === 'INCOME') {
                balance += value;
            } else if (tx.type === 'EXPENSE') {
                balance -= value;
            }
            // Transfer logic depends on context (internal vs external), assumed neutral here for simplicity of example
        }

        return balance;
    }
}
