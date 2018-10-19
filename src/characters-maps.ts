const unicodeSingle: CharMap = {
	horizontal: '─',
	vertical: '│',
	topLeft: '┌',
	topRight: '┐',
	bottomLeft: '└',
	bottomRight: '┘',
	junctionLeft: '├',
	junctionRight: '┤',
	junctionTop: '┬',
	junctionBottom: '┴',
	junctionMiddle: '┼'
}

const unicodeRounded: CharMap = {
	horizontal: '─',
	vertical: '│',
	topLeft: '╭',
	topRight: '╮',
	bottomLeft: '╰',
	bottomRight: '╯',
	junctionLeft: '├',
	junctionRight: '┤',
	junctionTop: '┬',
	junctionBottom: '┴',
	junctionMiddle: '┼'
}

const unicodeDouble: CharMap = {
	horizontal: '═',
	vertical: '║',
	topLeft: '╔',
	topRight: '╗',
	bottomLeft: '╚',
	bottomRight: '╝',
	junctionLeft: '╠',
	junctionRight: '╣',
	junctionTop: '╦',
	junctionBottom: '╩',
	junctionMiddle: '╬'
}

const asciiSingle: CharMap = {
	horizontal: '-',
	vertical: '|',
	topLeft: '+',
	topRight: '+',
	bottomLeft: '+',
	bottomRight: '+',
	junctionLeft: '+',
	junctionRight: '+',
	junctionTop: '+',
	junctionBottom: '+',
	junctionMiddle: '+'
}

const asciiRounded: CharMap = {
	horizontal: '-',
	vertical: '|',
	topLeft: '.',
	topRight: '.',
	bottomLeft: "'",
	bottomRight: "'",
	junctionLeft: ':',
	junctionRight: ':',
	junctionTop: '+',
	junctionBottom: '+',
	junctionMiddle: '+'
}

export const charMaps = {
	unicodeSingle,
	unicodeRounded,
	unicodeDouble,
	asciiSingle,
	asciiRounded
}

/**
 * Naive implementation of guessing characters map.
 * Based on top left character, since it's different in every map.
 */
export function guessCharMap(ascii: string): CharMap {
	let charMap

	for (const key of Object.keys(charMaps)) {
		if (ascii.indexOf(charMaps[key].topLeft) > -1) charMap = charMaps[key]
		else charMap = unicodeSingle
	}

	return charMap as CharMap
}
