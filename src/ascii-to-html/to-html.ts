import { getMaxLength, makeElementFromString } from '../utils'
import { convertPadding, convertTopLeftLocation } from '../spacing'
import { guessCharMap } from '../characters-maps'

/**
 * Get HTML from ascii text
 */
export function toHtml(ascii: string): Element {
	const blocks = parseAsciiText(ascii)
	const elements = blocks.map(makeHtmlComponent)

	const container = document.createElement('div')
	container.id = 'blocks-container'
	container.append(...elements)

	return container
}

/**
 * Get HTML from block metadata
 */
function makeHtmlComponent(block: BlockData): Element {
	const { id, lines, header, padding, charMapRef, topLeft } = block
	const paddingStyle = convertPadding(padding)
	const translateStyle = convertTopLeftLocation(topLeft)

	let html = `<div class="card ${charMapRef}" id="block${id}" style="transform: translate(${translateStyle})">`

	if (header) {
		html += `<div class="card-header">${header}</div>`
	}

	html += `<div class="card-body" style="padding: ${paddingStyle}">`
	for (const line of lines) {
		html += `<p>${line}</p>`
	}

	html += `</div></div>`

	return makeElementFromString(html)
}

/**
 * Get all blocks metadata from ascii text.
 * Naive Regex implmentation. TODO: Use a real parser.
 */
export function parseAsciiText(asciiText: string): BlockData[] {
	if (!asciiText || !asciiText.trim()) return []

	const charMap = guessCharMap(asciiText)
	const { topRegex, bottomRegex, wordRegex, junctionRegex } = makeParsingRegexes(charMap)
	const rows = asciiText.split('\n')
	const blocks: BlockData[] = []

	// TODO: Measure performance : for loop for speed ?
	// for (let rowIndex = 0, rowsLength = rows.length; rowIndex < rowsLength; rowIndex++) { const row = rows[rowIndex] }

	let id = 1
	rows.forEach((row, rowIndex) => {
		let res: RegExpExecArray | null

		// Top Bar
		while ((res = topRegex.exec(row)) != null) {
			// console.log(res.index, res[0], topRegex.lastIndex, 'Y:', rowIndex)

			blocks.push({
				id: id++,
				lines: [],
				header: '',
				padding: [0, 0],
				topLeft: [res.index, rowIndex],
				charMapRef: charMap.ref
			})
		}

		// Lines (empty and with words)
		while ((res = wordRegex.exec(row)) != null) {
			const block = getCorrectBlock(blocks, res.index - 1) // (-1 : regex positive lookbehind)

			if (block) block.lines.push(res[0].trim())
		}

		// Junctions and headers if any
		while ((res = junctionRegex.exec(row)) != null) {
			const block = getCorrectBlock(blocks, res.index)

			// Retrieve and apply header
			if (block && block.lines && block.lines.length) {
				block.header = block.lines.shift()!
			}
		}

		// Bottom Bar
		while ((res = bottomRegex.exec(row)) != null) {
			const block = getCorrectBlock(blocks, res.index)

			// Ends block with bottom location
			if (block) block.bottomRight = [bottomRegex.lastIndex, rowIndex]
		}
	})

	blocks.forEach(block => {
		block.padding = getPadding(block)

		// Remove lines for padding Y
		block.lines.splice(0, block.padding[1])
		block.lines.splice(-block.padding[1], block.padding[1])
	})

	return blocks

	function makeParsingRegexes(charMap: CharMap) {
		const { horizontal, vertical, junctionLeft, junctionRight, topLeft, topRight, bottomLeft, bottomRight } = charMap

		const topRegex = new RegExp(`\\${topLeft}\\${horizontal}+\\${topRight}`, 'g')
		const junctionRegex = new RegExp(`\\${junctionLeft}\\${horizontal}+\\${junctionRight}`, 'g')
		const bottomRegex = new RegExp(`\\${bottomLeft}\\${horizontal}+\\${bottomRight}`, 'g')
		const wordRegex = new RegExp(`(?<=\\${vertical}) ?([^\\${vertical}]*) ?(?=\\${vertical})`, 'g')

		return { topRegex, junctionRegex, bottomRegex, wordRegex }
	}

	function getCorrectBlock(blocks: BlockData[], xAxis: number) {
		// block starting on same axis and not ended (without bottom bar)
		return blocks.find(block => block.topLeft![0] === xAxis && block.bottomRight == null)
	}

	function getPadding(block: BlockData) {
		// Padding X
		const innerWidth = getMaxLength(block.lines)
		const leftBorderX = block.topLeft[0]
		const rightBorderX = block.bottomRight![0]
		const x = (rightBorderX - leftBorderX - 2 - innerWidth) / 2

		// Padding Y
		let y = 0
		for (const line of block.lines) {
			if (line === '') y++
			else break
		}

		return [x, y] as [number, number]
	}
}
