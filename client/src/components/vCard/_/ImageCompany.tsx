import {Center} from "@mantine/core";
import NoImage from "@/components/NoImage.tsx";

function ImageCompany({
    imgPath,
    className
}: {
    imgPath?: string,
    className: string
}) {
    return (
        <div className={className}>
            <Center>
                {imgPath
                    ? <img src={imgPath} alt="Company Logo"/>
                    : <NoImage/>
                }
            </Center>
        </div>
    );
}

export default ImageCompany;