import { toAscii } from '../html-to-ascii/to-ascii'
import { toHtml } from '../ascii-to-html/to-html'
import { guessCharMap, getCharMapFromRef } from '../characters-maps'
import { convertPadding } from '../utils'

const toggleBtn = document.querySelector('#toggle')!
const charmapSelect = document.querySelector('select[name="charmap"]') as HTMLInputElement
const paddingXInput = document.querySelector('input[name="paddingX"]') as HTMLInputElement
const paddingYInput = document.querySelector('input[name="paddingY"]') as HTMLInputElement

document.addEventListener('DOMContentLoaded', event => {
	const htmlContainer = document.querySelector('#container')!

	const cardBody = htmlContainer.children[0].getElementsByClassName('card-body')[0]
	const paddingStyle = (<any>cardBody).style.padding as string

	const [paddingX, paddingY] = convertPadding(paddingStyle)

	paddingXInput.value = String(paddingX)
	paddingYInput.value = String(paddingY)
})

toggleBtn.addEventListener('click', event => {
	const htmlContainer = document.querySelector('#container')!
	const asciiContainer = document.querySelector('#ascii')!

	if (htmlContainer.innerHTML && !asciiContainer.textContent) {
		const ascii = toAscii(htmlContainer)
		asciiContainer.textContent = ascii
		htmlContainer.innerHTML = ''
	} else {
		const newHtmlContainer = toHtml(asciiContainer.textContent!)
		htmlContainer.parentNode!.replaceChild(newHtmlContainer, htmlContainer)
		asciiContainer.textContent = ''
	}
})

charmapSelect.addEventListener('change', (event: HTMLInputEvent) => {
	const newValue = event.target.value as CharMap['ref']
	const htmlContainer = document.querySelector('#container')!
	const asciiContainer = document.querySelector('#ascii')!

	if (htmlContainer.innerHTML && !asciiContainer.textContent) {
		const children = Array.from(htmlContainer.children)
		for (const child of children) {
			const oldValue = child.classList.item(1)!
			child.classList.replace(oldValue, newValue)
		}
	} else {
		const asciiText = asciiContainer.textContent!
		const oldCharMap = guessCharMap(asciiText)
		const newCharMap = getCharMapFromRef(newValue)

		// TODO: Yep
		asciiContainer.textContent = asciiText
			.replace(new RegExp(oldCharMap.horizontal, 'g'), newCharMap.horizontal)
			.replace(new RegExp(oldCharMap.vertical, 'g'), newCharMap.vertical)
			.replace(new RegExp(oldCharMap.topLeft, 'g'), newCharMap.topLeft)
			.replace(new RegExp(oldCharMap.topRight, 'g'), newCharMap.topRight)
			.replace(new RegExp(oldCharMap.bottomLeft, 'g'), newCharMap.bottomLeft)
			.replace(new RegExp(oldCharMap.bottomRight, 'g'), newCharMap.bottomRight)
			.replace(new RegExp(oldCharMap.junctionLeft, 'g'), newCharMap.junctionLeft)
			.replace(new RegExp(oldCharMap.junctionRight, 'g'), newCharMap.junctionRight)
			.replace(new RegExp(oldCharMap.junctionTop, 'g'), newCharMap.junctionTop)
			.replace(new RegExp(oldCharMap.junctionBottom, 'g'), newCharMap.junctionBottom)
			.replace(new RegExp(oldCharMap.junctionMiddle, 'g'), newCharMap.junctionMiddle)
	}
})

const paddingHandler = (event: HTMLInputEvent) => {
	const htmlContainer = document.querySelector('#container')!
	const asciiContainer = document.querySelector('#ascii')!

	if (htmlContainer.innerHTML && !asciiContainer.textContent) {
		const paddingX = parseInt(paddingXInput.value)
		const paddingY = parseInt(paddingYInput.value)
		const paddingStyle = convertPadding([paddingX, paddingY])

		const children = Array.from(htmlContainer.children)
		for (const child of children) {
			const cardBody = child.getElementsByClassName('card-body')[0]
			;(<any>cardBody).style.padding = paddingStyle
		}
	} else {
	}
}

paddingXInput.addEventListener('change', paddingHandler)
paddingYInput.addEventListener('change', paddingHandler)
