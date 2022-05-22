export function capitalize(value: string | undefined): string {
    if (!value || value.length === 0) return '';
    return value[0].toUpperCase() + value.slice(1);
}
