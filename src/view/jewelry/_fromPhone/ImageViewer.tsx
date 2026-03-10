import NoImage from "@/components/NoImage.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {Image} from "@mantine/core";
import {useState} from "react";

export default function ImageViewer({file}: {file: File | string | null}) {
    const [isLoading, setIsLoading] = useState(!!file);

    if (!file) {
        return <NoImage h='100%'/>
    }

    return (
        <>
            {isLoading && <EzLoader h='440'/>}
            <Image
                src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                w='100%'
                h='100%'
                radius='md'
                display={isLoading ? 'none' : undefined}
                onLoad={() => setIsLoading(false)}
            />
        </>
    );
}