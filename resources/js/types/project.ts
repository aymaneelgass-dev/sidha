export const projectTypes = {
    'music-video': 'Music Video',
    advertisement: 'Advertisement',
    corporate: 'Corporate',
    'social-media': 'Social Media',
} as const;
export const projectStatuses = {
    brief: 'Brief',
    'pre-production': 'Pre-production',
    production: 'Production',
    'post-production': 'Post-production',
    validation: 'Validation',
    delivered: 'Delivered',
    archived: 'Archived',
} as const;
export type ProjectStatus = keyof typeof projectStatuses;
export type ProjectType = keyof typeof projectTypes;
export type Project = {
    id: number;
    reference: string;
    name: string;
    client_id: number;
    client: { id: number; name: string };
    type: ProjectType;
    status: ProjectStatus;
    budget: string;
    start_date: string | null;
    deadline: string | null;
    brief: string | null;
};
export type ProjectClient = { id: number; name: string; status: string };
export type ProjectFilters = {
    search: string;
    status: ProjectStatus | '';
    type: ProjectType | '';
};
export type ProjectExpense = {
    id: number;
    label: string;
    amount: string;
    expense_date: string | null;
    notes: string | null;
};
export type ProjectFinancials = {
    budget: string;
    total_expenses: string;
    estimated_margin: string;
};
