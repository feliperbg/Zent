'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Car, Trash2 } from "lucide-react";
import { toast } from 'sonner';
import { addVehicle, deleteVehicle } from '../actions';

interface VehicleProps {
    userId: string;
    vehicles: any[];
}

export function VehicleList({ userId, vehicles }: VehicleProps) {
    const [isAdding, setIsAdding] = useState(false);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-lg font-semibold text-slate-900">Meus Veículos</h2>
                <Button variant="outline" size="sm" onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? 'Cancelar' : 'Adicionar Veículo'}
                </Button>
            </div>

            {isAdding && <VehicleForm userId={userId} onSuccess={() => setIsAdding(false)} />}

            <div className="space-y-3">
                {vehicles.length === 0 && !isAdding && (
                    <p className="text-slate-500 text-sm">Nenhum veículo cadastrado.</p>
                )}

                {vehicles.map(v => (
                    <VehicleItem key={v.id} vehicle={v} />
                ))}
            </div>
        </div>
    );
}

function VehicleForm({ userId, onSuccess }: { userId: string, onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);

    // FIPE States
    const [brands, setBrands] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [years, setYears] = useState<any[]>([]);

    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const [fuelType, setFuelType] = useState('GASOLINE');
    const [avgConsumption, setAvgConsumption] = useState('');
    const [isFuelDisabled, setIsFuelDisabled] = useState(true);

    useEffect(() => {
        fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas')
            .then(res => res.json())
            .then(setBrands);
    }, []);

    const handleBrandChange = async (brandId: string) => {
        setSelectedBrand(brandId);
        const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandId}/modelos`);
        const data = await res.json();
        setModels(data.modelos);
        setSelectedModel('');
        setYears([]);
        setIsFuelDisabled(true);
    };

    const handleModelChange = async (modelId: string) => {
        setSelectedModel(modelId);
        const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${selectedBrand}/modelos/${modelId}/anos`);
        const data = await res.json();
        setYears(data);
        setIsFuelDisabled(true);
    };

    const handleYearChange = (yearId: string) => {
        setSelectedYear(yearId);
        const yearObj = years.find(y => y.codigo === yearId);
        if (yearObj) {
            // Check for ambiguity (same display year)
            const displayYear = yearObj.nome.split(' ')[0];
            const matchingYears = years.filter(y => y.nome.split(' ')[0] === displayYear);

            // If more than one option shares the same year (e.g. 2022 Gasolina, 2022 Hybrid), unlock selection
            setIsFuelDisabled(matchingYears.length <= 1);

            const name = yearObj.nome.toLowerCase();
            if (name.includes('gasolina')) setFuelType('GASOLINE');
            else if (name.includes('diesel')) setFuelType('DIESEL');
            else if (name.includes('etanol') || name.includes('alcool')) setFuelType('ETHANOL');
            else if (name.includes('flex')) setFuelType('FLEX');
            else if (name.includes('elétrico') || name.includes('eletrico')) setFuelType('ELECTRIC');
            else if (name.includes('hybrid') || name.includes('híbrido') || name.includes('hibrido') || name.includes('híb')) setFuelType('HYBRID');
            else setFuelType('GASOLINE'); // Default
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const brandName = brands.find(b => b.codigo === selectedBrand)?.nome;
        const modelName = models.find(m => m.codigo === selectedModel)?.nome || selectedModel;

        if (!modelName) {
            toast.error('Erro: Modelo não identificado. Tente selecionar novamente.');
            return;
        }

        setLoading(true);
        const res = await addVehicle(userId, {
            brand: brandName,
            model: modelName,
            year: selectedYear,
            fuelType,
            avgConsumption,
            fipeCode: ''
        });

        if (res?.success || !res?.error) {
            toast.success('Veículo adicionado com sucesso!');
        } else {
            toast.error('Erro ao adicionar veículo');
        }

        setLoading(false);
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg space-y-4 border border-slate-200">
            <h3 className="font-medium text-slate-900 border-b pb-2 mb-4">Adicionar Novo Veículo</h3>

            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Marca</label>
                    <select
                        className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-slate-200 outline-none"
                        onChange={e => handleBrandChange(e.target.value)}
                        value={selectedBrand}
                        required
                    >
                        <option value="">Selecione a Marca</option>
                        {brands.map(b => (
                            <option key={b.codigo} value={b.codigo}>{b.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Modelo</label>
                    <select
                        className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-slate-200 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                        onChange={e => handleModelChange(e.target.value)}
                        value={selectedModel}
                        disabled={!selectedBrand}
                        required
                    >
                        <option value="">Selecione o Modelo</option>
                        {models.map(m => (
                            <option key={m.codigo} value={m.codigo}>{m.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Ano</label>
                        <select
                            className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-slate-200 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                            onChange={e => handleYearChange(e.target.value)}
                            value={selectedYear}
                            disabled={!selectedModel}
                            required
                        >
                            <option value="">Selecione o Ano</option>
                            {years.map(y => {
                                const yearPart = y.nome.split(' ')[0];
                                const displayYear = yearPart === '32000' || yearPart === '3200' ? 'Zero KM' : yearPart;
                                return <option key={y.codigo} value={y.codigo}>{displayYear}</option>;
                            })}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Combustível</label>
                        <select
                            className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-slate-200 outline-none disabled:bg-slate-50 disabled:text-slate-500"
                            value={fuelType}
                            onChange={e => setFuelType(e.target.value)}
                            disabled={isFuelDisabled}
                        >
                            <option value="GASOLINE">Gasolina</option>
                            <option value="ETHANOL">Etanol</option>
                            <option value="FLEX">Flex</option>
                            <option value="DIESEL">Diesel</option>
                            <option value="ELECTRIC">Elétrico</option>
                            <option value="HYBRID">Híbrido</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Consumo Médio (km/l)</label>
                <input
                    type="number"
                    step="0.1"
                    placeholder="Ex: 10.5"
                    className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-slate-200 outline-none"
                    value={avgConsumption}
                    onChange={e => setAvgConsumption(e.target.value)}
                    required
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white hover:bg-slate-800 h-11">
                {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Salvar Veículo'}
            </Button>
        </form>
    );
}

function VehicleItem({ vehicle }: { vehicle: any }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Remover veículo?")) return;
        setLoading(true);
        await deleteVehicle(vehicle.id);
        setLoading(false);
    }

    return (
        <div className="flex justify-between items-center p-3 border rounded-lg bg-white">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Car className="h-5 w-5" />
                </div>
                <div>
                    <p className="font-medium text-slate-900">{vehicle.brand} {vehicle.model}</p>
                    <p className="text-xs text-slate-500">{vehicle.fuelType} • {vehicle.avgConsumption} km/l</p>
                </div>
            </div>
            <button onClick={handleDelete} disabled={loading} className="text-slate-400 hover:text-red-600 p-2">
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
            </button>
        </div>
    )
}
