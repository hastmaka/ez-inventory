import { AppShell } from "@mantine/core";
import {IconLogin} from "@tabler/icons-react";
import {LOGOUT_USER} from "@/api/action/ACTIONS.ts";
import UnStyledButton from "@/ezMantine/sideNavItem/UnstyledButton.tsx";

export default function MobileNavbar() {
    return (
        <>
            <AppShell.Section p="md">Navbar header</AppShell.Section>
            <AppShell.Section grow p="md">Navbar header</AppShell.Section>
            <AppShell.Section p="md">
                <UnStyledButton icon={IconLogin} label="Logout" onClick={LOGOUT_USER}/>
            </AppShell.Section>
        </>
    );
}