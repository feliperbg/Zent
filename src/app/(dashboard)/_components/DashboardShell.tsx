'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LucideLayoutDashboard,
    LucideWallet,
    LucideGoal,
    LucideMap,
    LucideSettings,
    LucideLogOut,
    LucideMenu,
    LucideX
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const closeSidebar = () => setIsSidebarOpen(false);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="h-16 bg-white border-b border-slate-200 md:hidden flex items-center px-4 sticky top-0 z-40 justify-between">
                <span className="font-bold text-emerald-600 text-lg">Zent App</span>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-md"
                >
                    <LucideMenu className="h-6 w-6" />
                </button>
            </header>

            {/* Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 h-16 flex items-center justify-between border-b border-slate-100">
                    <span className="text-lg font-bold text-emerald-600 tracking-tight">
                        Zent App
                    </span>
                    <button
                        onClick={closeSidebar}
                        className="md:hidden p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                    >
                        <LucideX className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <NavLink href="/" icon={LucideLayoutDashboard} active={pathname === '/'} onClick={closeSidebar}>
                        Dashboard
                    </NavLink>
                    <NavLink href="/transactions" icon={LucideWallet} active={pathname === '/transactions'} onClick={closeSidebar}>
                        Transações
                    </NavLink>
                    <NavLink href="/planning" icon={LucideGoal} active={pathname === '/planning'} onClick={closeSidebar}>
                        Planejamento
                    </NavLink>
                    <NavLink href="/geo-savings" icon={LucideMap} active={pathname === '/geo-savings'} onClick={closeSidebar}>
                        Economia Geo
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-1">
                    <NavLink href="/profile" icon={LucideSettings} active={pathname === '/profile'} onClick={closeSidebar}>
                        Configurações
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <LucideLogOut className="h-4 w-4" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-h-[calc(100vh-4rem)] md:min-h-screen overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}

function NavLink({
    href,
    icon: Icon,
    children,
    active,
    onClick
}: {
    href: string;
    icon: any;
    children: React.ReactNode;
    active: boolean;
    onClick?: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                active
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
            )}
        >
            <Icon className="h-4 w-4" />
            {children}
        </Link>
    )
}
