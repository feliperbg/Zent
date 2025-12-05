import Link from 'next/link';
import {
    LucideLayoutDashboard,
    LucideWallet,
    LucideGoal,
    LucideMap,
    LucideSettings,
    LucideLogOut
} from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar - Desktop Fixed */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <div className="p-6 h-16 flex items-center border-b border-slate-100">
                    <span className="text-lg font-bold text-emerald-600 tracking-tight">
                        Finance App
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <NavLink href="/dashboard" icon={LucideLayoutDashboard}>Dashboard</NavLink>
                    <NavLink href="/transactions" icon={LucideWallet}>Transações</NavLink>
                    <NavLink href="/planning" icon={LucideGoal}>Planejamento</NavLink>
                    <NavLink href="/geo-savings" icon={LucideMap}>Economia Geo</NavLink>
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-1">
                    <NavLink href="/profile" icon={LucideSettings}>Configurações</NavLink>
                    <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <LucideLogOut className="h-4 w-4" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
                {/* Mobile Header (simulated) */}
                <header className="h-16 bg-white border-b border-slate-200 md:hidden flex items-center px-4 sticky top-0 z-40">
                    <span className="font-bold text-emerald-600">Finance App</span>
                </header>

                <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavLink({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-emerald-600 transition-colors"
        >
            <Icon className="h-4 w-4" />
            {children}
        </Link>
    )
}
