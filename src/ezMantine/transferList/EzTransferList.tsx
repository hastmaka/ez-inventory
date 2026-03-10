import RenderList from "./RenderList.tsx";
import {Flex} from "@mantine/core";
import type {RenderListOptionProps, RenderListProps} from "@/types";
import {useRef} from "react";
import {deepSignal} from "deepsignal/react";

type EzTransferListProps = {
    onTransfer: (data: any) => void;
    renderListProps: RenderListProps[],
    [key: string]: any;
}

export function EzTransferList({
    onTransfer,
    renderListProps,
    singleSelect,
    ...rest
}: EzTransferListProps) {
    const signal = useRef(deepSignal({
        data: [
            renderListProps[0].options.map((o) =>
                typeof o === 'string' ? o : o.value),
            renderListProps[1].options.map((o) =>
                typeof o === 'string' ? o : o.value),
        ] as string[][]
    })).current;

    const handleTransfer = (
        transferFrom: number,
        options: string[]
    ) => {
        const transferTo = transferFrom === 0 ? 1 : 0;

        const fromData = signal.data[transferFrom]
            .filter((item: RenderListOptionProps | string) => !options.includes(item as any));
        const toData = [...signal.data[transferTo], ...options];
        debugger
        signal.data = transferFrom === 0
            ? [fromData, toData]
            : [toData, fromData];

        // send the updated data out to the controller
        onTransfer(signal.data);
    };

    return (
        <Flex gap={8} flex={1} {...rest}>
            <RenderList
                flex={1}
                {...renderListProps[0]}
                onTransfer={(options) =>
                    handleTransfer(0, options as any)}
            />
            <RenderList
                flex={1}
                {...renderListProps[1]}
                onTransfer={(options) =>
                    handleTransfer(1, options as any)}
            />
        </Flex>
    );
}