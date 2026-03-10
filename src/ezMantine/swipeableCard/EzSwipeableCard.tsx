import {type ReactNode, useRef} from "react";
import {ActionIcon, Card, type CardProps} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import {IconChevronLeft, IconPencil, IconTrash} from "@tabler/icons-react";
import {motion, useMotionValue, useTransform, animate} from "framer-motion";
import classes from "./EzSwipeableCard.module.scss";

interface EzSwipeableCardProps extends CardProps {
    onEdit?: () => void;
    onDelete: () => void;
    deleteLoading?: boolean;
    disabled?: boolean;
    children: ReactNode;
}

export default function EzSwipeableCard({
    onEdit,
    onDelete,
    deleteLoading,
    disabled,
    children,
    ...cardProps
}: EzSwipeableCardProps) {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const isOpen = useRef(false);

    const actionWidth = onEdit ? 120 : 60;
    const x = useMotionValue(0);
    const actionOpacity = useTransform(x, [-actionWidth, -actionWidth / 3, 0], [1, 0.3, 0]);

    if (isDesktop || disabled) {
        return <Card {...cardProps}>{children}</Card>;
    }

    const spring = {type: "spring" as const, stiffness: 300, damping: 30};

    function snapOpen() {
        animate(x, -actionWidth, spring);
        isOpen.current = true;
    }

    function snapClosed() {
        animate(x, 0, spring);
        isOpen.current = false;
    }

    function handleDragEnd(_: any, info: {offset: {x: number}; velocity: {x: number}}) {
        if (info.offset.x < -(actionWidth * 2 / 3) || info.velocity.x < -500) {
            snapOpen();
        } else {
            snapClosed();
        }
    }

    function handleTap() {
        if (isOpen.current) {
            snapClosed();
        }
    }

    const background = onEdit
        ? "linear-gradient(to right, var(--mantine-color-blue-6) 50%, var(--mantine-color-red-6) 50%)"
        : "var(--mantine-color-red-6)";

    return (
        <div className={classes.container}>
            <motion.div className={classes.actionLayer} style={{opacity: actionOpacity, width: actionWidth, background}}>
                {onEdit && (
                    <ActionIcon className={classes.actionButton} color="white" size="lg" onClick={onEdit}>
                        <IconPencil size={24}/>
                    </ActionIcon>
                )}
                <ActionIcon className={classes.actionButton} color="white" size="lg" loading={deleteLoading} onClick={onDelete}>
                    <IconTrash size={24}/>
                </ActionIcon>
            </motion.div>

            <motion.div
                style={{x, position: "relative", zIndex: 1}}
                drag="x"
                dragDirectionLock
                dragConstraints={{left: -actionWidth, right: 0}}
                dragElastic={0}
                onDragEnd={handleDragEnd}
                onTap={handleTap}
            >
                <Card {...cardProps}>
                    {children}
                    <div className={classes.swipeHint}>
                        <IconChevronLeft size={14}/>
                        <span>Slide to edit</span>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
