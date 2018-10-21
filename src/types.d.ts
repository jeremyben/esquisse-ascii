/**
 * Ascii characters map
 */
declare interface CharMap {
	ref: 'unicode-single' | 'unicode-rounded' | 'unicode-double' | 'unicode-heavy' | 'ascii-rounded'
	horizontal: string
	vertical: string
	topLeft: string
	topRight: string
	bottomLeft: string
	bottomRight: string
	junctionLeft: string
	junctionRight: string
	junctionTop: string
	junctionBottom: string
	junctionMiddle: string
}

/**
 * Data exchange format between html and ascii
 */
declare interface BlockData {
	id: number
	lines: string[]
	header: string
	padding: [number, number] // X Y,
	charMapRef: CharMap['ref']
	topLeftLocation?: [number, number] // X Y
	bottomRightLocation?: [number, number] // X Y
}

declare interface HTMLInputEvent extends Event {
	target: HTMLInputElement & EventTarget
}
