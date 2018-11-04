// prettier-ignore
export const asciiFixture =
`
 ┌─────────────────────┐
 │      Esquisse       │
 ├─────────────────────┤
 │                     │
 │  Lorem ipsum dolor  │
 │  Yolo               │
 │                     │
 └─────────────────────┘`

export const blockFixture: BlockData = {
	id: 1,
	charMapRef: 'unicode-single',
	header: 'Esquisse',
	lines: ['Lorem ipsum dolor sit amet', 'Yolo'],
	padding: [3, 1],
	topLeft: [1, 1]
}
