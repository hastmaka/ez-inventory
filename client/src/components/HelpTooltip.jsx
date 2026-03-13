import PropTypes from "prop-types";
import {Tooltip} from "@mantine/core";
import {IconHelp} from "@tabler/icons-react";

export default function HelpTooltip ({label, ...rest}) {
	return (
		<Tooltip
			label={label}
			withArrow
			position='top-start'
			events={{ hover: true, focus: true, touch: true }}
			{...rest}
		>
			<IconHelp
				stroke={1.5}
				style={{height: '1.2rem', cursor: 'pointer'}}
			/>
		</Tooltip>
	);
}

HelpTooltip.propTypes = {
	label: PropTypes.string.isRequired,
}