import PropTypes from "prop-types";
import {Checkbox, Text, UnstyledButton} from "@mantine/core";
import classes from "./ButtonCheckBox.module.scss";

export default function ButtonCheckBox({checked, setChecked, description, index}) {
	return (
		<div className={classes.root}>
			<Checkbox
				classNames={{ root: classes.checkboxWrapper, input: classes.checkbox }}
				checked={checked}
				onChange={(event) => setChecked(event.currentTarget.checked)}
				tabIndex={-1}
				size="xs"
				aria-label="Button Checkbox"
			/>
			
			<UnstyledButton
				className={classes.control}
				data-checked={checked || undefined}
				onClick={() => setChecked(index)}
			>
				{typeof description === 'string'
					? <Text className={classes.label}>{description}</Text>
					: description.map((item, index) =>
						<Text key={index} className={classes.label}>{item.icon ? item.icon : item}</Text>
					)
				}
				
			</UnstyledButton>
		</div>
	);
}

ButtonCheckBox.propTypes = {
	checked: PropTypes.bool.isRequired,
	setChecked: PropTypes.func.isRequired,
	description: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.array
	]).isRequired,
	index: PropTypes.number
}