import PropTypes from "prop-types";
import {List, Stack, Text} from "@mantine/core";

export default function GenerateContent({data}) {
	return data.map(({head, ex}, index) => {
		return (
			<Stack key={index} gap={8}>
				<Text fw={700}>{head}</Text>
				{ex && ex.length ? <List spacing={16}>
					{ex.map((item, index) =>
						<List.Item key={index} ta='justify' lh='xs'>{item}</List.Item>
					)}
				</List> : null}
			</Stack>
		)
	})
}

GenerateContent.propTypes = {
	data: PropTypes.array
}