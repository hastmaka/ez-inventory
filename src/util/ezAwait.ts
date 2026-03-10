export async function ezAwait(
    delay: number = 2000,
    errorMessage?: string
) {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            if (errorMessage) {
                reject(new Error(errorMessage));
            } else {
                resolve();
            }
        }, delay);
    });
}