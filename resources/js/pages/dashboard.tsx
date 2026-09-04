import { Head } from '@inertiajs/react';
import { ActiveProjects } from '@/components/dashboard/active-projects';
import { BudgetOverviewCard } from '@/components/dashboard/budget-overview';
import { DashboardKpiCard } from '@/components/dashboard/dashboard-kpi-card';
import { ProjectStatusChart } from '@/components/dashboard/project-status-chart';
import { RecentActivityList } from '@/components/dashboard/recent-activity';
import { RevenueOverview } from '@/components/dashboard/revenue-overview';
import { StudioBookings } from '@/components/dashboard/studio-bookings';
import { UpcomingSchedule } from '@/components/dashboard/upcoming-schedule';
import { dashboardDemoData } from '@/data/dashboard-demo';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <h1 className="sr-only">Dashboard</h1>
            <div className="space-y-4 p-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {dashboardDemoData.kpis.map((kpi) => (
                        <DashboardKpiCard key={kpi.id} kpi={kpi} />
                    ))}
                </div>
                <div className="grid min-w-0 gap-4 xl:grid-cols-12">
                    <RevenueOverview data={dashboardDemoData.revenue} />
                    <ProjectStatusChart
                        data={dashboardDemoData.projectStatus}
                    />
                    <ActiveProjects
                        projects={dashboardDemoData.activeProjects}
                    />
                    <UpcomingSchedule
                        items={dashboardDemoData.upcomingSchedule}
                    />
                    <StudioBookings
                        bookings={dashboardDemoData.studioBookings}
                    />
                    <RecentActivityList
                        activities={dashboardDemoData.recentActivity}
                    />
                    <BudgetOverviewCard budget={dashboardDemoData.budget} />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    title: 'Dashboard',
    description: 'Creative production at a glance.',
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
