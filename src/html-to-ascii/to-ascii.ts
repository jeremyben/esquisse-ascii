import { getMaxLength } from '../utils'
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
		const section = component.getElementsByClassName('card-body')[0]
		const children = Array.from(section.children)

		return children.map(child => child.textContent!.trim())
	}

	function getHeaderContent(component: Element) {
		const headerElement = component.getElementsByClassName('card-header')[0]
		if (!headerElement) return ''

		return headerElement.textContent!.trim()
	}

	function getPadding(component: Element) {
		let padding: number[] = []

		try {
			let paddingAttr = component.getAttribute('data-padding')!
			padding = JSON.parse(paddingAttr) || []
		} catch (error) {
			if (error instanceof SyntaxError) {
				console.warn(`Bad padding format on component ${component.id}, using default`)
			}
		}

		if (padding.length === 0) padding.push(1, 0)
		if (padding.length === 1) padding.push(0)

		return padding as [number, number]
	}

	function getCharMapRef(component: Element) {
		const charMapRef = component.getAttribute('data-charmap')

		if (!charMapRef) {
			console.warn(`Component ${component.id} doesn't have charMap reference, using default`)
		}

		return charMapRef as CharMap['ref']
	}
}
