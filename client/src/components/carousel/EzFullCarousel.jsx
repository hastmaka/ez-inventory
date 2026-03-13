import PropTypes from "prop-types";
import classes from './EzFullCarousel.module.scss'
import useEmblaCarousel from "embla-carousel-react";
import {useDotButton} from "./useDotButton.jsx";
import {usePrevNextButtons} from "./usePrevNextButtons.js";
import {PrevButton} from "./PrevButton.jsx";
import {NextButton} from "./NextButton.jsx";
import {DotButton} from "./DotButton.jsx";

export default function EzFullCarousel(props) {
    const [emblaRef, emblaApi] = useEmblaCarousel({loop: true})
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <div className={classes.embla} id='main-carousel'>
            <div
                className={classes['embla__viewport']}
                ref={node => {
                    emblaRef(node);
                    props.forwardedRef.current = node;
                }}
            >
                <ul className={classes['embla__container']}>
                    {props.children}
                </ul>

                <div className={classes['embla__dots']}>
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            {...(index === selectedIndex && {
                                ['data-selected']: true
                            })}
                        />
                    ))}
                </div>

            </div>

            <div className={classes['embla__controls']}>
                <div className={classes['embla__buttons']}>
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>
        </div>
    )
}

EzFullCarousel.propTypes = {
    forwardedRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any })
    ]),
    children: PropTypes.node.isRequired
}
