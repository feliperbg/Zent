'use client';

import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Fab() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Backdrop to close when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex flex-col items-end gap-4">
                {/* Menu Options */}
                <div className={cn(
                    "flex flex-col gap-3 transition-all duration-300 origin-bottom-right z-50",
                    isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-10 pointer-events-none"
                )}>
                    <Link href="/transaction/new?type=INCOME" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-4 group">
                            <span className="bg-white px-3 py-1 rounded-lg text-sm font-medium shadow-sm text-slate-600 group-hover:text-emerald-600 transition-colors">
                                Nova Receita
                            </span>
                            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                        </div>
                    </Link>

                    <Link href="/transaction/new?type=EXPENSE" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-4 group">
                            <span className="bg-white px-3 py-1 rounded-lg text-sm font-medium shadow-sm text-slate-600 group-hover:text-red-600 transition-colors">
                                Nova Despesa
                            </span>
                            <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <TrendingDown className="h-6 w-6" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Main Toggle Button */}
                <Button
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "h-14 w-14 rounded-full shadow-xl transition-all hover:scale-105 z-50",
                        isOpen ? "bg-slate-800 hover:bg-slate-900 rotate-45" : "bg-emerald-600 hover:bg-emerald-700"
                    )}
                >
                    {isOpen ? (
                        <Plus className="h-6 w-6 text-white" />
                    ) : (
                        <Plus className="h-6 w-6 text-white" />
                    )}
                    <span className="sr-only">Nova Transação</span>
                </Button>
            </div>
        </>
    );
}
