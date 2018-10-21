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
	// https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
	const wrapper = document.createElement('template')
	wrapper.innerHTML = htmlString
	return wrapper.content.firstElementChild!
}

export function convertPadding(source: BlockData['padding']): string
export function convertPadding(source: string): BlockData['padding']
export function convertPadding(source: string | BlockData['padding']): string | BlockData['padding'] {
	// calulations to match text whitespaces and browser spacing
	const extraY = 0.75
	const extraX = 0.25

	// From style attribute to blockdata
	if (typeof source === 'string') {
		const paddingRem = source.split(' ')
		// Must have padding shorthand for Y and X only ('1.75rem 2.25rem')
		if (paddingRem.length > 2) throw Error('Padding source not conform: ' + source)

		let paddingY = paddingRem[0] ? Number.parseFloat(paddingRem[0]) : 0
		let paddingX = paddingRem[1] ? Number.parseFloat(paddingRem[1]) : 0

		paddingY = paddingY - extraY
		paddingX = (paddingX - extraX) * 2

		// don't forget to reverse Y and X for blockdata
		return [paddingX, paddingY]
	}

	// From blockdata to style attribute
	if (Array.isArray(source)) {
		let [paddingX, paddingY] = source

		paddingX = paddingX / 2 + extraX
		paddingY = paddingY + extraY

		return `${paddingY}rem ${paddingX}rem`
	}

	throw Error(`Padding source not conform: ${JSON.stringify(source)}`)
}
