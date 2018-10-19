import { charMaps } from './characters-maps'
import { toAscii } from './to-ascii'

test('Simple html without header', () => {
	document.body.innerHTML = `
		<div class="card" id="1" data-padding="[]">
			<section class="card-body">
				<p>Hello <b>Boy</b></p>
				<p>Yolo</p>
			</section>
		</div>
	`
	const card = document.querySelector('.card')

	const ascii = toAscii(card!, charMaps.unicodeSingle)

	// prettier-ignore
	const expected = [
		'┌───────────┐',
		'│ Hello Boy │',
		'│ Yolo      │',
		'└───────────┘'
	].join('\n')

	expect(ascii).toBe(expected)
})

test('Simple html with header', () => {
	document.body.innerHTML = `
		<div class="card" id="1">
			<header class="card-header">Titles</header>
			<section class="card-body">
				<p>Hello <b>Boy</b></p>
				<p>Yolo</p>
			</section>
		</div>
	`
	const card = document.querySelector('.card')

	const ascii = toAscii(card!, charMaps.unicodeSingle)

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

test('Simple html with custom padding', () => {
	document.body.innerHTML = `
		<div class="card" id="1" data-padding="[4, 1]">
			<section class="card-body">
				<p>Hello <b>Boy</b></p>
				<p>Yolo</p>
			</section>
		</div>
	`
	const card = document.querySelector('.card')

	const ascii = toAscii(card!, charMaps.unicodeSingle)

	const expected = [
		'┌─────────────────┐',
		'│                 │',
		'│    Hello Boy    │',
		'│    Yolo         │',
		'│                 │',
		'└─────────────────┘'
	].join('\n')

	expect(ascii).toBe(expected)
})
