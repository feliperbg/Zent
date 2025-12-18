'use client';

import { AddressForm } from './AddressForm';
import { SavedPlaces } from './SavedPlaces';

interface MyAddressesProps {
    user: any;
}

export function MyAddresses({ user }: MyAddressesProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-900">Meus Endereços</h2>
                <p className="text-sm text-slate-500">Gerencie seus endereços pessoais e lugares frequentados.</p>
            </div>

            <div className="p-6">
                <AddressForm user={user} />
            </div>

            <div className="h-px bg-slate-100 mx-6" />

            <SavedPlaces userId={user.id} places={user.savedPlaces} />
        </div>
    );
}
