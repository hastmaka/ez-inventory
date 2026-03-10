import PropTypes from "prop-types";
import SContainer from "./SContainer.jsx";
import {Flex, Stack, Text} from "@mantine/core";
import useLanguage from "../util/hook/useLanguage.jsx";
import classes from './Quote.module.scss';

export default function Quote({textPath, quote=true, bg = '#f9f9f9'}) {
    const lang = useLanguage()
    return (
        <SContainer className={classes.quote}>
            <Flex justify='center' flex={1}>
                <Stack py='4rem' w='fit-content'>
                    <Text size='clamp(1rem, 2vw + 1px, 1.2rem)' fw={800}>
                        {lang(textPath)}
                    </Text>
                    {quote && <Text ta='right' size='clamp(.8rem, 1vw + 1px, 1rem)'>Robert Kiyosaki</Text>}
                </Stack>
            </Flex>
        </SContainer>
    )
}

Quote.propTypes = {
    textPath: PropTypes.string.isRequired,
    bg: PropTypes.string,
    quote: PropTypes.bool
}

