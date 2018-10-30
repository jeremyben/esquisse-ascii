/**
 * Get length of the longest string in an array.
 */
export function getMaxLength(strings: string[]) {
	return strings.reduce((maxLength, str) => Math.max(maxLength, str.length), 0)
}

/**
 * Round number to at most two decimals places
 */
export function roundTwoDecimals(value: number) {
	// https://stackoverflow.com/a/52975077/4776628
	return Math.round((value + 0.00001) * 100) / 100
}

/**
 * Round number to the closest quarter (0, 0.25, 0.5, 0.75)
 */
export function roundQuarter(value: number) {
	return Math.round(value * 4) / 4
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
	// Constants and calulations to match text whitespaces and browser spacing
	const extraY = 0.75
	const extraX = 0.25

	// From style property to blockdata
	if (typeof source === 'string') {
		const paddingRem = source.split(' ')
		let paddingY = 0
		let paddingX = 0

		// Must have padding for all or shorthand or Y and X only ('1.75rem 2.25rem')
		if (paddingRem.length > 2) throw Error(`Padding source not conform: ${source}`)

		if (paddingRem.length === 1) {
			paddingY = paddingX = Number.parseFloat(paddingRem[0])
		}

		if (paddingRem.length === 2) {
			paddingY = Number.parseFloat(paddingRem[0])
			paddingX = Number.parseFloat(paddingRem[1])
		}

		paddingY = paddingY - extraY
		paddingX = (paddingX - extraX) * 2

		// Switch order for blockdata
		return [paddingX, paddingY]
	}

	// From blockdata to style property
	if (Array.isArray(source)) {
		let [paddingX, paddingY] = source

		paddingX = paddingX / 2 + extraX
		paddingY = paddingY + extraY

		// Switch order for style property
		return `${paddingY}rem ${paddingX}rem`
	}

	throw Error(`Padding source not conform: ${JSON.stringify(source)}`)
}
