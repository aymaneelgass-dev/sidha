export function money(value: string): string {
    const [whole, fraction = '00'] = value.split('.');
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return grouped + (fraction === '00' ? '' : '.' + fraction) + ' MAD';
}
export function productionDate(value: string | null): string {
    if (!value) return 'Not scheduled';
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(value + 'T12:00:00Z'));
}
