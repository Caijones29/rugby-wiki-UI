export function formatPrettyDate(dateString: string): string {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(date);
}
