import { useEffect } from 'react';

export function useEnterKeySubmit(
    inputRef: any,
    callBack: (p: { ref: any; e: any }) => void
) {
    useEffect(() => {
        const handleKeyDown = (e: any) => {
            if (e.key === 'Enter' && document.activeElement === inputRef.current) {
                // Trigger click on the submit button only if the input is focused
                callBack({e, ref: inputRef})
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [inputRef]);
}