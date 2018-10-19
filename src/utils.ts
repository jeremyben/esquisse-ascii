/**
 * Get length of the longest string in an array.
 */
export function getMaxLength(strings: string[]) {
	return strings.reduce((maxLength, str) => Math.max(maxLength, str.length), 0)
}

