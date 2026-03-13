import { MantineProvider } from "@mantine/core";
import {ThemeController} from "./ThemeController.ts";
import {Notifications} from "@mantine/notifications";
import ModalManager from "../ezMantine/modalManager/ModalManager.tsx";
import type {ReactNode} from "react";
import {themeConfig} from "@/theme/themeConfig.ts";

export default function Theme ({
	children
}: {
	children: ReactNode;
}) {
	const {primaryColor} = ThemeController;

	return (
		<MantineProvider
			theme={{primaryColor, ...themeConfig}}
			forceColorScheme={ThemeController.theme}
		>
			<ModalManager/>
			<Notifications position='bottom-right'/>
			{children}
		</MantineProvider>
	);
}