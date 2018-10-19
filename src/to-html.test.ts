import { toHtml } from './to-html'

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

	expect(container.children).toHaveLength(3)
	const firstElt = container.children[0]
	expect(firstElt.id).toBe('1')
	expect(firstElt.className).toBe('card')

	const secondElt = container.children[1]
	expect(secondElt.id).toBe('2')
	expect(secondElt.firstElementChild!.tagName).toBe('HEADER')
	expect(secondElt.firstElementChild!.className).toBe('card-header')
	expect(secondElt.firstElementChild!.textContent).toBe('Titles')

	const secondEltSection = secondElt.getElementsByTagName('section')[0]
	expect(secondEltSection).toBeDefined()
	expect(secondEltSection.children).toHaveLength(2)
	expect(secondEltSection.children[0].textContent).toBe('Hello Boy')
	expect(secondEltSection.children[1].textContent).toBe('Yolo')

	const thirdElt = container.children[2]
	expect(thirdElt.id).toBe('3')
	expect(thirdElt.firstElementChild!.tagName).toBe('SECTION')
	expect(thirdElt.firstElementChild!.className).toBe('card-body')
	expect(thirdElt.getAttribute('data-padding')).toBeOneOf('[2, 1]', '[2,1]')
})
