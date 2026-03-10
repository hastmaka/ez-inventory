import {Burger, Group} from "@mantine/core";
import HeaderMenu from './HeaderMenu.tsx';
import {AppController} from "@/AppController.ts";

function Header() {
    const {burger, toggleNav} = AppController

    return (
        <Group h="100%" px="md" pl={burger.opened ? 96 : 236} justify="space-between">
            <Burger onClick={toggleNav} aria-label="Toggle navigation" />
            <HeaderMenu/>
        </Group>
    );
}

export default Header;