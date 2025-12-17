import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { PersonalDataForm } from './_components/PersonalDataForm';
import { VehicleList } from './_components/VehicleList';
import { MyAddresses } from './_components/MyAddresses';
import { User, Mail, Shield } from 'lucide-react';

export default async function ProfilePage() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.id as string },
        include: { vehicles: true, savedPlaces: true }
    });

    if (!user) redirect('/login');

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
                    <p className="text-slate-500">Gerencie seus dados e preferências.</p>
                </div>
                <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                        {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-sm">{user.name || 'Usuário'}</h2>
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">
                                {user.plan}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                </div>
            </header>

            <div className="space-y-8">
                {/* Personal Info Form */}
                <PersonalDataForm user={user} />

                {/* Side by Side Forms */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                    <MyAddresses user={user} />
                    <VehicleList userId={user.id} vehicles={user.vehicles} />
                </div>
            </div>
        </div>
    );
}
