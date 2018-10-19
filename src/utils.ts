/**
 * Get length of the longest string in an array.
 */
export function getMaxLength(strings: string[]) {
	return strings.reduce((maxLength, str) => Math.max(maxLength, str.length), 0)
}

/**
 * Convert HTML string to HTML element.
 */
export function makeElementFromString(htmlString: string) {
	const wrapper = document.createElement('div')
	wrapper.insertAdjacentHTML('afterbegin', htmlString)
	return wrapper.firstElementChild!
}
