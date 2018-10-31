import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { charMaps } from '../characters-maps'
import { convertPadding, ratioX, ratioY } from '../spacing'
import StretchInputComponent from './stretch-input.component'
import interact from 'interactjs'

@Component({
	components: {
		'stretch-input': StretchInputComponent
	},
	template: `
	<div class="card" v-bind:class="blockData.charMapRef" v-bind:id="'block' + blockData.id" v-bind:style="cardStyle">

		<button class="card-btn-bottomright border-secondary cursor-move" type="button">&#9995;</button>

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

			<div class="card-edit-padding-x">
				<input type="number" name="paddingX" v-model.number="blockData.padding[0]" min="0">
			</div>

			<div class="card-edit-padding-y">
				<input type="number" name="paddingY" v-model.number="blockData.padding[1]" min="0">
			</div>

			<button class="card-btn-bottomleft border-info text-info text-monospace" @click="addLine()">line++</button>

			<div class="card-edit-charmap">
				<select name="charMap" v-model="blockData.charMapRef">
					<option v-for="charMap in charMaps">{{ charMap.ref }}</option>
				</select>
			</div>

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
	topPosition = 0
	leftPosition = 0

	mounted() {
		interact('#block' + this.blockData.id)
			.draggable({
				allowFrom: '.cursor-move',
				snap: {
					targets: [interact.createSnapGrid({ x: ratioX, y: ratioY })],
					range: Infinity,
					relativePoints: [{ x: 0, y: 0 }]
				},
				restrict: {
					restriction: 'parent',
					endOnly: true,
					elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
				},
				inertia: false
			})
			.on('dragmove', event => {
				let { dx, dy, restrict } = event

				const isCorrectMove = dx % ratioX === 0 && dy % ratioY === 0
				if (!restrict && !isCorrectMove) return

				this.leftPosition += dx
				this.topPosition += dy

				if (restrict && restrict.dx > 0) this.leftPosition = 0
				if (restrict && restrict.dy > 0) this.topPosition = 0
			})
	}

	get cardStyle() {
		return {
			transform: `translate(${this.leftPosition}px, ${this.topPosition}px)`
		}
	}

	get cardBodyStyle() {
		return {
			padding: convertPadding([this.blockData.padding[0], this.blockData.padding[1]])
		}
	}

	toggleEditing() {
		if (this.editing) {
			// Remove empty lines and keep at least one
			this.blockData.lines = this.blockData.lines.filter(line => Boolean(line.trim()))
			if (!this.blockData.lines.length) this.blockData.lines.push('')
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
