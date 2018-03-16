
export default function price(value, digit) {
	
	value = value || 0;
	digit = digit || 2;
	
	let num = parseInt(value)
	num = pad(num, digit + 1);	
	num = num.splice(num.length - digit, 0, '.' )
	return num;
}
function pad(num, width, paddingChar) {
	paddingChar = paddingChar || '0'
	num = num + '';
	return num.length >= width ? num :  new Array(width - num.length + 1).join(paddingChar) + num;
}
if (!String.prototype.splice) {
    /**
     * {JSDoc}
     *
     * The splice() method changes the content of a string by removing a range of
     * characters and/or adding new characters.
     *
     * @this {String}
     * @param {number} start Index at which to start changing the string.
     * @param {number} delCount An integer indicating the number of old chars to remove.
     * @param {string} newSubStr The String that is spliced in.
     * @return {string} A new string with the spliced substring.
     */
	String.prototype.splice = function (start, delCount, newSubStr) {
		return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
	};
}
