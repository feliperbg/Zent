import { financeService } from '@/lib/financeService';
import { TransactionForm } from './_components/TransactionForm';

// Mock user ID for demonstration
const MOCK_USER_ID = 'demo-user-123';

export default async function DashboardPage() {
    // VIEW calls SERVICE directly for read operations (Server Components pattern)
    const balance = await financeService.calculateBalance(MOCK_USER_ID);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            <div className="p-4 border rounded shadow mb-6">
                <h2 className="text-xl">Saldo Atual</h2>
                <p className="text-3xl font-mono">R$ {balance.toFixed(2)}</p>
            </div>

            <div className="p-4 border rounded shadow">
                <h2 className="text-xl mb-4">Nova Transação (MVC Action Test)</h2>
                <TransactionForm userId={MOCK_USER_ID} />
            </div>
        </div>
    );
}
