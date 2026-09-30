export function sessionDuration(start: string, end: string): string {
    const minutes = (value: string) => {
        const [hours, mins] = value.split(':').map(Number);
        return hours * 60 + mins;
    };
    const duration = minutes(end) - minutes(start);
    if (!Number.isFinite(duration) || duration <= 0) return 'Set session times';
    const hours = Math.floor(duration / 60);
    const remainder = duration % 60;
    return [hours ? `${hours}h` : '', remainder ? `${remainder}m` : '']
        .filter(Boolean)
        .join(' ');
}

export function sessionDate(value: string): string {
    return new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(value + 'T12:00:00Z'));
}
