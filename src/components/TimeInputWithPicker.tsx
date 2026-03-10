import React, {useRef} from "react";
import {TimeInput} from "@mantine/dates";
import {ActionIcon} from "@mantine/core";
import {IconClock} from "@tabler/icons-react";

export default function TimeInputWithPicker({
    label, value, onChange, style, ...rest
}: {
    label?: string,
    value: string,
    onChange: (e: any) => void,
    style?: React.CSSProperties,
    [key: string]: any
}) {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <TimeInput
            label={label}
            value={value}
            onChange={onChange}
            style={style}
            ref={ref}
            rightSection={
                <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
                    <IconClock size={16} stroke={1.5}/>
                </ActionIcon>
            }
            {...rest}
        />
    );
}