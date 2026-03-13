import {IconPhoto} from "@tabler/icons-react";
import {Card, Center} from "@mantine/core";

function NoImage({size, ...rest}: {size?: number, [key: string]: any}) {
    return (
        <Card p={0} {...rest} shadow='none' h='100%'>
            <Center h='100%'>
                <IconPhoto
                    color='#00000060'
                    style={{
                        width: `${size}rem`,
                        height: 'auto',
                    }}
                />
            </Center>
        </Card>
    );
}

export default NoImage;