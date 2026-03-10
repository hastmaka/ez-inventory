import { useState } from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {Image} from "@mantine/core";

type AsyncImageProps = {
    url: string;
    altImg: string;
    [key: string]: any;
}

export default function AsyncImage({
   url,
   altImg,
   ...rest
}: AsyncImageProps) {
    const [imgLoading, setImgLoading] = useState(true);
    const [imgError, setImgError] = useState(false);

    if (imgLoading) return <EzLoader.Alone/>

    return (
        <Image
            src={imgError ? altImg : url}
            decoding="async"
            onLoad={() => setImgLoading(false)}
            onError={() => setImgError(true)}
            style={{
                display: imgLoading ? "none" : "block",
            }}
            {...rest}
        />
    );
}