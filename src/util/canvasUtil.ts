export function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });
}

export function getRadianAngle(degreeValue: number): number {
    return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number): { width: number; height: number } {
    const rotRad = getRadianAngle(rotation);

    return {
        width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}

export interface PixelCrop {
    x: number;
    y: number;
    width: number;
    height: number;
}

export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: PixelCrop,
    fileName: string,
    // flip: Flip = { horizontal: false, vertical: false }
): Promise<File | null> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const TARGET_WIDTH = 160;
    const TARGET_HEIGHT = 160;

    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;

    // Draw scaled crop into fixed 160x160 output
    ctx!.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        TARGET_WIDTH,
        TARGET_HEIGHT
    );

    return new Promise((resolve, reject) => {
        const tryEncode = (quality: number) => {
            canvas.toBlob(
                async (blob) => {
                    if (!blob) return reject(new Error('toBlob failed'));

                    if (blob.size <= 100 * 1024 || quality <= 0.5) {
                        const file = new File([blob], fileName, { type: 'image/jpeg' });
                        return resolve(file);
                    }

                    // Recurse with lower quality
                    tryEncode(quality - 0.05);
                },
                'image/jpeg',
                quality
            );
        };

        tryEncode(0.8); // Start with 80% quality
    });
}