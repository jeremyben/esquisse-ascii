import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component({
	inheritAttrs: false,
	template: `
		<input type="text"
			v-bind:class="{'mx-auto': center}"
			v-bind:value="value"
			v-on="inputListeners">
	`
})
export default class StretchInputComponent extends Vue {
	@Prop({ type: String, required: true })
	value: string

	@Prop({ type: Boolean, default: false })
	center: boolean

	stretch(element: HTMLElement) {
		element.style.width = '0'
		let widthUpdated = element.scrollWidth

		const { boxSizing, borderLeftWidth, borderRightWidth } = getComputedStyle(element)

		if (boxSizing === 'border-box') {
			const borderXWidth = Number.parseInt(borderLeftWidth || '0') + Number.parseInt(borderRightWidth || '0')
			widthUpdated += borderXWidth
		}

		widthUpdated = Math.max(widthUpdated, 70) // largeur minimum

		element.style.width = `${widthUpdated}px`
	}

	get inputListeners() {
		// https://vuejs.org/v2/guide/components-custom-events.html#Binding-Native-Events-to-Components

		const myListeners = {
			input: event => {
				this.$emit('input', event.target.value)
				this.stretch(event.target)
			}
		}

		return Object.assign({}, this.$listeners, myListeners)
	}

	mounted() {
		this.stretch(this.$el)
	}
}
