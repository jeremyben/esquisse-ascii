import { getMaxLength } from '../utils'
import { convertPadding, convertTopLeftLocation } from '../spacing'
import { getCharMapFromRef } from '../characters-maps'

/**
 * get ascii text from HTML element
 */
export function toAscii(container: Element): string {
	const components = Array.from(container.children)
	const blocks = components.map(parseHtmlComponent)

	let ascii = ''
	blocks.forEach((block, index) => {
		ascii += makeAsciiComponent(block)
		if (index < blocks.length - 1) ascii += '\n'
	})

	return ascii
}

/**
 * Get ascii text from block metadata
 */
function makeAsciiComponent(block: BlockData): string {
	const { lines, header, padding, charMapRef } = block
	const [paddingX, paddingY] = padding
	const wordsMaxWidth = getMaxLength([...lines, header])
	const innerWidth = wordsMaxWidth + paddingX * 2
	const charMap = getCharMapFromRef(charMapRef)

	let ascii = makeBar('top', true)

	if (header) {
		ascii += makeTextRow(header, true, true)
		ascii += makeBar('separator', true)
	}

	ascii += makeTextRow('', true).repeat(paddingY)

	for (const line of lines) {
		ascii += makeTextRow(line, true)
	}

	ascii += makeTextRow('', true).repeat(paddingY)
	ascii += makeBar('bottom')

	return ascii

	function makeTextRow(word: string, breakline = false, center = false) {
		const { vertical } = charMap
		const paddingFill = ' '.repeat(paddingX)

		const remainingWidth = wordsMaxWidth - word.length
		let leftMiddleFill: string
		let rightMiddleFill: string

		if (center) {
			leftMiddleFill = rightMiddleFill = ' '.repeat(Math.floor(remainingWidth / 2))
			if (remainingWidth % 2 === 1) rightMiddleFill += ' '
		} else {
			leftMiddleFill = ''
			rightMiddleFill = ' '.repeat(remainingWidth)
		}

		let wordRow = vertical + paddingFill + leftMiddleFill + word + rightMiddleFill + paddingFill + vertical

		if (breakline) wordRow += '\n'

		return wordRow
	}

	function makeBar(type: 'top' | 'separator' | 'bottom', breakline = false) {
		const { horizontal, topLeft, topRight, junctionLeft, junctionRight, bottomLeft, bottomRight } = charMap

		const middleFill = horizontal.repeat(innerWidth)

		let bar = ''

		if (type === 'top') bar = topLeft + middleFill + topRight
		if (type === 'separator') bar = junctionLeft + middleFill + junctionRight
		if (type === 'bottom') bar = bottomLeft + middleFill + bottomRight

		if (breakline) bar += '\n'

		return bar
	}
}

/**
 * Get block metadata from HTML component
 */
function parseHtmlComponent(component: Element): BlockData {
	const id = getId(component)
	const lines = getLines(component)
	const header = getHeaderContent(component)
	const charMapRef = getCharMapRef(component)
	const padding = getPadding(component)
	const topLeft = getTopLeftLocation(component)

	return { id, lines, header, padding, charMapRef, topLeft }

	function getId(component: Element) {
		return Number.parseInt(component.id.replace('block', ''), 10)
	}

	function getLines(component: Element) {
		const cardBody = component.getElementsByClassName('card-body')[0]
		const children = Array.from(cardBody.children)

		return children.map(child => child.textContent!.trim())
	}

	function getHeaderContent(component: Element) {
		const headerElement = component.getElementsByClassName('card-header')[0]
		if (!headerElement) return ''

		return headerElement.textContent!.trim()
	}

	function getCharMapRef(component: Element): CharMap['ref'] {
		const charMapRef = component.classList.item(1) as CharMap['ref']

		if (!charMapRef) {
			console.warn(`Component ${component.id} doesn't have charMap reference, using default`)
			return 'unicode-single'
		}

		return charMapRef
	}

	function getPadding(component: Element): BlockData['padding'] {
		const cardBody = component.getElementsByClassName('card-body')[0]
		const styleAttr = cardBody.getAttribute('style')
		const paddingCapture = /padding: ?([px0-9. ]+)/
		let paddingStyle: string

		try {
			paddingStyle = styleAttr!.match(paddingCapture)![1]
			if (!paddingStyle.includes('px')) throw Error
		} catch (error) {
			console.warn(`No padding on component ${component.id}, using default`)
			return [1, 0]
		}

		return convertPadding(paddingStyle)
	}

	function getTopLeftLocation(component: Element): BlockData['topLeft'] {
		const styleAttr = component.getAttribute('style')
		const translateCapture = /transform: ?translate\(([px0-9,. ]+)\)/
		let translateStyle: string

		try {
			translateStyle = styleAttr!.match(translateCapture)![1]
			if (!translateStyle.includes('px')) throw Error
		} catch (error) {
			console.warn(`No location on component ${component.id}, default to 0,0`)
			return [0, 0]
		}

		return convertTopLeftLocation(translateStyle)
	}
}
