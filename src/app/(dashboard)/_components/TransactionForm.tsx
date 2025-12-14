'use client';

import { useActionState } from 'react';
import { createTransaction } from '../actions';
import { Loader2 } from 'lucide-react';

const initialState = {
    success: false,
    error: '',
};

export function TransactionForm({ userId, initialType = 'INCOME' }: { userId: string, initialType?: 'INCOME' | 'EXPENSE' }) {
    // Wrapper to adapt the server action to useActionState signature: (state, payload) => newState
    const actionWrapper = async (prevState: any, formData: FormData) => {
        const result = await createTransaction(formData);
        return result;
    };

    const [state, formAction, isPending] = useActionState(actionWrapper, initialState);

    return (
        <form action={formAction} className="flex flex-col gap-6 w-full max-w-md mx-auto">
            <input type="hidden" name="userId" value={userId} />

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Valor</label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500">R$</span>
                    <input
                        type="number"
                        name="amount"
                        placeholder="0,00"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono text-lg"
                        required
                        autoFocus
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Tipo</label>
                <select
                    name="type"
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    defaultValue={initialType}
                >
                    <option value="INCOME">Receita</option>
                    <option value="EXPENSE">Despesa</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Descrição</label>
                <input
                    type="text"
                    name="description"
                    placeholder="Ex: Salário, Aluguel..."
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            {state?.error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {typeof state.error === 'string' ? state.error : 'Erro na validação'}
                </div>
            )}

            {state?.success && (
                <div className="p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg border border-emerald-100">
                    Transação criada com sucesso!
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 font-medium shadow-sm active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-4"
            >
                {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : 'Salvar Transação'}
            </button>
        </form>
    );
}
