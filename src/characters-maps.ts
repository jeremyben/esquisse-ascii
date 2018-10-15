import { CharMap } from './types'

export const unicodeSingleMap: CharMap = {
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

export const unicodeRoundedMap: CharMap = {
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

export const unicodeDoubleMap: CharMap = {
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

export const asciiSingleMap: CharMap = {
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

export const asciiRoundedMap: CharMap = {
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
