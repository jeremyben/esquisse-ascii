// Constants for calculations to match text whitespaces and browser spacing
export const ratioX = 9
export const ratioY = 24

export function convertPadding(source: BlockData['padding']): string
export function convertPadding(source: string): BlockData['padding']
export function convertPadding(source: string | BlockData['padding']): string | BlockData['padding'] {
	// From style property to blockdata
	if (typeof source === 'string') {
		const paddingPixel = source.split(' ')
		let paddingPixelY = 0
		let paddingPixelX = 0

		// Must have padding for all or shorthand or Y and X only
		if (paddingPixel.length > 2) throw Error(`Padding source not conform: ${source}`)

		if (paddingPixel.length === 1) {
			paddingPixelY = paddingPixelX = Number.parseFloat(paddingPixel[0])
		}

		if (paddingPixel.length === 2) {
			paddingPixelY = Number.parseFloat(paddingPixel[0])
			paddingPixelX = Number.parseFloat(paddingPixel[1])
		}

		const paddingCharY = (paddingPixelY - ratioY / 2) / ratioY
		const paddingCharX = (paddingPixelX - ratioX / 2) / ratioX

		// Switch order for blockdata
		return [paddingCharX, paddingCharY]
	}

	// From blockdata to style property
	if (Array.isArray(source)) {
		const [paddingX, paddingY] = source

		const paddingPixelX = paddingX * ratioX + ratioX / 2
		const paddingPixelY = paddingY * ratioY + ratioY / 2

		// Switch order for style property
		return `${paddingPixelY}px ${paddingPixelX}px`
	}

	throw Error(`Padding source not conform: ${JSON.stringify(source)}`)
}
