import { toHtml } from './to-html'

test('Single ascii component with padding', () => {
	const ascii = [
		'.-------------.',
		'|  Esquisse   |',
		':-------------:',
		'|             |',
		'|             |',
		'|  Hello Boy  |',
		'|  Yolo       |',
		'|             |',
		'|             |',
		"'-------------'"
	].join('\n')

	const container = toHtml(ascii)
	expect(container.id).toBe('container')
	expect(container.children).toHaveLength(1)

	const firstElt = container.children[0]
	expect(firstElt.className).toBe('card')
	expect(firstElt.id).toBe('1')
	expect(firstElt.getAttribute('data-padding')).toBeOneOf('[2,2]', '[2, 2]')
	expect(firstElt.getAttribute('data-charmap')).toBe('ascii-rounded')

	const header = firstElt.firstElementChild!
	expect(header.className).toBe('card-header')
})

test('Ascii text to multiple components', () => {
	const ascii = [
		'                     ┌────┐        ',
		'                     │ AB │        ',
		'                     └────┘        ',
		' ┌───────────┐       ┌─────────┐   ',
		' │  Titles   │       │         │   ',
		' ├───────────┤       │  Yo Yo  │   ',
		' │ Hello Boy │       │         │   ',
		' │ Yolo      │       └─────────┘   ',
		' └───────────┘                     ',
		'                                   '
	].join('\n')

	const container = toHtml(ascii)
	expect(container.id).toBe('container')
	// console.log('container', container.innerHTML)

	expect(container.children).toHaveLength(3)
	const firstElt = container.children[0]
	expect(firstElt.id).toBe('1')
	expect(firstElt.className).toBe('card')

	const secondElt = container.children[1]
	expect(secondElt.id).toBe('2')
	expect(secondElt.firstElementChild!.className).toBe('card-header')
	expect(secondElt.firstElementChild!.textContent).toBe('Titles')

	const secondEltSection = secondElt.getElementsByClassName('card-body')[0]
	expect(secondEltSection).toBeDefined()
	expect(secondEltSection.children).toHaveLength(2)
	expect(secondEltSection.children[0].textContent).toBe('Hello Boy')
	expect(secondEltSection.children[1].textContent).toBe('Yolo')

	const thirdElt = container.children[2]
	expect(thirdElt.id).toBe('3')
	expect(thirdElt.firstElementChild!.className).toBe('card-body')
	expect(thirdElt.getAttribute('data-padding')).toBeOneOf('[2, 1]', '[2,1]')
})
