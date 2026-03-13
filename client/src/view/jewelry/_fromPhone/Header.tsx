import {Group, Image, Burger} from "@mantine/core";
import ThemeButton from "@/theme/ThemeButton.tsx";
import {LoginController} from "@/view/login/LoginController.ts";

export default function Header({
    toggle,
    opened
}: {
    toggle: () => void;
    opened: boolean;
}) {
    return (
        <Group
            flex={1}
            mih={60}
            justify='space-between'
            px={8}
            style={{
                borderBottom: '0.0650rem solid light-dark(var(--mantine-color-gray-1),var(--mantine-color-gray-8))',
            }}
        >
            {LoginController.isMobile && <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>}
            <Image src='/ez-in.svg' h={40} w='auto'/>
            <ThemeButton isLocal/>
        </Group>
    );
}