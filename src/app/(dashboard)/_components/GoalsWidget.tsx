import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

interface Goal {
    id: string;
    name: string;
    targetAmount: any; // Decimal
    currentAmount: any; // Decimal
}

interface GoalsWidgetProps {
    goals: Goal[];
}

export function GoalsWidget({ goals }: GoalsWidgetProps) {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" /> Meus Cofres
            </h3>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                {goals.map((goal) => {
                    const target = Number(goal.targetAmount);
                    const current = Number(goal.currentAmount);
                    const progress = target > 0 ? (current / target) * 100 : 0;

                    return (
                        <Card key={goal.id} className="min-w-[280px] snap-center bg-white border-slate-100 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 truncate">
                                    {goal.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xl font-bold text-slate-800">
                                        {Math.round(progress)}%
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        R$ {current} / R$ {target}
                                    </span>
                                </div>
                                <Progress value={progress} className="h-2 bg-slate-100" indicatorClassName="bg-emerald-500" />
                            </CardContent>
                        </Card>
                    );
                })}

                {goals.length === 0 && (
                    <div className="p-4 text-sm text-slate-500 italic">
                        Nenhuma meta criada ainda.
                    </div>
                )}
            </div>
        </div>
    );
}
