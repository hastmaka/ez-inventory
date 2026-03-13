export function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('FileReader result is not a string'));
            }
        });

        reader.addEventListener('error', () => {
            reject(reader.error || new Error('Unknown FileReader error'));
        });

        reader.readAsDataURL(file);
    });
}