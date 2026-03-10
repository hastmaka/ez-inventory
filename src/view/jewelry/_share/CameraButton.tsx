import {Button} from "@mantine/core";
import {type ChangeEvent, useRef} from "react";
import {IconCamera} from "@tabler/icons-react";

export default function CameraButton({
    onCapture,
    text,
    ...rest
}: {
    onCapture: (file: File) => void,
    text: string,
    [key: string]: any
}) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const handleButtonClick = () => {
        // Opens camera / file picker on mobile
        inputRef.current?.click();
    };

    const handleFileChange =
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) onCapture(file);
            // reset file input after capture
            if (inputRef.current) inputRef.current.value = "";
        };

    return (
        <>
            <Button
                size='md'
                onClick={handleButtonClick}
                leftSection={<IconCamera/>}
                {...rest}
            >{text}</Button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment" // opens rear camera by default
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </>
    );
}