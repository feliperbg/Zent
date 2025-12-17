'use client';

import { useState } from 'react';
import { PlaceType } from '@prisma/client';
import { addSavedPlace, deleteSavedPlace } from '@/app/actions/places';
import { MapPin, Plus, Trash2, Home, Briefcase, ShoppingBag, Loader2 } from 'lucide-react';
import { useSmartLocation } from '@/hooks/useSmartLocation';
import { toast } from 'sonner';

interface SavedPlacesProps {
    userId: string;
    places: any[]; // Using any primarily, avoid importing Place type client side if possible or type loosely
}

export function SavedPlaces({ userId, places }: SavedPlacesProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newPlaceName, setNewPlaceName] = useState('');
    const [newPlaceType, setNewPlaceType] = useState<PlaceType>('OTHER');
    const [loading, setLoading] = useState(false);

    // Popup State
    const [pendingLocation, setPendingLocation] = useState<any>(null);

    const { checkCurrentLocation } = useSmartLocation();

    const handleSaveCurrentLocation = async () => {
        const result = await checkCurrentLocation();
        if (result) {
            setPendingLocation(result);
        }
    };

    return (
        <div className="divide-y divide-slate-100">
            <div className="p-6 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-slate-900">Locais Salvos</h3>
                    <p className="text-sm text-slate-500">Seus lugares frequentes.</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="text-sm bg-emerald-50 text-emerald-600 px-3 py-2 rounded-lg font-medium hover:bg-emerald-100 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Novo Local
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="p-6 bg-slate-50 space-y-4 animate-in slide-in-from-top-2 border-b border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Nome do Local</label>
                            <input
                                type="text"
                                value={newPlaceName}
                                onChange={e => setNewPlaceName(e.target.value)}
                                placeholder="Ex: Minha Casa"
                                className="w-full p-2 border border-slate-200 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Tipo</label>
                            <select
                                value={newPlaceType}
                                onChange={e => setNewPlaceType(e.target.value as PlaceType)}
                                className="w-full p-2 border border-slate-200 rounded-lg"
                            >
                                <option value="HOME">Casa</option>
                                <option value="WORK">Trabalho</option>
                                <option value="STORE">Comércio</option>
                                <option value="OTHER">Outro</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="text-sm text-slate-600 px-4 py-2 hover:text-slate-900"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={handleSaveCurrentLocation}
                            disabled={loading}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                            <MapPin className="w-4 h-4" />
                            Salvar Local Atual
                        </button>
                    </div>
                </div>
            )}

            <div className="divide-y divide-slate-100">
                {places.map(place => (
                    <div key={place.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                {place.type === 'HOME' && <Home className="w-5 h-5" />}
                                {place.type === 'WORK' && <Briefcase className="w-5 h-5" />}
                                {place.type === 'STORE' && <ShoppingBag className="w-5 h-5" />}
                                {place.type === 'OTHER' && <MapPin className="w-5 h-5" />}
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-900">{place.name}</h3>
                                <p className="text-xs text-slate-500">Lat: {place.latitude.toFixed(4)}, Lng: {place.longitude.toFixed(4)}</p>
                            </div>
                        </div>
                        <DeletePlaceButton placeId={place.id} userId={userId} />
                    </div>
                ))}
            </div>

            {/* Confirmation Modal */}
            {pendingLocation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                <MapPin className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Confirme o Local</h3>
                            <p className="text-sm text-slate-500 mt-1">O GPS identificou: <strong className="text-slate-900">{pendingLocation.name}</strong></p>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={async () => {
                                    setLoading(true);
                                    await addSavedPlace(userId, {
                                        name: newPlaceName || pendingLocation.name,
                                        type: newPlaceType,
                                        latitude: pendingLocation.latitude,
                                        longitude: pendingLocation.longitude
                                    });
                                    setIsAdding(false);
                                    setNewPlaceName('');
                                    setPendingLocation(null);
                                    toast.success('Local salvo!');
                                    setLoading(false);
                                }}
                                className="w-full py-3 bg-emerald-600 rounded-lg text-white font-medium hover:bg-emerald-700 flex items-center justify-center gap-2"
                            >
                                Sim, é aqui
                            </button>

                            {pendingLocation.alternatives && pendingLocation.alternatives.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center pt-2">Ou selecione outro:</p>
                                    <div className="space-y-1">
                                        {pendingLocation.alternatives.map((alt: any, idx: number) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={async () => {
                                                    setLoading(true);
                                                    await addSavedPlace(userId, {
                                                        name: alt.name,
                                                        type: newPlaceType,
                                                        latitude: alt.latitude,
                                                        longitude: alt.longitude
                                                    });
                                                    setIsAdding(false);
                                                    setNewPlaceName('');
                                                    setPendingLocation(null);
                                                    toast.success('Local salvo!');
                                                    setLoading(false);
                                                }}
                                                className="w-full text-left p-3 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all text-sm text-slate-700 flex items-center gap-2"
                                            >
                                                <div className="h-2 w-2 rounded-full bg-slate-300" />
                                                {alt.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => {
                                    setNewPlaceName(pendingLocation.name); // Pre-fill name for manual edit
                                    setPendingLocation(null);
                                    toast('Edite o nome e tente salvar novamente.', { duration: 4000 });
                                }}
                                className="w-full py-2 text-slate-500 text-sm hover:text-slate-900"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DeletePlaceButton({ placeId, userId }: { placeId: string, userId: string }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Remover este local?')) return;
        setLoading(true);
        await deleteSavedPlace(placeId, userId);
        setLoading(false);
        toast.success('Local removido');
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="text-slate-400 hover:text-red-500 transition-colors p-2"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
    );
}
