export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-emerald-600">
                        Concorrente do Porquinho
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Gestão financeira inteligente
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
}
