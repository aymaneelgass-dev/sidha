import type { ClientStatus } from '@/types/client';

export const studioServices = {
    'music-recording': 'Music Recording',
    'voice-over': 'Voice Over',
    podcast: 'Podcast',
    'audio-advertising': 'Audio Advertising',
};

export const studioStatuses = {
    scheduled: 'Scheduled',
    'in-progress': 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

export type StudioBooking = {
    id: number;
    client_id: number;
    client: { id: number; name: string };
    service_type: keyof typeof studioServices;
    booking_date: string;
    start_time: string;
    end_time: string;
    price: string;
    status: keyof typeof studioStatuses;
    notes: string | null;
};

export type StudioClient = { id: number; name: string; status: ClientStatus };
export type StudioFilters = {
    view: 'upcoming' | 'history';
    search: string;
    service_type: StudioBooking['service_type'] | '';
    status: StudioBooking['status'] | '';
    date: string;
};
