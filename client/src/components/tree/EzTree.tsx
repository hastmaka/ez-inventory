import classes from "./EzTree.module.scss";
import {Group, Tree, type TreeNodeData, type RenderTreeNodePayload} from "@mantine/core";
import { IconFolder, IconFolderOpen, IconPaperclip} from "@tabler/icons-react";

type EzTreeProps = {
    data: TreeNodeData[],
    onItemClick: (node: Record<string, any>) => void,
    [key: string]: any;
}

interface FileIconProps {
    isFolder: boolean;
    expanded: boolean;
    level: number;
}

function FileIcon({ isFolder, expanded }: FileIconProps) {
    return isFolder ? expanded? (
        <IconFolderOpen
            color="var(--mantine-primary-color-9)"
            size={24}
            stroke={1.5}
        />
    ) : (
        <IconFolder
            color="var(--mantine-primary-color-9)"
            size={24}
            stroke={1.5}
        />
    ): (
        <IconPaperclip
            color="var(--mantine-primary-color-9)"
            size={24}
            stroke={1.5}
        />
    )
}

function Leaf({
    node,
    expanded,
    hasChildren,
    elementProps,
    level,
    onClick
}: RenderTreeNodePayload & {
    onClick: () => void,
}) {

    return (
        <Group
            gap={5}
            {...elementProps}
            onClick={onClick}
            pl={level === 1 ? level * 8 : level * 16}
        >
            <FileIcon isFolder={hasChildren} expanded={expanded} level={level}/>
            <span>{node.label}</span>
        </Group>
    );
}

export default function EzTree({
    data,
    onItemClick,
    ...rest
}: EzTreeProps) {
    return (
        <Tree
            data={data}
            levelOffset={16}
            classNames={classes}
            selectOnClick
            clearSelectionOnOutsideClick
            renderNode={(payload) =>
                <Leaf onClick={() => onItemClick(payload.node)} {...payload} />
        }
            {...rest}
        />
    );
}