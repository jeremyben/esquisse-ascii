import { unicodeSingleMap } from './characters-maps'
import { toAscii } from './to-ascii'

test('Simple html without header', () => {
	document.body.innerHTML = `
		<div class="card" data-padding='{}'>
			<section class="card-body">
				<p>Hello <b>Boy</b></p>
				<p>Yolo</p>
			</section>
		</div>
	`
	const card = document.querySelector('.card')

	const ascii = toAscii(card!, unicodeSingleMap)

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
		<div class="card">
			<header class="card-header">Titles</header>
			<section class="card-body">
				<p>Hello <b>Boy</b></p>
				<p>Yolo</p>
			</section>
		</div>
	`
	const card = document.querySelector('.card')

	const ascii = toAscii(card!, unicodeSingleMap)

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
		<div class="card" data-padding="{top: 1, bottom: 1, left: 4, right: 4}">
			<section class="card-body">
				<p>Hello <b>Boy</b></p>
				<p>Yolo</p>
			</section>
		</div>
	`
	const card = document.querySelector('.card')

	const ascii = toAscii(card!, unicodeSingleMap)

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
