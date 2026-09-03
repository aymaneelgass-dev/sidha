import {
    Area,
    AreaChart,
    CartesianGrid,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import type { RevenuePoint } from '@/types';

const compactAmount = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
});

function formatAmount(value: number) {
    return compactAmount.format(value);
}

export function RevenueOverview({ data }: { data: readonly RevenuePoint[] }) {
    const chartData = [...data];

    return (
        <DashboardCard
            title="Revenue Overview"
            description="Revenue and expenses over the last six months"
            action={
                <span className="bg-muted text-muted-foreground rounded-md px-2.5 py-1.5 text-xs font-medium">
                    Last 6 months
                </span>
            }
            className="xl:col-span-8"
            contentClassName="pt-5"
        >
            <div
                className="h-72 min-h-0 w-full"
                role="img"
                aria-label="Revenue and expenses over the last six months"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="revenue-gradient"
                                x1="0"
                                x2="0"
                                y1="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="var(--chart-1)"
                                    stopOpacity={0.35}
                                />
                                <stop
                                    offset="100%"
                                    stopColor="var(--chart-1)"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            stroke="var(--border)"
                            strokeDasharray="3 3"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: 'var(--muted-foreground)',
                                fontSize: 12,
                            }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: 'var(--muted-foreground)',
                                fontSize: 12,
                            }}
                            tickFormatter={formatAmount}
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'var(--popover)',
                                border: '1px solid var(--border)',
                                borderRadius: '0.75rem',
                                color: 'var(--popover-foreground)',
                            }}
                            formatter={(value, name) => [
                                `${formatAmount(Number(value))} MAD`,
                                name === 'Revenue' ? 'Revenue' : 'Expenses',
                            ]}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            name="Revenue"
                            stroke="var(--chart-1)"
                            strokeWidth={2.5}
                            fill="url(#revenue-gradient)"
                            isAnimationActive={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="expenses"
                            name="Expenses"
                            stroke="var(--chart-3)"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </DashboardCard>
    );
}
