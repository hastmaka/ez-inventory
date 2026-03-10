import PropTypes from "prop-types";
import {Flex} from "@mantine/core";
import classes from './CustomHeaderWrapper.module.scss'

export default function CustomHeaderWrapper({children, rest}) {
    return (
        <Flex
            justify='space-between'
            align='center'
            className={classes['custom-header-wrapper']}
            {...rest}
        >
            {children}
        </Flex>
    )
}

CustomHeaderWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    rest: PropTypes.object
}