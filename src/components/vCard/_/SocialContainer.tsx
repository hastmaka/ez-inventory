import type {ReactElement} from "react";
import A from "./A.tsx";
import {Group, Stack} from "@mantine/core";
import classes from '../vCard.module.scss'

function SocialContainer({
    social
}: {
    social: {
        icon: () => ReactElement;
        href: string;
    }[]
}) {
    return (
        <Stack className={classes['social-container']}>
            <span>Connect with me</span>
            <Group component="ul" className={classes['social']}>
                {(social).map(({icon, href}, index) => {
                    return (
                        <li key={index}>
                            <A href={href}>{icon()}</A>
                        </li>
                    )
                })}
            </Group>
        </Stack>
    );
}

export default SocialContainer;