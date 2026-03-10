import {AppShell, ScrollArea} from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import {Outlet} from "react-router-dom";
import {Navbar} from "@/view/layout/mainLayout/navbar/Navbar.tsx";
import {AppController} from "@/AppController.ts";
import Header from './header/Header.tsx'

function Layout() {
    const matches = useMediaQuery('(min-width: 768px)');
    const { burger} = AppController

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md"
            {...(matches && {
                layout: "alt"
            })}
            flex={1}
        >
            <AppShell.Header>
                <Header/>
            </AppShell.Header>
            <AppShell.Navbar w={burger.opened ? 80 : 220}>
                <Navbar/>
            </AppShell.Navbar>
            <AppShell.Main
                bg='var(--mantine-color-body)'
                pr={2}
                pl={burger.opened ? 96 : 236}
            >
                <ScrollArea.Autosize
                    h='calc(100vh - 90px)'
                    type='always'
                    scrollbars='y'
                    offsetScrollbars p='0 4px 0 0'
                    // style={{ border: '1px solid #000' }}
                >
                    <Outlet/>
                </ScrollArea.Autosize>
            </AppShell.Main>
        </AppShell>
    )
}

export default Layout;

