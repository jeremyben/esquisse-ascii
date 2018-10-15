import { Spacing, CharMap } from './types'

export function toAscii(container: Element, charMap: CharMap): string {
	const { lines, title, innerWidth, padding } = parseContainer(container)
	const ascii = doTransform(lines, title, innerWidth, padding, charMap)

	return ascii
}

function doTransform(lines: string[], title: string, innerWidth: number, padding: Spacing, charMap: CharMap) {
	let ascii = makeTopBar(true)

	if (title) {
		ascii += makeTextRow(title, true, true)
		ascii += makeSeparatorBar(true)
	}

	ascii += makeTextRow('', true).repeat(padding.top)

	for (const line of lines) {
		ascii += makeTextRow(line, true)
	}

	ascii += makeTextRow('', true).repeat(padding.bottom)
	ascii += makeBottomBar()

	return ascii

	function makeTextRow(word: string, breakline = false, center = false) {
		const leftPaddingFill = ' '.repeat(padding.left)
		const rightPaddingFill = ' '.repeat(padding.right)

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
			charMap.vertical + leftPaddingFill + leftMiddleFill + word + rightMiddleFill + rightPaddingFill + charMap.vertical

		if (breakline) wordRow += '\n'

		return wordRow
	}

	function makeTopBar(breakline = false) {
		const start = charMap.topLeft
		const middle = charMap.horizontal
		const end = charMap.topRight
		const width = innerWidth + padding.left + padding.right

		let topBar = makeHorizontalBar(width, { start, middle, end })
		if (breakline) topBar += '\n'

		return topBar
	}

	function makeSeparatorBar(breakline = false) {
		const start = charMap.junctionLeft
		const middle = charMap.horizontal
		const end = charMap.junctionRight
		const width = innerWidth + padding.left + padding.right

		let separatorBar = makeHorizontalBar(width, { start, middle, end })
		if (breakline) separatorBar += '\n'

		return separatorBar
	}

	function makeBottomBar(breakline = false) {
		const start = charMap.bottomLeft
		const middle = charMap.horizontal
		const end = charMap.bottomRight
		const width = innerWidth + padding.left + padding.right

		let bottomBar = makeHorizontalBar(width, { start, middle, end })
		if (breakline) bottomBar += '\n'

		return bottomBar
	}
}

function parseContainer(container: Element) {
	const lines = getLines(container)
	const title = getTitle(container)
	const innerWidth = getInnerWidth([...lines, title])
	const padding = getPadding(container)

	return { lines, title, innerWidth, padding }

	function getLines(container: Element) {
		const section = container.getElementsByTagName('section')[0]
		const children = Array.from(section.children)

		return children.map(child => child.textContent!.trim())
	}

	function getTitle(container: Element) {
		const header = container.getElementsByTagName('header')[0]
		if (!header) return ''

		return header.textContent!.trim()
	}

	function getInnerWidth(lines: string[]) {
		let innerWidth = 0

		for (const line of lines) {
			innerWidth = Math.max(innerWidth, line.length)
		}

		return innerWidth
	}

	function getPadding(container: Element) {
		const defaults: Spacing = { top: 0, right: 1, bottom: 0, left: 1 }
		let padding: Partial<Spacing>

		try {
			let paddingAttr = container.getAttribute('data-padding')
			// Add quotes to properties to be JSON.parse compliant
			paddingAttr = paddingAttr!.replace(/([a-zA-Z]+)\s*:/g, '"$1":')
			padding = JSON.parse(paddingAttr) || {}
		} catch (error) {
			if (error instanceof SyntaxError) console.error('Bad data-padding format')
			padding = {}
		}

		return Object.assign(defaults, padding) as Spacing
	}
}

function makeHorizontalBar(
	middleWidth: number,
	{ start, middle, end }: { start: string; middle: string; end: string }
) {
	const middleFill = middle.repeat(middleWidth)
	return start + middleFill + end
}
