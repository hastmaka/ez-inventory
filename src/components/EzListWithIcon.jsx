import PropTypes from "prop-types";
import {Group, Stack, Text} from "@mantine/core";

/**
 * EzListWithIcon is a React component that renders a list of items with icons.
 *
 * @param {Object} props - The props object containing the data array.
 * @param {Array} props.data - An array of objects, each containing an `icon` and `text` property.
 * @returns {JSX.Element} - The rendered list of items with icons.
 */
export default function EzListWithIcon({data}) {
    return (
        <Stack flex='1' gap='0.5rem'>
            {data.map(({icon, text}, index) =>
                <Group key={index}>
                    {icon && icon}
                    <Text>{text}</Text>
                </Group>
            )}
        </Stack>
    )
}

EzListWithIcon.propTypes = {
    data: PropTypes.array.isRequired
}
