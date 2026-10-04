export type KpiTone = 'violet' | 'rose' | 'emerald' | 'blue';
export type ProjectStage = 'Planning' | 'Production' | 'Post-production';
export type BookingStatus = 'Confirmed' | 'Pending';
export type ActivityKind = 'approval' | 'upload' | 'project' | 'booking';

export type DashboardKpi = {
    id: string;
    label: string;
    value: string;
    trend: string;
    tone: KpiTone;
};

export type RevenuePoint = {
    month: string;
    revenue: number;
    expenses: number;
};

export type ProjectStatusPoint = {
    name: ProjectStage;
    value: number;
    color: string;
};

export type ActiveProject = {
    id: string;
    name: string;
    client: string;
    stage: ProjectStage;
    progress: number;
    deadline: string;
    budget: string;
    team: readonly string[];
};

export type ScheduleItem = {
    id: string;
    date: string;
    time: string;
    title: string;
    location: string;
    kind: 'shoot' | 'studio' | 'meeting';
};

export type StudioBooking = {
    id: string;
    room: string;
    client: string;
    time: string;
    status: BookingStatus;
};

export type RecentActivity = {
    id: string;
    message: string;
    time: string;
    kind: ActivityKind;
};

export type BudgetAllocation = {
    label: string;
    amount: number;
    color: string;
};

export type BudgetOverview = {
    total: number;
    used: number;
    remaining: number;
    percentage: number;
    allocations: readonly BudgetAllocation[];
};

export type DashboardData = {
    kpis: readonly DashboardKpi[];
    revenue: readonly RevenuePoint[];
    projectStatus: readonly ProjectStatusPoint[];
    activeProjects: readonly ActiveProject[];
    upcomingSchedule: readonly ScheduleItem[];
    studioBookings: readonly StudioBooking[];
    recentActivity: readonly RecentActivity[];
    budget: BudgetOverview;
};
