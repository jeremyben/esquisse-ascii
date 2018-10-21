import { getMaxLength, convertPadding } from '../utils'
import { getCharMapFromRef } from '../characters-maps'

/**
 * get ascii text from HTML element
 */
export function toAscii(container: Element): string {
	const components = Array.from(container.children)
	const blocks = components.map(parseHtmlComponent)

	let ascii = ''
	for (const block of blocks) {
		ascii += makeAsciiComponent(block)
	}

	return ascii
}

/**
 * Get ascii text from block metadata
 */
function makeAsciiComponent(block: BlockData): string {
	const { lines, header, padding, charMapRef } = block
	const [paddingX, paddingY] = padding
	const innerWidth = getMaxLength([...lines, header])
	const charMap = getCharMapFromRef(charMapRef)

	let ascii = makeTopBar(true)

	if (header) {
		ascii += makeTextRow(header, true, true)
		ascii += makeSeparatorBar(true)
	}

	ascii += makeTextRow('', true).repeat(paddingY)

	for (const line of lines) {
		ascii += makeTextRow(line, true)
	}

	ascii += makeTextRow('', true).repeat(paddingY)
	ascii += makeBottomBar()

	return ascii

	function makeTextRow(word: string, breakline = false, center = false) {
		const paddingFill = ' '.repeat(paddingX)

		const remaining = innerWidth - word.length
		let leftMiddleFill: string
		let rightMiddleFill: string

		if (center) {
			leftMiddleFill = rightMiddleFill = ' '.repeat(Math.floor(remaining / 2))
			if (remaining % 2 === 1) rightMiddleFill += ' '
		} else {
			leftMiddleFill = ''
			rightMiddleFill = ' '.repeat(remaining)
		}

		let wordRow =
			charMap.vertical + paddingFill + leftMiddleFill + word + rightMiddleFill + paddingFill + charMap.vertical

		if (breakline) wordRow += '\n'

		return wordRow
	}

	function makeTopBar(breakline = false) {
		const start = charMap.topLeft
		const middle = charMap.horizontal
		const end = charMap.topRight
		const width = innerWidth + paddingX * 2

		let topBar = makeHorizontalBar(width, { start, middle, end })
		if (breakline) topBar += '\n'

		return topBar
	}

	function makeSeparatorBar(breakline = false) {
		const start = charMap.junctionLeft
		const middle = charMap.horizontal
		const end = charMap.junctionRight
		const width = innerWidth + paddingX * 2

		let separatorBar = makeHorizontalBar(width, { start, middle, end })
		if (breakline) separatorBar += '\n'

		return separatorBar
	}

	function makeBottomBar(breakline = false) {
		const start = charMap.bottomLeft
		const middle = charMap.horizontal
		const end = charMap.bottomRight
		const width = innerWidth + paddingX * 2

		let bottomBar = makeHorizontalBar(width, { start, middle, end })
		if (breakline) bottomBar += '\n'

		return bottomBar
	}

	function makeHorizontalBar(
		middleWidth: number,
		{ start, middle, end }: { start: string; middle: string; end: string }
	) {
		const middleFill = middle.repeat(middleWidth)
		return start + middleFill + end
	}
}

/**
 * Get block metadata from HTML component
 */
function parseHtmlComponent(component: Element): BlockData {
	const id = getId(component)
	const lines = getLines(component)
	const header = getHeaderContent(component)
	const padding = getPadding(component)
	const charMapRef = getCharMapRef(component)

	return { id, lines, header, padding, charMapRef }

	function getId(component: Element) {
		return Number.parseInt(component.id, 10)
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

	function getPadding(component: Element): BlockData['padding'] {
		const cardBody = component.getElementsByClassName('card-body')[0]
		const styleAttr = cardBody.getAttribute('style')

		if (!styleAttr || !styleAttr.includes('padding')) {
			console.warn(`No padding on component ${component.id}, using default`)

			return [1, 0]
		}

		// TODO: better parsing for multiple styles
		const paddingStyle = styleAttr.replace(/padding: ?/, '')
		return convertPadding(paddingStyle)
	}

	function getCharMapRef(component: Element): CharMap['ref'] {
		const charMapRef = component.classList.item(1)

		if (!charMapRef) {
			console.warn(`Component ${component.id} doesn't have charMap reference, using default`)

			return 'unicode-single'
		}

		return charMapRef as CharMap['ref']
	}
}
