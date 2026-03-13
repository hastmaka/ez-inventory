import React from 'react';
import { Center } from '@mantine/core';
import {useResolvedImageSrc} from "@/util/hook/useResolveImageSrc.tsx";
import NoImage from "@/components/NoImage.tsx";

interface ImagePreviewProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    file: File;
    className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
    file,
    className,
    ...rest
}) => {
    const imgSrc = useResolvedImageSrc(file);

    return (
        <div className={className}>
            <Center>
                {file
                    ? <img src={imgSrc} alt="Profile Picture" {...rest} />
                    : <NoImage size={3}/>
                }
            </Center>
        </div>
    );
};

export default ImagePreview;