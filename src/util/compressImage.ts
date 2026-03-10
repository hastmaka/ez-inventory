const MAX_DIMENSION = 920;
const MAX_SIZE_KB = 100;
const INITIAL_QUALITY = 0.8;
const MIN_QUALITY = 0.5;
const QUALITY_STEP = 0.05;

const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = (err) => {
            URL.revokeObjectURL(url);
            reject(err);
        };
        img.src = url;
    });
};

const encodeToBlob = (
    canvas: HTMLCanvasElement,
    quality: number,
): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) return reject(new Error('canvas.toBlob failed'));
                resolve(blob);
            },
            'image/jpeg',
            quality,
        );
    });
};

export async function compressImage(file: File): Promise<File> {
    if (!file.type.startsWith('image/')) {
        return file;
    }

    const img = await loadImage(file);
    let {width, height} = img;

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const scale = MAX_DIMENSION / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx!.drawImage(img, 0, 0, width, height);

    let quality = INITIAL_QUALITY;
    let blob = await encodeToBlob(canvas, quality);

    while (blob.size > MAX_SIZE_KB * 1024 && quality > MIN_QUALITY) {
        quality -= QUALITY_STEP;
        blob = await encodeToBlob(canvas, quality);
    }

    const name = file.name.replace(/\.[^.]+$/, '.jpg');
    return new File([blob], name, {type: 'image/jpeg'});
}
