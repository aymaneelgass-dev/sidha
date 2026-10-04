import {
    Clapperboard,
    ReceiptText,
    TrendingUp,
    WalletCards,
    type LucideIcon,
} from 'lucide-react';
import type { DashboardKpi, KpiTone } from '@/types';

const iconByKpiId: Record<string, LucideIcon> = {
    revenue: WalletCards,
    expenses: ReceiptText,
    profit: TrendingUp,
    projects: Clapperboard,
};

const toneClasses: Record<KpiTone, string> = {
    violet: 'bg-primary/12 text-primary',
    rose: 'bg-rose-500/12 text-rose-600 dark:text-rose-300',
    emerald: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
    blue: 'bg-blue-500/12 text-blue-700 dark:text-blue-300',
};

export function DashboardKpiCard({ kpi }: { kpi: DashboardKpi }) {
    const Icon = iconByKpiId[kpi.id] ?? WalletCards;

    return (
        <section className="bg-card text-card-foreground min-w-0 rounded-xl border p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-muted-foreground truncate text-sm font-medium">
                        {kpi.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                        {kpi.value}
                    </p>
                </div>
                <span
                    className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl ${toneClasses[kpi.tone]}`}
                >
                    <Icon className="size-5" aria-hidden="true" />
                </span>
            </div>
            <p className="text-muted-foreground mt-4 text-xs font-medium">
                {kpi.trend}
            </p>
        </section>
    );
}
