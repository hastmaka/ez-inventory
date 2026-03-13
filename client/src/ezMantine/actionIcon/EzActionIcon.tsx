import React, { forwardRef, type ReactNode } from "react";
import { IconMenu } from "@tabler/icons-react";
import { ActionIcon, Tooltip, type TooltipProps, type ActionIconProps } from "@mantine/core";

interface EzActionIconComponent
    extends React.ForwardRefExoticComponent<
        ActionIconProps & { children?: ReactNode } & React.RefAttributes<HTMLButtonElement>
    > {
    Tooltip: React.ForwardRefExoticComponent<
        TooltipProps & React.RefAttributes<HTMLButtonElement>
    >;
}

// --- Main component ---
const EzActionIcon = forwardRef<HTMLButtonElement, ActionIconProps & { children?: ReactNode }>(
    ({ children, ...rest }, ref) => (
        <ActionIcon ref={ref} variant="subtle" {...rest}>
            {children || <IconMenu />}
        </ActionIcon>
    )
) as EzActionIconComponent;

EzActionIcon.displayName = "EzActionIcon";

// --- Tooltip subcomponent ---
EzActionIcon.Tooltip = forwardRef<HTMLButtonElement, TooltipProps>(
    (props, ref) => (
        <Tooltip {...props}>
            <EzActionIcon ref={ref}>
                {props.children}
            </EzActionIcon>
        </Tooltip>
    )
);

EzActionIcon.Tooltip.displayName = "EzActionIcon.Tooltip";

export default EzActionIcon;