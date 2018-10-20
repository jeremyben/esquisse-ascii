import { toAscii } from './to-ascii'
import { toHtml } from './to-html'

const toggleBtn = document.querySelector('#toggle')!

toggleBtn.addEventListener('click', function() {
	const htmlContainer = document.querySelector('#container')!
	const asciiContainer = document.querySelector('#ascii')!

	if (!asciiContainer.textContent && htmlContainer.innerHTML) {
		const ascii = toAscii(htmlContainer)
		asciiContainer.textContent = ascii
		htmlContainer.innerHTML = ''
	} else {
		const newHtmlContainer = toHtml(asciiContainer.textContent!)
		htmlContainer.parentNode!.replaceChild(newHtmlContainer, htmlContainer)
		asciiContainer.textContent = ''
	}
})
