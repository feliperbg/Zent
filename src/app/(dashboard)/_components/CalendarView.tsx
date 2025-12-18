'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
    transactions: any[];
    fixedExpenses: any[];
}

export function CalendarView({ transactions, fixedExpenses }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Create array of days
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    const getEventsForDay = (day: number) => {
        if (!day) return [];

        const events = [];

        // Add fixed expenses
        fixedExpenses.forEach(expense => {
            if (expense.day === day) {
                events.push({
                    type: 'fixed',
                    data: expense,
                    amount: Number(expense.amount),
                    isExpense: expense.type === 'EXPENSE'
                });
            }
        });

        // Add transactions for this specific date (month/year match)
        transactions.forEach(tx => {
            const txDate = new Date(tx.date);
            if (txDate.getDate() === day &&
                txDate.getMonth() === currentDate.getMonth() &&
                txDate.getFullYear() === currentDate.getFullYear()) {
                events.push({
                    type: 'transaction',
                    data: tx,
                    amount: Number(tx.amount),
                    isExpense: tx.type === 'EXPENSE'
                });
            }
        });

        return events;
    };

    const getEventStyle = (event: any) => {
        if (event.type === 'fixed') {
            return event.isExpense
                ? 'bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100' // Fixed Expense
                : 'bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100';    // Fixed Income
        } else {
            return event.isExpense
                ? 'bg-red-50 text-red-700 border border-red-100 hover:bg-red-100'       // Variable Expense
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'; // Variable Income
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative">
            <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold capitalize text-slate-800">{monthName}</h2>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-300"></div>
                        Receita Variável
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></div>
                        Despesa Variável
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>
                        Receita Fixa
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300"></div>
                        Despesa Fixa
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 text-center py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div>Dom</div>
                <div>Seg</div>
                <div>Ter</div>
                <div>Qua</div>
                <div>Qui</div>
                <div>Sex</div>
                <div>Sáb</div>
            </div>

            <div className="grid grid-cols-7 border-collapse">
                {days.map((day, idx) => {
                    const events = day ? getEventsForDay(day) : [];

                    return (
                        <div key={idx} className={`min-h-[100px] border-b border-r border-slate-100 p-1 ${!day ? 'bg-slate-50/50' : ''}`}>
                            {day && (
                                <>
                                    <div className="text-right">
                                        <span className={`text-xs ml-auto block w-6 h-6 leading-6 text-center rounded-full mb-1 ${day === new Date().getDate() &&
                                            currentDate.getMonth() === new Date().getMonth() &&
                                            currentDate.getFullYear() === new Date().getFullYear()
                                            ? 'bg-emerald-600 text-white font-bold'
                                            : 'text-slate-500'
                                            }`}>
                                            {day}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {events.slice(0, 3).map((event: any, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedEvent(event)}
                                                className={`text-[10px] px-1.5 py-0.5 rounded truncate text-left w-full transition-colors ${getEventStyle(event)}`}
                                            >
                                                {event.data.description}
                                            </button>
                                        ))}
                                        {events.length > 3 && (
                                            <div className="text-[10px] text-slate-400 text-center">
                                                +{events.length - 3} mais
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Event Details Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 space-y-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{selectedEvent.data.description}</h3>
                                <p className="text-sm text-slate-500">
                                    {selectedEvent.type === 'fixed' ? 'Gasto Fixo' : 'Transação'} • {selectedEvent.isExpense ? 'Despesa' : 'Receita'}
                                </p>
                            </div>
                            <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600">
                                <span className="sr-only">Fechar</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        <div className="py-4 border-t border-b border-slate-100 text-center">
                            <span className={`text-3xl font-bold ${selectedEvent.isExpense ? 'text-red-600' : 'text-emerald-600'}`}>
                                R$ {selectedEvent.amount.toFixed(2)}
                            </span>
                        </div>

                        {selectedEvent.type === 'transaction' && (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Data</span>
                                    <span className="font-medium text-slate-900">
                                        {new Date(selectedEvent.data.date).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                {selectedEvent.data.category && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Categoria</span>
                                        <span className="font-medium text-slate-900">{selectedEvent.data.category.name}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedEvent.type === 'fixed' && (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Dia de Vencimento</span>
                                    <span className="font-medium text-slate-900">Dia {selectedEvent.data.day}</span>
                                </div>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
