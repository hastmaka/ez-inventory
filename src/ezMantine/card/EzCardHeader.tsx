import classes from './EzCard.module.scss'
import {Flex} from "@mantine/core";
import {IconCirclePlus} from "@tabler/icons-react";
import EzText from "@/ezMantine/text/EzText.jsx";
import EzButton from "@/ezMantine/button/EzButton.tsx";
import type {ReactNode} from "react";
import type {BtnProps} from "@/ezMantine/card/EzCard.tsx";

interface EzCardHeaderProps extends BtnProps {
    children?: ReactNode;
}

export default function EzCardHeader({ children, title, handleAdd, label, tooltip }: EzCardHeaderProps) {
    return (
        <Flex justify='space-between' align='center' className={classes['card-header']}>
            {children ? children : (
                <>
                    <EzText>{title}</EzText>
                    {handleAdd &&
                        <EzButton
                            px='.5rem'
                            onClick={handleAdd}
                            tooltip={tooltip}
                            filled
                        >
                            <IconCirclePlus/>
                            {label}
                        </EzButton>
                    }
                </>
            )}
        </Flex>
    )
}

