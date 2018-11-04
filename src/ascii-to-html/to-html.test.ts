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
	expect(container.id).toBe('blocks-container')
	expect(container.children).toHaveLength(1)

	const firstElt = container.children[0]
	expect(firstElt.className).toBe('card ascii-rounded')
	expect(firstElt.id).toBe('block1')
	expect(getComputedStyle(firstElt).transform).toBe('translate(0px, 0px)')

	const header = firstElt.children[0]
	expect(header.className).toBe('card-header')

	const firstEltBody = firstElt.children[1]
	expect(getComputedStyle(firstEltBody).padding).toBe('60px 22.5px')
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
	expect(container.id).toBe('blocks-container')
	// console.log('container', container.innerHTML)

	expect(container.children).toHaveLength(3)
	const firstElt = container.children[0]
	expect(firstElt.id).toBe('block1')
	expect(firstElt.className).toBe('card unicode-single')
	expect(getComputedStyle(firstElt).transform).toBe('translate(189px, 0px)')

	const secondElt = container.children[1]
	expect(secondElt.id).toBe('block2')
	expect(getComputedStyle(secondElt).transform).toBe('translate(9px, 72px)')
	expect(secondElt.firstElementChild!.className).toBe('card-header')
	expect(secondElt.firstElementChild!.textContent).toBe('Titles')

	const secondEltSection = secondElt.getElementsByClassName('card-body')[0]
	expect(secondEltSection).toBeDefined()
	expect(secondEltSection.children).toHaveLength(2)
	expect(secondEltSection.children[0].textContent).toBe('Hello Boy')
	expect(secondEltSection.children[1].textContent).toBe('Yolo')

	const thirdElt = container.children[2]
	expect(thirdElt.id).toBe('block3')
	expect(getComputedStyle(thirdElt).transform).toBe('translate(189px, 72px)')
	const thirdEltBody = thirdElt.firstElementChild!
	expect(thirdEltBody.className).toBe('card-body')
	expect(getComputedStyle(thirdEltBody).padding).toBe('36px 22.5px')
})
