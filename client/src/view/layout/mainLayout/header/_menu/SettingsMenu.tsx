import withAccess from "@/access/Access.tsx";
import EzMenu from "@/ezMantine/menu/EzMenu.tsx";
import type {MenuProps} from "@/types";

function SettingsMenu({target, ITEMS, ...rest}: MenuProps) {
    return (
        <EzMenu
            position="bottom-end"
            ITEMS={ITEMS}
            target={target}
            {...rest}
        />
    );
}

SettingsMenu.displayName = 'SettingsMenu';

const SettingsMenuWithAccess = withAccess(SettingsMenu);

export {SettingsMenu};
export default SettingsMenuWithAccess;