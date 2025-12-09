export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full font-sans">
            {/* Left Panel - Branding & Marketing */}
            <div className="hidden lg:flex w-[55%] relative flex-col justify-center px-16 bg-[#020b10] overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0c3a2d] to-[#020b10] opacity-100" />

                {/* Content */}
                <div className="relative z-10 max-w-lg">
                    {/* Logo/Icon */}
                    <div className="mb-12">
                        <div className="h-14 w-14 bg-[#10b981] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <span className="text-white text-2xl font-bold">$</span>
                        </div>
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                        Domine suas finanças<br />
                        com elegância.
                    </h1>

                    <p className="text-lg text-gray-400 mb-12 leading-relaxed max-w-md">
                        Junte-se a milhares de usuários que transformaram sua vida financeira com o Zent. Controle, planejamento e inteligência em um só lugar.
                    </p>

                    <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                        <div className="flex -space-x-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-10 w-10 rounded-full bg-gray-600 border-4 border-[#09221e]" />
                            ))}
                        </div>
                        <span>Usado por +10.000 profissionais</span>
                    </div>
                </div>
            </div>

            {/* Right Panel - Auth Forms */}
            <div className="flex w-full lg:w-[45%] items-center justify-center bg-white px-8 py-12">
                <div className="w-full max-w-[400px]">
                    {children}
                </div>
            </div>
        </div>
    );
}
