import { getMaxLength } from '../utils'
import { convertPadding, convertTopLeftLocation } from '../spacing'
import { getCharMapFromRef } from '../characters-maps'

/**
 * get ascii text from HTML element
 */
export function toAscii(container: Element): string {
	const elements = Array.from(container.children)
	const blocks = elements.map(parseHtmlElement)
	return makeAsciiCanvas(blocks)
}

function makeAsciiCanvas(blocks: BlockData[]): string {
	const asciiBlocks = blocks.map(block => {
		return {
			blockRows: makeAsciiRows(block),
			topLeft: block.topLeft
		}
	})

	const canvas: string[][] = []

	for (const { blockRows, topLeft } of asciiBlocks) {
		const [left, top] = topLeft
		const bottom = top + blockRows.length
		const right = left + blockRows[0].length

		// Extend canvas height if necessary
		const heightDiff = bottom - canvas.length

		for (let i = 0; i < heightDiff; i++) {
			canvas.push([])
		}

		blockRows.forEach((blockRow, index) => {
			// Mark index by placing dummy value in canvas row
			// because splice can't start at an index above length
			canvas[top + index][left] = ''
			canvas[top + index].splice(left, blockRow.length, ...blockRow.split(''))
		})
	}

	const canvasRows: string[] = []

	// Fill sparse values with whitespace and join characters in rows
	// Must use a classic for loop: https://stackoverflow.com/a/35049102/4776628
	for (let row = 0; row < canvas.length; row++) {
		for (let char = 0; char < canvas[row].length; char++) {
			if (!(char in canvas[row])) canvas[row][char] = ' '
		}

		const asciiRow = canvas[row].join('')
		canvasRows.push(asciiRow)
	}

	return canvasRows.join('\n')
}

/**
 * Get ascii parts from block metadata
 */
function makeAsciiRows(block: BlockData): string[] {
	const { lines, header, padding, charMapRef } = block
	const [paddingX, paddingY] = padding
	const wordsMaxWidth = getMaxLength([...lines, header])
	const innerWidth = wordsMaxWidth + paddingX * 2
	const charMap = getCharMapFromRef(charMapRef)

	const rows: string[] = []

	rows.push(makeBar('top'))

	if (header) {
		rows.push(makeLine(header, true))
		rows.push(makeBar('separator'))
	}

	for (let i = 0; i < paddingY; i++) {
		rows.push(makeLine())
	}

	for (const line of lines) {
		rows.push(makeLine(line))
	}

	for (let i = 0; i < paddingY; i++) {
		rows.push(makeLine())
	}

	rows.push(makeBar('bottom'))

	return rows

	function makeLine(word: string = '', center = false) {
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

		return wordRow
	}

	function makeBar(type: 'top' | 'separator' | 'bottom') {
		const { horizontal, topLeft, topRight, junctionLeft, junctionRight, bottomLeft, bottomRight } = charMap

		const middleFill = horizontal.repeat(innerWidth)

		let bar = ''

		if (type === 'top') bar = topLeft + middleFill + topRight
		if (type === 'separator') bar = junctionLeft + middleFill + junctionRight
		if (type === 'bottom') bar = bottomLeft + middleFill + bottomRight

		return bar
	}
}

/**
 * Get block metadata from HTML component
 */
function parseHtmlElement(element: Element): BlockData {
	const id = getId(element)
	const lines = getLines(element)
	const header = getHeaderContent(element)
	const charMapRef = getCharMapRef(element)
	const padding = getPadding(element)
	const topLeft = getTopLeftLocation(element)

	return { id, lines, header, padding, charMapRef, topLeft }

	function getId(element: Element) {
		return Number.parseInt(element.id.replace('block', ''), 10)
	}

	function getLines(element: Element) {
		const cardBody = element.getElementsByClassName('card-body')[0]
		const children = Array.from(cardBody.children)

		return children.map(child => child.textContent!.trim())
	}

	function getHeaderContent(element: Element) {
		const headerElement = element.getElementsByClassName('card-header')[0]
		if (!headerElement) return ''

		return headerElement.textContent!.trim()
	}

	function getCharMapRef(element: Element): CharMap['ref'] {
		const charMapRef = element.classList.item(1) as CharMap['ref']

		if (!charMapRef) {
			console.warn(`Element ${element.id} doesn't have charMap reference, using default`)
			return 'unicode-single'
		}

		return charMapRef
	}

	function getPadding(element: Element): BlockData['padding'] {
		const cardBody = element.getElementsByClassName('card-body')[0]
		const styleAttr = cardBody.getAttribute('style')
		const paddingCapture = /padding: ?([px0-9. ]+)/
		let paddingStyle: string

		try {
			paddingStyle = styleAttr!.match(paddingCapture)![1]
			if (!paddingStyle.includes('px')) throw Error
		} catch (error) {
			console.warn(`No padding on element ${element.id}, using default`)
			return [1, 0]
		}

		return convertPadding(paddingStyle)
	}

	function getTopLeftLocation(element: Element): BlockData['topLeft'] {
		const styleAttr = element.getAttribute('style')
		const translateCapture = /transform: ?translate\(([px0-9,. ]+)\)/
		let translateStyle: string

		try {
			translateStyle = styleAttr!.match(translateCapture)![1]
			if (!translateStyle.includes('px')) throw Error
		} catch (error) {
			console.warn(`No location on element ${element.id}, default to 0,0`)
			return [0, 0]
		}

		return convertTopLeftLocation(translateStyle)
	}
}
