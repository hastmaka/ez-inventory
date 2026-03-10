import PropTypes from "prop-types";
import classes from './BookNowBtn.module.scss';
import {motion} from "framer-motion";
import {Button} from "@mantine/core";
import useLanguage from "../util/hook/useLanguage.jsx";
const MotionButton = motion(Button)

export default function BookNowBtn({variants, big=false, item, text, children,...rest}) {
    const lang = useLanguage()

    return (
        <MotionButton
            variants={variants}
            fw={700}
            className={classes['book-now']}
            {...(big && {
                size: "xl",
                w: 'fit-content',
            })}
            {...rest}
        >{children || lang(text)}</MotionButton>
    )
}

BookNowBtn.propTypes = {
    variants: PropTypes.object,
    big: PropTypes.bool,
    item: PropTypes.object,
    text: PropTypes.string
}
