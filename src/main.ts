import { toAscii } from './to-ascii'
import { unicodeSingleMap } from './characters-maps'

const goBtn = document.querySelector('#go')!

goBtn.addEventListener('click', function() {
	const htmlContainer = document.querySelector('#html')!
	const asciiContainer = document.querySelector('#ascii')!
	const ascii = toAscii(htmlContainer, unicodeSingleMap)
	asciiContainer.insertAdjacentHTML('afterbegin', ascii)
})
