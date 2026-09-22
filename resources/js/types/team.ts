export type TeamMemberRole = 'admin' | 'member';

export type TeamMemberStatus = 'active' | 'suspended';

export type TeamMemberListItem = {
    id: number;
    name: string;
    email: string;
    job_title: string | null;
    phone: string | null;
    role: TeamMemberRole;
    status: TeamMemberStatus;
};

export type TeamMemberDetail = TeamMemberListItem;

export type TeamFilters = {
    search: string;
    role: TeamMemberRole | '';
    status: TeamMemberStatus | '';
};

export type TeamCounts = Record<TeamMemberStatus | 'all', number>;

export type TeamPaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedTeamMembers = {
    current_page: number;
    data: readonly TeamMemberListItem[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: readonly TeamPaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
};
