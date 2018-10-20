import { toAscii } from './to-ascii'

beforeEach(() => {
	jest.restoreAllMocks()
})

test('Card without data attributes', () => {
	const warnSpy = jest.spyOn(console, 'warn')
	document.body.innerHTML = `
		<div id="container">
			<div class="card" id="1">
				<div class="card-body">
					<p>Hello <b>Boy</b></p>
					<p>Yolo</p>
				</div>
			</div>
		</div>
	`

	const container = document.querySelector('#container')!
	const ascii = toAscii(container)
	expect(warnSpy).toHaveBeenCalled()

	// prettier-ignore
	const expected = [
		'┌───────────┐',
		'│ Hello Boy │',
		'│ Yolo      │',
		'└───────────┘'
	].join('\n')

	expect(ascii).toBe(expected)
})

test('Card with header and empty or wrong data attributes', () => {
	const warnSpy = jest.spyOn(console, 'warn')
	document.body.innerHTML = `
		<div id="container">
			<div class="card" id="1" data-padding="[a,e]" data-charmap="comic-sans">
				<div class="card-header">Titles</div>
				<div class="card-body">
					<p>Hello <b>Boy</b></p>
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

test('Card with custom padding and charmap', () => {
	const warnSpy = jest.spyOn(console, 'warn')
	document.body.innerHTML = `
		<div id="container">
			<div class="card" id="1" data-padding="[4, 1]" data-charmap="unicode-double">
				<div class="card-body">
					<p>Hello <b>Boy</b></p>
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
