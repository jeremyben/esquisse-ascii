import { toAscii } from './to-ascii'
import { charMaps } from './characters-maps'

const goBtn = document.querySelector('#go')!

goBtn.addEventListener('click', function() {
	const htmlContainer = document.querySelector('#html')!
	const asciiContainer = document.querySelector('#ascii')!
	const ascii = toAscii(htmlContainer, charMaps.unicodeSingle)
	asciiContainer.insertAdjacentHTML('afterbegin', ascii)
})
