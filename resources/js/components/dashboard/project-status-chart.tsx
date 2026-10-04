import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import type { ProjectStatusPoint } from '@/types';

export function ProjectStatusChart({
    data,
}: {
    data: readonly ProjectStatusPoint[];
}) {
    const chartData = [...data];
    const total = data.reduce((sum, status) => sum + status.value, 0);

    return (
        <DashboardCard
            title="Project Status"
            description={`${total} active projects across production stages`}
            className="xl:col-span-4"
            contentClassName="pt-4"
        >
            <div
                className="relative mx-auto h-52 max-w-72"
                role="img"
                aria-label={`${total} active projects by status`}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip
                            contentStyle={{
                                background: 'var(--popover)',
                                border: '1px solid var(--border)',
                                borderRadius: '0.75rem',
                                color: 'var(--popover-foreground)',
                            }}
                            formatter={(value) => [
                                `${Number(value)} projects`,
                                'Projects',
                            ]}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius="62%"
                            outerRadius="84%"
                            paddingAngle={3}
                            stroke="none"
                            isAnimationActive={false}
                        >
                            {chartData.map((status) => (
                                <Cell key={status.name} fill={status.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-semibold tracking-tight">
                        {total}
                    </span>
                    <span className="text-muted-foreground text-xs">
                        Active projects
                    </span>
                </div>
            </div>
            <ul
                className="mt-2 grid gap-2 text-sm"
                aria-label="Project status legend"
            >
                {data.map((status) => (
                    <li
                        key={status.name}
                        className="flex items-center justify-between gap-3"
                    >
                        <span className="flex min-w-0 items-center gap-2">
                            <span
                                className="size-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: status.color }}
                                aria-hidden="true"
                            />
                            <span className="truncate">{status.name}</span>
                        </span>
                        <span className="text-muted-foreground font-medium">
                            {status.value}
                        </span>
                    </li>
                ))}
            </ul>
        </DashboardCard>
    );
}
