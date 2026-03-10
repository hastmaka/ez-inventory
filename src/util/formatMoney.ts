export const formatMoney = (value: number): string | null => {
	// Convert cents to dollars
	// const dollars = value / 100;
	const num = Number(value);
	if (isNaN(num)) return null;

	// Format with two decimal places
	let formattedMoney = num.toFixed(2);

	// Format the integer part with commas for a thousand separators
	formattedMoney = formattedMoney.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	// Prepend a dollar sign
	formattedMoney = '$' + formattedMoney;

	return formattedMoney;
};