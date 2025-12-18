'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react";
import { toast } from 'sonner';
import { updatePersonalData, sendVerificationEmail, verifyAccount } from '../actions';
import { useRouter } from 'next/navigation';

function isValidCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    return true;
}

interface UserData {
    id: string;
    name: string | null;
    email: string;
    cpf: string | null;
    birthDate: Date | null;
    emailVerified: Date | null;
}

export function PersonalDataForm({ user }: { user: UserData }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);

    const maskCPF = (value: string) => {
        const v = value.replace(/\D/g, '').slice(0, 11);
        return v
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    // Form States
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [cpf, setCpf] = useState(maskCPF(user.cpf || ''));
    const [birthDate, setBirthDate] = useState(
        user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : ''
    );

    const handleCpfChange = (value: string) => {
        setCpf(maskCPF(value));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanCpf = cpf.replace(/\D/g, '');
        if (cleanCpf && !isValidCPF(cleanCpf)) {
            toast.error('CPF inválido');
            return;
        }

        setLoading(true);
        const res = await updatePersonalData(user.id, {
            name,
            email,
            cpf: cleanCpf, // Send clean CPF
            birthDate: birthDate ? new Date(birthDate) : null
        });

        if (res.success) {
            toast.success('Dados atualizados com sucesso!');
            router.refresh();
        } else {
            toast.error(res.error || 'Erro ao salvar');
        }
        setLoading(false);
    };

    const handleVerifyEmail = async () => {
        setVerifying(true);
        const res = await sendVerificationEmail(user.id);
        if (res.success) {
            setVerificationSent(true);
            toast.success('Email de verificação enviado!');
        } else {
            toast.error('Erro ao enviar email');
        }
        setVerifying(false);
    };

    return (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-lg font-semibold text-slate-900">Dados Pessoais</h2>
                {user.emailVerified ? (
                    <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-full">
                        <CheckCircle className="h-4 w-4" />
                        Verificado
                    </span>
                ) : (
                    <span className="flex items-center gap-1 text-amber-600 text-sm font-medium bg-amber-50 px-2 py-1 rounded-full">
                        <AlertCircle className="h-4 w-4" />
                        Não Verificado
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nome Completo</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-slate-100 outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <div className="flex gap-2">
                        <input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-slate-100 outline-none"
                        />
                        {!user.emailVerified && (
                            <button
                                type="button"
                                onClick={handleVerifyEmail}
                                disabled={verifying || verificationSent}
                                title="Enviar email de verificação"
                                className="p-2.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                            >
                                {verifying ? <Loader2 className="animate-spin h-5 w-5" /> : <Mail className="h-5 w-5" />}
                            </button>
                        )}
                    </div>
                    {!user.emailVerified && verificationSent && (
                        <p className="text-xs text-emerald-600 mt-1">Email enviado! Verifique sua caixa de entrada.</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">CPF</label>
                    <input
                        value={cpf}
                        onChange={e => handleCpfChange(e.target.value)}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-slate-100 outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Data de Nascimento</label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={e => setBirthDate(e.target.value)}
                        className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-slate-100 outline-none"
                    />
                </div>
            </div>

            <div className="pt-2 flex justify-end">
                <Button disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto">
                    {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    Salvar Dados
                </Button>
            </div>
        </form>
    );
}
