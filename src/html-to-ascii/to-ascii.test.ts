import { toAscii } from './to-ascii'

describe('Simple HTML components', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
	})

	test('HTML component without padding attributes', () => {
		const warnSpy = jest.spyOn(console, 'warn')
		document.body.innerHTML = `
			<div id="container">
				<div class="card unicode-single" id="1">
					<div class="card-body" style="padding: 0.75rem 0.75rem">
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
				<div class="card" id="1">
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
		expect(warnSpy).toHaveBeenCalledTimes(2)

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
				<div class="card unicode-double" id="1">
					<div class="card-body" style="padding: 1.75rem 2.25rem">
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
