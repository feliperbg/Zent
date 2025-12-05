'use client';

import { useActionState } from 'react';
import { createTransaction } from '../actions';
import { Loader2 } from 'lucide-react';

const initialState = {
    success: false,
    error: '',
};

export function TransactionForm({ userId }: { userId: string }) {
    // @ts-ignore - React 19 types might be slightly out of sync with Next.js 15 RC for useActionState signature in some editors, but this is the pattern.
    // Converting the action to match the expected signature for useActionState if needed.
    // The action createTransaction returns { success: boolean, error?: ... }
    // We wrap it to match the state reducer pattern commonly used or just use it directly if compatible.

    // Wrapper to adapt the server action to useActionState signature: (state, payload) => newState
    const actionWrapper = async (prevState: any, formData: FormData) => {
        const result = await createTransaction(formData);
        return result;
    };

    const [state, formAction, isPending] = useActionState(actionWrapper, initialState);

    return (
        <form action={formAction} className="flex flex-col gap-4 max-w-sm">
            <input type="hidden" name="userId" value={userId} />

            <input
                type="number"
                name="amount"
                placeholder="Valor"
                step="0.01"
                className="border p-2 rounded"
                required
            />

            <select name="type" className="border p-2 rounded" defaultValue="INCOME">
                <option value="INCOME">Receita</option>
                <option value="EXPENSE">Despesa</option>
            </select>

            <input
                type="text"
                name="description"
                placeholder="Descrição"
                className="border p-2 rounded"
            />

            {state?.error && (
                <p className="text-sm text-red-600">
                    {typeof state.error === 'string' ? state.error : 'Erro na validação'}
                </p>
            )}

            {state?.success && (
                <p className="text-sm text-emerald-600">Transação criada!</p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="bg-black text-white p-2 rounded hover:bg-gray-800 flex justify-center items-center"
            >
                {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : 'Adicionar'}
            </button>
        </form>
    );
}
