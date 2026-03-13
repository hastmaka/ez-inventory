import {Stack, Text} from "@mantine/core";
import SaveCancelBtns from "@/component/SaveCanceBtns.jsx";
import PropTypes from "prop-types";
import EzText from "@/ezMantine/text/EzText.jsx";

export const SaveChangeModal = ({handleSave, handleCancel, message}) => {
	return (
		<Stack>
			{message
				? <EzText>{message}</EzText>
				: <Text>Please, <Text component='span' c='teal.8'>Save</Text> or <Text component='span' c='red.8'>Cancel</Text> any change
				before continue!</Text>
			}
			<SaveCancelBtns
				accept={handleSave}
				cancel={handleCancel}
			/>
		</Stack>
	)
}

SaveChangeModal.propTypes = {
	handleSave: PropTypes.func.isRequired,
	handleCancel: PropTypes.func.isRequired,
	message: PropTypes.string,
}