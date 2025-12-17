'use client';

import { useActionState } from 'react';
import { createFixedExpense } from '../actions';
import { Loader2 } from 'lucide-react';

const initialState = {
    success: false,
    error: '',
};

export function FixedExpenseForm({ userId }: { userId: string }) {
    const actionWrapper = async (prevState: any, formData: FormData) => {
        return createFixedExpense(formData);
    };

    const [state, formAction, isPending] = useActionState(actionWrapper, initialState);

    return (
        <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="userId" value={userId} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Descrição</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Ex: Aluguel"
                        className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Valor</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-500">R$</span>
                        <input
                            type="number"
                            name="amount"
                            placeholder="0,00"
                            step="0.01"
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Dia do Vencimento</label>
                    <input
                        type="number"
                        name="day"
                        min="1"
                        max="31"
                        placeholder="Dia (1-31)"
                        className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Tipo</label>
                    <select
                        name="type"
                        className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        defaultValue="EXPENSE"
                    >
                        <option value="EXPENSE">Despesa</option>
                        <option value="INCOME">Receita</option>
                    </select>
                </div>
            </div>

            {state?.error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {typeof state.error === 'string' ? state.error : 'Erro na validação'}
                </div>
            )}

            {state?.success && (
                <div className="p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg border border-emerald-100">
                    Gasto fixo adicionado!
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 font-medium shadow-sm active:scale-[0.98] transition-all flex justify-center items-center gap-2"
            >
                {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : 'Adicionar Gasto Fixo'}
            </button>
        </form>
    );
}
