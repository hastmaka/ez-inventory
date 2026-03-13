import {type ComponentType, type ReactElement} from 'react';
import {ActionIcon, Card, Flex} from "@mantine/core";

function Toolbar({
    text,
    icon: Icon,
    customElement
}: {
    text: string;
    icon?: ComponentType;
    customElement?: () => ReactElement;
}) {
    return (
        <Card p={8}>
            <Flex justify="space-between" align="center">
                <span>{text}</span>
                {customElement
                    ? customElement()
                    : (
                        <ActionIcon size="sm" variant="white">
                            {Icon && <Icon/>}
                        </ActionIcon>
                    )
                }
            </Flex>
        </Card>

    );
}

export default Toolbar;