'use client';

import { useActionState, useEffect, useState } from 'react';
import { createTransaction } from '../actions';
import { Loader2, MapPin } from 'lucide-react';
import { useSmartLocation } from '@/hooks/useSmartLocation';

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

    // Smart Geo Context
    const { checkCurrentLocation, loading: locateLoading } = useSmartLocation();
    const [description, setDescription] = useState('');
    const [suggestedCategory, setSuggestedCategory] = useState('');

    const [pendingLocation, setPendingLocation] = useState<any>(null);

    const handleLocate = async () => {
        const result = await checkCurrentLocation(userId);
        if (result) {
            setPendingLocation(result);
        }
    };

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

            <input type="hidden" name="type" value={initialType} />
            <input type="hidden" name="suggestedCategory" value={suggestedCategory} />

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex justify-between items-center">
                    <span>Descrição</span>
                    <button
                        type="button"
                        onClick={handleLocate}
                        disabled={locateLoading}
                        className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                        title="Usar localização atual para preencher"
                    >
                        {locateLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                        {locateLoading ? 'Localizando...' : 'Onde estou?'}
                    </button>
                </label>
                <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Salário, Aluguel..."
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {suggestedCategory && (
                    <div className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                        <span>Categoria sugerida: <strong>{suggestedCategory}</strong></span>
                    </div>
                )}
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
            {/* Confirmation Modal */}
            {pendingLocation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                <MapPin className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Você está em {pendingLocation.name}?</h3>
                            <p className="text-sm text-slate-500 mt-1">Categoria sugerida: {pendingLocation.category}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setPendingLocation(null);
                                    // Open Maps to find correct place? User asked for this.
                                    // We can open a google maps search for current location or just let them type.
                                    window.open(`https://www.google.com/maps/search/?api=1&query=${pendingLocation.name}`, '_blank');
                                }}
                                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                            >
                                Não
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setDescription(pendingLocation.name);
                                    setSuggestedCategory(pendingLocation.category);
                                    setPendingLocation(null);
                                }}
                                className="px-4 py-2 bg-emerald-600 rounded-lg text-white font-medium hover:bg-emerald-700"
                            >
                                Sim
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
