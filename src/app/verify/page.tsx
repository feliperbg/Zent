import { verifyAccount } from '../(dashboard)/profile/actions';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface VerifyPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function VerifyPage(props: VerifyPageProps) {
    const searchParams = await props.searchParams;
    const token = typeof searchParams.token === 'string' ? searchParams.token : undefined;

    if (!token) {
        return <VerifyError message="Token de verificação inválido ou ausente." />;
    }

    const result = await verifyAccount(token);

    if (!result.success) {
        return <VerifyError message={result.error || 'Erro ao verificar conta.'} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-6">
                <div className="mx-auto h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">Conta Verificada!</h1>
                    <p className="text-slate-600">Sua conta foi confirmada com sucesso. Você já pode aproveitar todos os recursos do Zent.</p>
                </div>

                <Link
                    href="/profile"
                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors gap-2"
                >
                    Voltar para o Perfil
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}

function VerifyError({ message }: { message: string }) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-6">
                <div className="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-10 w-10 text-red-600" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">Falha na Verificação</h1>
                    <p className="text-slate-600">{message}</p>
                </div>

                <Link
                    href="/profile"
                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors gap-2"
                >
                    Voltar para o Perfil
                </Link>
            </div>
        </div>
    );
}
