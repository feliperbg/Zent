import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TransactionForm } from '../../_components/TransactionForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewTransactionPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    const { type: typeParam } = await searchParams;
    const initialType = (typeParam === 'EXPENSE' ? 'EXPENSE' : 'INCOME');
    const title = initialType === 'INCOME' ? 'Nova Receita' : 'Nova Despesa';

    return (
        <div className="p-6 md:p-8 max-w-2xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
                <Link
                    href="/"
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-6 w-6 text-slate-600" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <TransactionForm
                    userId={session.id as string}
                    initialType={initialType}
                />
            </div>
        </div>
    );
}
