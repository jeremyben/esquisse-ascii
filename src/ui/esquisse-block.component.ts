import { fromEvent, Subject, Observable } from 'rxjs'
import { distinctUntilChanged, map, startWith, switchMapTo, takeUntil, tap } from 'rxjs/operators'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { charMaps } from '../characters-maps'
import { convertPadding, ratioX, ratioY, convertTopLeftLocation, toPixel, toChar } from '../spacing'
import { sameArrays } from '../utils'
import StretchInputComponent from './stretch-input.component'

@Component({
	components: {
		'stretch-input': StretchInputComponent
	},
	template: `
	<div class="card" v-bind:class="blockData.charMapRef" v-bind:id="'block' + blockData.id" v-bind:style="cardStyle">

		<button class="card-btn-bottomright border-secondary cursor-move" ref="move" type="button">&#9995;</button>

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

	editing = this.startEditing
	charMaps = charMaps

	unsub$ = new Subject<void>()

	mounted() {
		this.makeDraggablefrom(this.$refs.move as Element)
	}

	destroyed() {
		this.unsub$.next()
		this.unsub$.complete()
	}

	get cardStyle() {
		return {
			transform: `translate(${convertTopLeftLocation(this.blockData.topLeft)})`
		}
	}

	get cardBodyStyle() {
		return {
			padding: convertPadding(this.blockData.padding)
		}
	}

	makeDraggablefrom(element: Element = this.$el) {
		const mouseDown$ = fromEvent<MouseEvent>(element, 'mousedown')
		const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove')
		const mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup')
		const mouseDrag$ = mouseDown$.pipe(switchMapTo(mouseMove$.pipe(takeUntil(mouseUp$))))

		// Keep accumulators different from component state to update in steps instead of realtime
		let accX = 0
		let accY = 0

		const updatePosition$ = mouseDrag$.pipe(
			map(event => [event.movementX, event.movementY]),
			startWith(toPixel(this.blockData.topLeft)),
			tap(([x, y]) => {
				// Update accumulators
				accX += x
				accY += y

				// Bound to container
				const elRect = this.$el.getBoundingClientRect()
				const containerRect = (this.$root.$refs.blocksContainer as Element).getBoundingClientRect()

				// Left
				if (accX < 0) accX = 0

				// Right
				if (elRect.right > containerRect.right) {
					accX = Math.round(containerRect.width - elRect.width)
				}

				// Top
				if (accY < 0) accY = 0

				// Bottom
				if (elRect.bottom > containerRect.bottom) {
					accY = Math.round(containerRect.height - elRect.height)
				}
			}),
			map(() => {
				// Release values from accumulators step by step according to ratio
				const x = Math.floor(accX / ratioX) * ratioX
				const y = Math.floor(accY / ratioY) * ratioY
				return [x, y] as [number, number]
			}),
			distinctUntilChanged(sameArrays),
			takeUntil(this.unsub$)
		)

		updatePosition$.subscribe(xy => {
			this.blockData.topLeft = toChar(xy)
		})
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
