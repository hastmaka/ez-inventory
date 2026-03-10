import { useEffect, useState } from 'react';

export function useResolvedImageSrc(imgPath?: File | string): string | undefined {
    const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!imgPath) {
            setImgSrc(undefined);
            return;
        }

        if (typeof imgPath === 'string') {
            setImgSrc(imgPath);
        } else {
            const objectUrl = URL.createObjectURL(imgPath);
            setImgSrc(objectUrl);

            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        }
    }, [imgPath]);

    return imgSrc;
}