import { getMaxLength } from './utils'

/**
 * get ascii text from HTML element
 */
export function toAscii(element: Element, charMap: CharMap): string {
	const block = parseHtmlComponent(element)
	const ascii = makeAsciiComponent(block, charMap)
	return ascii
}

/**
 * Get ascii text from block metadata
 */
function makeAsciiComponent(block: BlockData, charMap: CharMap): string {
	const { lines, header, padding } = block
	const [paddingX, paddingY] = padding
	const innerWidth = getMaxLength([...lines, header])

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

	return { id, lines, header, padding }

	function getId(component: Element) {
		return Number.parseInt(component.id, 10)
	}

	function getLines(component: Element) {
		const section = component.getElementsByTagName('section')[0]
		const children = Array.from(section.children)

		return children.map(child => child.textContent!.trim())
	}

	function getHeaderContent(component: Element) {
		const headerElement = component.getElementsByTagName('header')[0]
		if (!headerElement) return ''

		return headerElement.textContent!.trim()
	}

	function getPadding(component: Element) {
		let padding: number[] = []

		try {
			let paddingAttr = component.getAttribute('data-padding')!
			padding = JSON.parse(paddingAttr) || []
		} catch (error) {
			if (error instanceof SyntaxError) console.error('Bad data-padding format')
		}

		if (padding.length === 0) padding.push(1, 0)
		if (padding.length === 1) padding.push(0)

		return padding as [number, number]
	}
}
