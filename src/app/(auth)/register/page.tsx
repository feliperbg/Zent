'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/login');
            } else {
                const data = await res.json();
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Crie sua conta</h2>
                <p className="text-sm text-gray-500">
                    Comece sua jornada financeira com o Zent.
                </p>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="name">
                        Nome Completo
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-lg bg-slate-100 border-transparent px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                        placeholder="Seu nome"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-lg bg-slate-100 border-transparent px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                        placeholder="name@example.com"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="password">
                        Senha
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full rounded-lg bg-slate-100 border-transparent px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                        placeholder="••••••••••••"
                        required
                        minLength={6}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-semibold py-3 px-4 shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? 'Criando conta...' : 'Cadastrar'}
                </button>
            </form>

            <p className="text-center text-sm text-gray-500">
                Já tem uma conta?{' '}
                <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-500">
                    Entrar agora
                </Link>
            </p>
        </div>
    );
}
