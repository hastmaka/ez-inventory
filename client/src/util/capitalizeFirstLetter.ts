export function capitalizeWords(
    str: string,
    type: 'all' | 'first' | 'default' = 'default'
): string {
    const map = {
        all: () => str.toUpperCase(),
        first: () =>
            str
                .split(' ')
                .map(word =>
                    word.replace(/([a-zA-Z])/, c => c.toUpperCase()) // first letter inside word
                )
                .join(' '),
        default: () =>
            str
                .split('_')
                .map(word =>
                    word.replace(/([a-zA-Z])/, c => c.toUpperCase())
                )
                .join(' '),
    };

    return (map as Record<typeof type, () => string>)[type]();
}