import type {ReactNode} from "react";
import type {MenuItemProps} from './menu-item'

export type MenuProps = {
    ITEMS: MenuItemProps[],
    target?: ReactNode,
    onItemClick: (item: any) => void,
    size?: number,
    [key: string]: any
}