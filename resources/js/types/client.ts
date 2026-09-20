export type ClientStatus = 'active' | 'inactive' | 'archived';

export type ClientContact = {
    id: number;
    name: string;
    job_title: string | null;
    email: string | null;
    phone: string | null;
    is_primary: boolean;
};

export type ClientListItem = {
    id: number;
    name: string;
    industry: string | null;
    phone: string | null;
    status: ClientStatus;
    primary_contact: ClientContact | null;
};

export type ClientDetail = {
    id: number;
    name: string;
    industry: string | null;
    phone: string | null;
    website: string | null;
    address: string | null;
    notes: string | null;
    status: ClientStatus;
    created_at: string | null;
    updated_at: string | null;
    contacts: readonly ClientContact[];
};

export type ClientFilters = {
    search: string;
    status: ClientStatus | '';
};

export type ClientCounts = Record<ClientStatus | 'all', number>;

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedProp<T> = {
    current_page: number;
    data: readonly T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: readonly PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
};
