declare global {
	/**
	 * Ascii characters map
	 */
	interface CharMap {
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
	interface BlockData {
		id: number
		lines: string[]
		header: string
		padding: [number, number] // X Y,
		charMapRef: CharMap['ref']
		topLeftLocation?: [number, number] // X Y
		bottomRightLocation?: [number, number] // X Y
	}

	interface HTMLInputEvent extends Event {
		target: HTMLInputElement & EventTarget
	}
}

// Augment and fix interactjs typings
import { SnapFunction } from 'interactjs'

declare module 'interactjs' {
	export interface InteractStatic {
		createSnapGrid(opt: { x: number; y: number; range?: number; offset?: Position }): SnapFunction
	}

	export interface DraggableOptions {
		allowFrom?: string
	}
}
