import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { convertPadding } from '../utils'
import { charMaps } from '../characters-maps'
import StretchInputComponent from './stretch-input.component'

@Component({
	components: {
		'stretch-input': StretchInputComponent
	},
	template: `
		<div class="card" v-bind:class="blockData.charMapRef" v-bind:id="blockData.id">

			<div v-show="!editing">
				<button class="card-btn-topleft border-primary" type="button" @click="toggleEditing">&#9999;</button>

				<div class="card-header" v-show="blockData.header">{{ blockData.header }}</div>

				<div class="card-body" v-bind:style="cardBodyStyle">
					<p v-for="line in blockData.lines">{{ line }}</p>
				</div>
			</div>

			<template v-if="editing">
				<button class="card-btn-topleft border-success" type="button" @click="toggleEditing">&#10004;</button>

				<button class="card-btn-topright border-danger" type="button" @click="$emit('delete-block')">&#128465;</button>

				<div class="card-header">
					<stretch-input
						v-model="blockData.header"
						v-bind:center="true"
						@keydown.down="focusOnLine(0)"
						ref="header">
					</stretch-input>
				</div>

				<div class="card-body" v-bind:style="cardBodyStyle">
					<stretch-input
						v-for="(line, index) in blockData.lines" v-model="blockData.lines[index]"
						v-bind:key="index"
						@keydown.up="focusOnLine(index - 1)"
						@keydown.down="focusOnLine(index + 1)"
						@keydown.enter="addLine(index)"
						@keydown.delete="removeEmptyLine($event.target.value, index)"
						ref="line">
					</stretch-input>
				</div>

				<button class="card-btn-bottomleft border-info text-info text-monospace" @click="addLine()">line++</button>

				<div class="card-styling-form">
					<select class="mb-1" name="charMap" v-model="blockData.charMapRef">
						<option v-for="charMap in charMaps">{{ charMap.ref }}</option>
					</select>
					<div class="form-inline mb-1">
						<label>Padding X</label>
						<input type="number" name="paddingX" v-model.number="blockData.padding[0]" min="0">
					</div>
					<div class="form-inline">
					<label>Padding Y</label>
					<input type="number" name="paddingY" v-model.number="blockData.padding[1]" min="0">
					</div>
				</div>
			</template>
		</div>
	`
})
export default class EsquisseBlockComponent extends Vue {
	@Prop({ type: Object, required: true })
	blockData: BlockData

	@Prop({ type: Boolean, default: false })
	startEditing: boolean

	charMaps = charMaps
	editing = this.startEditing

	get cardBodyStyle() {
		return {
			padding: convertPadding([this.blockData.padding[0], this.blockData.padding[1]])
		}
	}

	toggleEditing() {
		if (this.editing) {
			// Remove empty lines
			this.blockData.lines = this.blockData.lines.filter(line => Boolean(line.trim()))
		}

		this.editing = !this.editing
	}

	addLine(index?: number) {
		if (index == null) {
			this.blockData.lines.push('')
			const lastIndex = this.blockData.lines.length - 1
			this.focusOnLine(lastIndex)
			return
		}

		const nextIndex = index + 1
		this.blockData.lines.splice(nextIndex, 0, '')
		this.focusOnLine(nextIndex)
	}

	removeEmptyLine(value: string, index: number) {
		if (value === '') {
			const previousIndex = index - 1
			this.blockData.lines.splice(index, 1)
			if (previousIndex > -1) this.focusOnLine(previousIndex)
		}
	}

	focusOnLine(index: number) {
		this.$nextTick(() => {
			if (!this.blockData.lines.length) return
			if (index > this.blockData.lines.length - 1) return

			if (index < 0) return (this.$refs.header as Vue).$el.focus()

			return this.$refs.line[index].$el.focus()
		})
	}
}
