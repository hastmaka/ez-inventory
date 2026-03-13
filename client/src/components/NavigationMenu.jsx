import PropTypes from 'prop-types'
import {NavLink} from '@mantine/core'
import {mainController} from "@/view/main/MainController.js";
import {NavLink as RouterNavLink, useLocation} from "react-router-dom";
import classes from './NavigationMenu.module.scss';
import {useEffect, useState} from "react";

export default function NavigationMenu({toggle, data}) {
    const {screen} = mainController
    const [active, setActive] = useState(0);
    const {pathname} = useLocation()

    useEffect(() => {
        const activeIndex = data.findIndex(({to}) => pathname.includes(to))
        if (activeIndex !== -1) setActive(activeIndex)
    }, [pathname]);

    return data.map(({icon, label, to}, index) => {
        const Icon = icon
        return (
            <NavLink
                component={RouterNavLink}
                active={pathname.includes(to) || index === active}
                key={index}
                to={`/app/${to}`}
                onClick={() => {
                    setActive(index)
                    if (screen < 600) toggle()
                }}
                label={label}
                leftSection={<Icon style={{ width: '1rem', height: '1rem' }}/>}
                classNames={{
                    root: classes.link
                }}
            />
        )
    })
}

NavigationMenu.propTypes = {
    toggle: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired
}