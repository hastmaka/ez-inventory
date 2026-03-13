import {createTheme, Modal, Paper, Tooltip} from "@mantine/core";

export const themeConfig = createTheme({
	fontFamily: 'Open Sans, sans-serif',

	components: {
		Paper: Paper.extend({
			defaultProps: {
				shadow: 'xs',
				radius: 'sm',
				withBorder: true,
			}
		}),
		Modal: Modal.extend({
			styles: () => ({
				header: {
					borderBottom: '0.0625rem solid var(--mantine-color-gray-2)'
				},
				body: {
					// padding: '1rem .5rem 1rem 1rem'
					padding: '0'
				}
			})
		}),
		Tooltip: Tooltip.extend({
			defaultProps: {
				bg: 'var(--mantine-color-blue-5)',
				zIndex: 230
			}
		})
	},

	colors: {
		aba: [
			"#1abc9c",  // teal
			"#3498db",  // blue
			"#9b59b6",  // purple
			"#e67e22",  // orange
			"#e74c3c",  // red
			"#2ecc71",  // green
			"#f1c40f",  // yellow
			"#34495e",  // dark gray-blue
			"#ff6b81",  // pink
			"#16a085"   // dark teal
		]
	}
});

/**
 * background-color: light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))
 * color: light-dark(var(--mantine-color-black), var(--mantine-color-white));
 * border-bottom: 0.0625rem solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4));
 *
 *
 */