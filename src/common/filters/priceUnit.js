
export default function priceUnit(value = 0, digit) {
	let num = Number(value) / 100;
	if (isNaN(num)) {
		throw new Error('invalid price');
	}
	if (digit && typeof digit === 'number') {
		return num.toFixed(digit);
	} else {
		return num;
	}
}
