export const charMaps: CharMap[] = [
	{
		ref: 'unicode-single',
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
	},
	{
		ref: 'unicode-rounded',
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
	},
	{
		ref: 'unicode-double',
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
	},
	{
		ref: 'unicode-heavy',
		horizontal: '━',
		vertical: '┃',
		topLeft: '┏',
		topRight: '┓',
		bottomLeft: '┗',
		bottomRight: '┛',
		junctionLeft: '┣',
		junctionRight: '┫',
		junctionTop: '┳',
		junctionBottom: '┻',
		junctionMiddle: '╋'
	},
	{
		ref: 'ascii-rounded',
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
]

/**
 * Get unicode-single by default.
 */
export function getCharMapFromRef(ref: CharMap['ref']): CharMap {
	const found = charMaps.find(charMap => charMap.ref === ref)

	if (!found) {
		console.warn('Bad CharMap reference in one of your components, using default')
		return charMaps[0]
	}

	return found
}

/**
 * Naive implementation of guessing characters map.
 */
export function guessCharMap(asciiText: string): CharMap {
	const guessed = charMaps.find(charMap => asciiText.includes(charMap.topLeft + charMap.horizontal))

	if (!guessed) throw new Error('Impossible to guess the characters map')

	return guessed
}
