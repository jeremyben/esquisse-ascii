// Constants for calculations to match text whitespaces and browser spacing
export const ratioX = 9
export const ratioY = 24

export function toPixel(source: [number, number]): [number, number] {
	const [x, y] = source
	return [x * ratioX, y * ratioY]
}

export function toChar(source: [number, number]): [number, number] {
	const [x, y] = source
	return [x / ratioX, y / ratioY]
}

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

export function convertTopLeftLocation(source: BlockData['topLeft']): string
export function convertTopLeftLocation(source: string): BlockData['topLeft']
export function convertTopLeftLocation(source: string | BlockData['topLeft']): string | BlockData['topLeft'] {
	// From style property to blockdata
	if (typeof source === 'string') {
		const translatePixel = source.split(', ')
		const translatePixelX = Number.parseFloat(translatePixel[0])
		const translatePixelY = Number.parseFloat(translatePixel[1])

		return toChar([translatePixelX, translatePixelY])
	}

	// From blockdata to style property
	if (Array.isArray(source)) {
		const [translatePixelX, translatePixelY] = toPixel(source)

		return `${translatePixelX}px, ${translatePixelY}px`
	}

	throw Error(`topLeft source not conform: ${JSON.stringify(source)}`)
}
