import { toAscii } from './to-ascii'

describe('Simple HTML components', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
	})

	test('HTML component', () => {
		const warnSpy = jest.spyOn(console, 'warn')
		document.body.innerHTML = `
			<div id="container">
				<div class="card unicode-single" id="block1" style="transform: translate(0px, 0px)">
					<div class="card-body" style="padding: 12px 13.5px">
						<p>Hello Boy</p>
						<p>Yolo</p>
					</div>
				</div>
			</div>
		`

		const container = document.querySelector('#container')!
		const ascii = toAscii(container)
		expect(warnSpy).not.toHaveBeenCalled()

		// prettier-ignore
		const expected = [
			'┌───────────┐',
			'│ Hello Boy │',
			'│ Yolo      │',
			'└───────────┘'
		].join('\n')

		expect(ascii).toBe(expected)
	})

	test('HTML component with header and wrong attributes', () => {
		const warnSpy = jest.spyOn(console, 'warn')
		document.body.innerHTML = `
			<div id="container">
				<div class="card" id="block1">
					<div class="card-header">Titles</div>
					<div class="card-body">
						<p>Hello Boy</p>
						<p>Yolo</p>
					</div>
				</div>
			</div>
		`

		const container = document.querySelector('#container')!
		const ascii = toAscii(container)
		expect(warnSpy).toHaveBeenCalledTimes(3)

		const expected = [
			'┌───────────┐',
			'│  Titles   │',
			'├───────────┤',
			'│ Hello Boy │',
			'│ Yolo      │',
			'└───────────┘'
		].join('\n')

		expect(ascii).toBe(expected)
	})

	test('HTML component with custom attributes', () => {
		const warnSpy = jest.spyOn(console, 'warn')
		document.body.innerHTML = `
			<div id="container">
				<div class="card unicode-double" id="block1" style="transform: translate(0px, 0px)">
					<div class="card-body" style="padding: 36px 40.5px">
						<p>Hello Boy</p>
						<p>Yolo</p>
					</div>
				</div>
			</div>
		`

		const container = document.querySelector('#container')!
		const ascii = toAscii(container)
		expect(warnSpy).not.toHaveBeenCalled()

		const expected = [
			'╔═════════════════╗',
			'║                 ║',
			'║    Hello Boy    ║',
			'║    Yolo         ║',
			'║                 ║',
			'╚═════════════════╝'
		].join('\n')

		expect(ascii).toBe(expected)
	})
})
