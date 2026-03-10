import PropTypes from "prop-types";
import classes from './EzFullCarousel.module.scss'
import {Carousel} from "@mantine/carousel";

export default function EzFullCarousel(props) {
    return (
        <Carousel
            id='main-carousel'
            ref={props.forwardedRef}
            slideSize="100%"
            height='100vh'
            loop
            bg="#000000"
            // slideGap="xs"
            // controlsOffset="xs"
            // controlSize={14}
            // withControls={false}
            previousControlProps={{
                "aria-label": "previous",
            }}
            nextControlProps={{
                "aria-label": "next",
            }}
            withIndicators
            classNames={{
                indicators: classes.indicators,
                control: classes.control
            }}
        >
            {props.children}
        </Carousel>
    )
}

EzFullCarousel.propTypes = {
    forwardedRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any })
    ]),
    children: PropTypes.node.isRequired
}
