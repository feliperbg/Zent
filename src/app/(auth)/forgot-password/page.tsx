'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setSuccess(true);
            } else {
                const data = await res.json();
                setError(data.error || 'Erro ao enviar email');
            }
        } catch (err) {
            setError('Erro de conexão');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Recuperar Senha</h2>
                <p className="text-sm text-gray-500">
                    Digite seu email para receber um link de redefinição.
                </p>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                    {error}
                </div>
            )}

            {success ? (
                <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                        Se houver uma conta associada a <strong>{email}</strong>, enviaremos um link de recuperação.
                    </div>
                    <Link href="/login" className="block w-full text-center text-sm font-medium text-emerald-600 hover:text-emerald-500">
                        Voltar para o Login
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg bg-slate-100 border-transparent px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-semibold py-3 px-4 shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? 'Enviando...' : 'Enviar Link'}
                    </button>

                    <div className="text-center">
                        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                            Voltar para o Login
                        </Link>
                    </div>
                </form>
            )}
        </div>
    );
}
