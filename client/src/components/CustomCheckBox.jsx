import {Checkbox} from "@mantine/core";

export default function CustomCheckBox (props) {
	return (
		<Checkbox
			variant="outline"
			styles={{
				body: {flexDirection: 'row-reverse', gap: '4px'},
				icon: {color: '#000000', display: 'none'},
				inner: {
					outline: '1px solid #000000',
					outlineOffset: '-1px',
				},
				input: {
					appearance: 'auto',
					accentColor: 'white',
					borderRadius: 0
				}
			}}
			{...props}
		/>
	);
}