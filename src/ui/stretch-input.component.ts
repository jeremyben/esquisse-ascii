import { ComponentOptions } from 'vue'

export default <ComponentOptions<any>>{
	inheritAttrs: false,

	props: {
		value: {
			type: String,
			required: true
		},
		center: {
			type: Boolean,
			default: false
		}
	},

	template: `
		<input type="text"
			v-bind:class="{'mx-auto': center}"
			v-bind:value="value"
			v-on="inputListeners">
	`,

	computed: {
		inputListeners() {
			// https://vuejs.org/v2/guide/components-custom-events.html#Binding-Native-Events-to-Components

			const myListeners = {
				input: event => {
					this.$emit('input', event.target.value)
					this.stretch(event.target)
				}
			}

			return Object.assign({}, this.$listeners, myListeners)
		}
	},

	methods: {
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
	},

	mounted() {
		this.stretch(this.$el)
	}
}
