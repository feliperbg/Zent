import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTransactions, getFixedExpenses, deleteFixedExpense } from '../actions';
import { CalendarView } from '../_components/CalendarView';
import { FixedExpenseForm } from '../_components/FixedExpenseForm';
import { Trash2 } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function TransactionsPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    const userId = session.id as string;
    const transactions = await getTransactions(userId);
    const fixedExpenses = await getFixedExpenses(userId);

    // Serialize data to avoid "Only plain objects can be passed to Client Components" error
    // Prisma Decimal is not serializable by Next.js
    const serializedTransactions = transactions.map(tx => ({
        ...tx,
        amount: Number(tx.amount)
    }));

    const serializedFixedExpenses = fixedExpenses.map(expense => ({
        ...expense,
        amount: Number(expense.amount)
    }));

    // Filter out fixed expenses from the transaction list to avoid duplication if checking pure transactions?
    // The requirement says "calendar with each expense ... new revenues and expenses adopt the entry date"
    // So calendar shows mixed content.

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900">Transações e Gastos Fixos</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Calendar */}
                <div className="lg:col-span-2 space-y-6">
                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-4">Calendário Financeiro</h2>
                        <CalendarView transactions={serializedTransactions} fixedExpenses={serializedFixedExpenses} />
                    </section>
                </div>

                {/* Right Column: Fixed Expenses Management */}
                <div className="space-y-8">
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-semibold text-slate-700 mb-4">Novo Gasto Fixo</h2>
                        <p className="text-sm text-slate-500 mb-6">Cadastre seus gastos recorrentes (ex: Aluguel, Internet) para visualizar no calendário.</p>
                        <FixedExpenseForm userId={userId} />
                    </section>

                    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-semibold text-slate-700 mb-4">Gastos Fixos Mensais ({serializedFixedExpenses.length})</h2>
                        <div className="space-y-3">
                            {serializedFixedExpenses.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-4">Nenhum gasto fixo cadastrado.</p>
                            ) : (
                                serializedFixedExpenses.map((expense) => (
                                    <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div>
                                            <p className="font-medium text-slate-900">{expense.description}</p>
                                            <div className="flex gap-2 text-xs text-slate-500">
                                                <span>Dia {expense.day}</span>
                                                <span>•</span>
                                                <span className={expense.type === 'EXPENSE' ? 'text-red-600' : 'text-emerald-600'}>
                                                    {expense.type === 'EXPENSE' ? 'Despesa' : 'Receita'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono font-medium text-slate-700">
                                                R$ {Number(expense.amount).toFixed(2)}
                                            </span>
                                            <form action={async () => {
                                                'use server';
                                                await deleteFixedExpense(expense.id, userId);
                                            }}>
                                                <button type="submit" className="text-slate-400 hover:text-red-500 transition-colors p-1">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
