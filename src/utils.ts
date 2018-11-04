/**
 * Get length of the longest string in an array.
 */
export function getMaxLength(strings: string[]) {
	return strings.reduce((maxLength, str) => Math.max(maxLength, str.length), 0)
}

/**
 * Round number to at most two decimals places.
 */
export function roundTwoDecimals(value: number) {
	// https://stackoverflow.com/a/52975077/4776628
	return Math.round((value + 0.00001) * 100) / 100
}

/**
 * Round number to the closest quarter (0, 0.25, 0.5, 0.75).
 */
export function roundQuarter(value: number) {
	return Math.round(value * 4) / 4
}

/**
 * Check shallowly if two arrays are identical.
 */
export function sameArrays<T>(a: T[], b: T[]) {
	for (let i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false
	}
	return true
}

/**
 * Convert HTML string to HTML element.
 */
export function makeElementFromString(htmlString: string) {
	// https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
	const wrapper = document.createElement('template')
	wrapper.innerHTML = htmlString
	return wrapper.content.firstElementChild!
}
