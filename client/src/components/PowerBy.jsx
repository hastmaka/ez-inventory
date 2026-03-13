import {Anchor, Flex, Text} from "@mantine/core";

export default function PowerBy () {
	return (
		<Flex direction='row' gap={4} c='white'>
			<Text size='sm'>
				Power by:
			</Text>
			<Anchor href='https://www.ryl.vegas' target="_blank" rel="noopener noreferrer" size='sm'>
				RY&L
			</Anchor>
		</Flex>
	);
}

PowerBy.propTypes = {}