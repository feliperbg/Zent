'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LucideCommand, LucideLoader2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
// In a real app, use next-auth/react 'signIn'

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        // Simulate login for this prototype step
        console.log('Login data:', data);

        // Simulating API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // In real app: await signIn('credentials', data);
        alert('Simulação: Login enviado (Verifique o console). Redirecionaria para Dashboard.');
        setLoading(false);
    };

    return (
        <div className="bg-white px-8 py-10 shadow-sm sm:rounded-xl border border-slate-200">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Email
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="seu@email.com"
                            className={`block w-full rounded-lg border px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm ${errors.email ? 'border-red-500' : 'border-slate-300'
                                }`}
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Senha
                    </label>
                    <div className="mt-1">
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••"
                            className={`block w-full rounded-lg border px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm ${errors.password ? 'border-red-500' : 'border-slate-300'
                                }`}
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-slate-500">
                            Ou continue com
                        </span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                    <button
                        type="button"
                        className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-colors"
                    >
                        <LucideCommand className="h-4 w-4 text-slate-900" />
                        <span className="text-sm font-semibold leading-6">Google</span>
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Não tem uma conta?{' '}
                    <Link href="/register" className="font-semibold leading-6 text-emerald-600 hover:text-emerald-500">
                        Registrar agora
                    </Link>
                </p>
            </div>
        </div>
    );
}
