export function imageToBase64(file: File | null): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as string); // cast result to string since it's a data URL
        };

        reader.onerror = reject;
        reader.readAsDataURL(file!);
    });
}