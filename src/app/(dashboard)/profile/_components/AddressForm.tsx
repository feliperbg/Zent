'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { toast } from 'sonner';
import { updateProfile } from '../actions';

interface AddressProps {
    user: any;
}

export function AddressForm({ user }: AddressProps) {
    const [loading, setLoading] = useState(false);
    const [cepLoading, setCepLoading] = useState(false);

    const maskCEP = (value: string) => {
        let v = value.replace(/\D/g, '').slice(0, 8);
        if (v.length > 5) {
            v = v.slice(0, 5) + '-' + v.slice(5);
        }
        return v;
    };

    // Form States
    const [cep, setCep] = useState(maskCEP(user.cep || ''));
    const [street, setStreet] = useState(user.street || '');
    const [number, setNumber] = useState(user.number || '');
    const [complement, setComplement] = useState(user.complement || ''); // New field
    const [neighborhood, setNeighborhood] = useState(user.neighborhood || '');
    const [city, setCity] = useState(user.city || '');
    const [state, setState] = useState(user.state || '');

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCep(maskCEP(e.target.value));
    };

    const handleCepSearch = async () => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length < 8) return;
        setCepLoading(true);
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await res.json();
            if (!data.erro) {
                setStreet(data.logradouro);
                setNeighborhood(data.bairro);
                setCity(data.localidade);
                setState(data.uf);
            }
        } catch (error) {
            console.error("Erro ao buscar CEP", error);
        } finally {
            setCepLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await updateProfile(user.id, { cep: cep.replace(/\D/g, ''), street, number, complement, neighborhood, city, state });

        if (res?.success || !res?.error) {
            toast.success('Endereço atualizado com sucesso!');
        } else {
            toast.error('Erro ao atualizar endereço');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                    <h3 className="font-semibold text-slate-900">Endereço Pessoal</h3>
                    <p className="text-sm text-slate-500">Seu endereço principal para entregas.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4 space-y-2">
                    <label className="text-sm font-medium text-slate-700">CEP</label>
                    <div className="flex gap-2">
                        <input
                            value={cep}
                            onChange={handleCepChange}
                            onBlur={handleCepSearch}
                            className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-slate-100 outline-none"
                            placeholder="00000-000"
                        />
                        <button type="button" onClick={handleCepSearch} disabled={cepLoading} className="p-2.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                            {cepLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Search className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <div className="md:col-span-5 space-y-2">
                    <label className="text-sm font-medium text-slate-700">Logradouro</label>
                    <input
                        value={street}
                        onChange={e => setStreet(e.target.value)}
                        className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                        placeholder="Rua..."
                    />
                </div>

                <div className="md:col-span-3 space-y-2">
                    <label className="text-sm font-medium text-slate-700">Número</label>
                    <input
                        value={number}
                        onChange={e => setNumber(e.target.value)}
                        className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-slate-100 outline-none"
                        placeholder="123"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Complemento <span className="text-slate-400 font-normal">(Opcional)</span></label>
                    <input
                        value={complement}
                        onChange={e => setComplement(e.target.value)}
                        className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-slate-100 outline-none"
                        placeholder="Apto 101, Bloco B..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Bairro</label>
                    <input
                        value={neighborhood}
                        onChange={e => setNeighborhood(e.target.value)}
                        className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Cidade</label>
                    <input
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Estado</label>
                    <input
                        value={state}
                        onChange={e => setState(e.target.value)}
                        className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                        placeholder="UF"
                    />
                </div>
            </div>

            <div className="pt-2 flex justify-end box-border">
                <Button disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto min-w-[150px]">
                    {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    Salvar Endereço
                </Button>
            </div>
        </form>
    );
}
