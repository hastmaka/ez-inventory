import React from "react";
import {ActionIcon, Group, Indicator, Tooltip} from "@mantine/core";
import withAccess from "@/access/Access.tsx";

const A = ({
	icon,
	aria,
	size,
	variant,
	...rest
}: {
	icon: React.ReactNode,
	aria?: string,
	size?: number,
	variant?: string,
} & React.ComponentPropsWithoutRef<typeof ActionIcon>) => {
	return (
		<ActionIcon
			size={size || 26}
			variant={variant || 'subtle'}
			aria-label={aria || ''}
			// component='a'
			{...rest}
		>
			{icon}
		</ActionIcon>
	)
}

const T = ({
	children,
	...rest
}: {
	children: React.ReactNode,
	label: string
}& React.ComponentPropsWithoutRef<typeof Tooltip>) => {
	return (
		<Tooltip {...rest}>
			{children}
		</Tooltip>
	)
}

export interface ActionIconItem {
	icon: React.ReactNode | (() => React.ReactNode);
	permission?: string;
	tooltip?: string;
	aria?: string;
	indicator?: React.ComponentProps<typeof Indicator>;
	onClick?: (...args: any[]) => void | Promise<void>;
	withMenu?: boolean;
	[key: string]: any;
}

function ActionIconsToolTip({
	ITEMS,
	size,
	variant,
	...rest
}: {
	size?: number;
	ITEMS: ActionIconItem[];
	variant?: string;
} & React.ComponentPropsWithoutRef<typeof Group>) {
	return (
		<Group gap={4} wrap='nowrap' {...rest}>
			{ITEMS.map(({tooltip, icon, aria, indicator, withMenu, ...rest}, index) => {
				const renderedIcon = typeof icon === 'function'
					? icon()
					: React.isValidElement(icon)
						? React.cloneElement(icon as React.ReactElement, {
							...(size ? { style: { width: size, height: size } } : {})
						})
						: null;

				if (withMenu) {
					return (
						<React.Fragment key={index}>
							{typeof icon === 'function' ? icon() : icon}
						</React.Fragment>
					)
				}

				if (tooltip) {
					return (
						<T
							key={index}
							{...(typeof tooltip === "object"
								? (
									tooltip
								) : (
									{label: tooltip}
								))
							}
						>
							{indicator
								? (
									<Indicator size={16}{...indicator} styles={{root: {marginTop: '6px'}}}>
										{A({ icon: typeof icon === 'function' ? icon() : renderedIcon, aria, size, variant, ...rest })}
									</Indicator>
								) : (
									A({ icon: typeof icon === 'function' ? icon() : renderedIcon, aria, size, variant, ...rest })
								)
							}
						</T>
					)
				} else {
					return indicator
						? (
							<Indicator size={16} {...indicator} key={index} styles={{root: {marginTop: '6px'}}}>
								{A({ icon: typeof icon === 'function' ? icon() : renderedIcon, aria, size, variant, ...rest })}
							</Indicator>
						) : (
							<React.Fragment key={index}>
								{A({ icon: typeof icon === 'function' ? icon() : renderedIcon, aria, size, variant, ...rest })}
							</React.Fragment>
						)
				}
			})}
		</Group>
	)
}
ActionIconsToolTip.displayName = 'ActionIconsToolTip';

const ActionIconsToolTipWithAccess = withAccess(ActionIconsToolTip)

export {ActionIconsToolTip}
export default ActionIconsToolTipWithAccess;

/**
 * ActionIconsToolTip
 * const items = [{
 *    tooltip: 'Close',
 *    icon: <IconX/>,
 *    aria: 'aria-description',
 *    onClick: () => state.closeModal()
 * }, {
 *    icon: () => {},
 *    withMenu: true
 * }];
 */

/**
 * ActionIconsToolTipWithAccess
 * const ITEMS = useMemo(() => [{
 *    icon: <IconCirclePlus/>,
 * }, {
 *    icon: <IconHelp/>,
 * }, {
 *    icon: <IconMessages/>,
 *    tooltip: 'Messages',
 *    indicator: {
 *        label: '2'
 *    }
 * }, {
 *    permission_name: 'menu_notification',
 *    icon: <IconBell/>,
 *    indicator: {
 *        label: '10'
 *    }
 * }, {
 *    permission_name: 'menu_company',
 *    icon: <SettingsMenuWithAccess
 *        target={<IconSettings/>}
 *        ITEMS={companySettings}
 *        onItemClick={(item: any) => {
 *            window.navigate(`app/${item.path}`)
 *        }}
 *    />,
 *    withMenu: true,
 * }, {
 *    permission_name: 'menu_theme',
 *    icon: <ThemeButton withActionIcon={false}/>,
 *    onClick: ThemeController.toggleTheme,
 * }], [])
 */