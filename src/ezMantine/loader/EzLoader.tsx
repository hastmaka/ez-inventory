import {Center, Loader} from "@mantine/core";

export default function EzLoader ({
    h,
    centerProps,
    size,
    ...rest
}: {
    h: string | number,
    centerProps?: object,
    size?: number
    [key: string]: any
}) {
    return (
        <Center h={h} mih={h} flex={1} {...centerProps}>
            <Loader
                size={size}
                {...rest}
            />
        </Center>
    )
}

EzLoader.Alone = function () {
    return (
        <Loader
            size="md"
            pos='fixed'
            style={{
                transform: 'translateX(-50%, -50%)',
                left: '50%',
                top: '50%',
            }}
        />
    )
}