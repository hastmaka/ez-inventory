import {Container, Overlay, Text} from "@mantine/core";
import {motion} from "framer-motion";
import classes from './Slides.module.scss'
import emblaClasses from './EzFullCarousel.module.scss'
import {generalSignal} from "@/signal/generalSignal.js";
import useLanguage from "@/util/hook/useLanguage.jsx";
import BookNowBtn from "../BookNowBtn.jsx";
import SeoImage from "@/component/SeoImage/SeoImage.jsx";

const container = {
    hidden: {opacity: 0},
    show: {
        opacity: 1,
        transition: {
            staggerChildren: .5,
            staggerDirection: 1
        }
    }
}

const item = {
    hidden: {opacity: 0, x: -100},
    show: {opacity: 1, x: 0}
}

const classMap = {
    0: classes.title,
    1: classes.title1,
    2: classes.header
}

export default function Slides({data, onClick, btnText}) {
    const {language} = generalSignal
    const lang = useLanguage()

    return data.map(({id, imgProps, text, special}) =>
        <li
            key={id}
            className={emblaClasses['embla__slide']}
            style={{listStyle: 'none', position: 'relative'}}
        >
            <SeoImage {...imgProps}/>
            <Overlay
                gradient="linear-gradient(90deg, rgba(0,0,0,1) 40%, rgba(0,0,0,0.2) 100%)"
                opacity={.85}
            />
            <Container className={classes['hero-text-container']}>
                <motion.div
                    variants={container}
                    initial="hidden"
                    viewport={{once: true}}
                    whileInView='show'
                    style={{
                        display: "flex",
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 0
                    }}
                >
                    {text.map(({el, t}, index) => {
                        const DynamicTag = motion[el]
                        return <DynamicTag
                            key={index}
                            variants={item}
                            className={classMap[index]}
                        >
                            {lang(t)}
                            {index === 1 && <span>{lang(special)}</span>}
                        </DynamicTag>
                    })}

                    <BookNowBtn
                        mt='1rem'
                        variants={item}
                        big
                        text={btnText}
                        onClick={onClick}
                    />
                </motion.div>
            </Container>

            <Text component='span' className={classes['fancy-1']}>@ {new Date().getFullYear()} RY&L</Text>
            <Text component='span' className={classes['fancy-2']}>
                {language === 'en'
                    ? '#marketing / #development / #design'
                    : '#mercadotecnica / #desarrollo / #diseño'}
            </Text>
        </li>
    );
}

Slides.propTypes = {}
