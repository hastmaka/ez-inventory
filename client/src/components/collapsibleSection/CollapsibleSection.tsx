import {ActionIcon, Collapse, Divider, Group, Paper, Text, ThemeIcon} from "@mantine/core";
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react";
import type {ReactNode} from "react";

interface CollapsibleSectionProps {
    title: string;
    icon: React.ComponentType<any>;
    isOpen: boolean;
    onToggle: () => void;
    children: ReactNode;
    color?: string;
}

export default function CollapsibleSection({
    title,
    icon: Icon,
    isOpen,
    onToggle,
    children,
    color = "blue"
}: CollapsibleSectionProps) {
    return (
        <Paper p="md" radius="md" withBorder>
            <Group
                justify="space-between"
                onClick={onToggle}
                style={{cursor: 'pointer'}}
            >
                <Group gap="sm">
                    <ThemeIcon  color={color} size="md">
                        <Icon size={18}/>
                    </ThemeIcon>
                    <Text fw={600}>{title}</Text>
                </Group>
                <ActionIcon variant="subtle" color="gray">
                    {isOpen ? <IconChevronUp size={18}/> : <IconChevronDown size={18}/>}
                </ActionIcon>
            </Group>
            <Collapse in={isOpen}>
                <Divider my="sm"/>
                {children}
            </Collapse>
        </Paper>
    );
}
