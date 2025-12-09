import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Fab() {
    return (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
            <Button
                size="icon"
                className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-xl transition-transform hover:scale-105"
            >
                <Plus className="h-6 w-6 text-white" />
                <span className="sr-only">Nova Transação</span>
            </Button>
        </div>
    );
}
