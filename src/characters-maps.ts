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

