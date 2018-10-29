import Vue from 'vue'
import Component from 'vue-class-component'

import { toAscii } from '../html-to-ascii/to-ascii'
import { parseAsciiText } from '../ascii-to-html/to-html'
import { asciiFixture } from '../fixtures'

import EsquisseBlockComponent from './esquisse-block.component'

@Component({
	components: {
		'esquisse-block': EsquisseBlockComponent
	},
	template: `
		<div class="container">
			<button class="btn btn-secondary mb-4 text-monospace" type="button" @click="addBlock">block++</button>

			<div ref="blocksContainer" class="blocks-container">
				<esquisse-block
					v-for="(blockData, index) of blocksData"
					v-bind:key="blockData.id"
					v-bind:block-data="blockData"
					v-bind:start-editing="newBlockStartEditing"
					v-on:delete-block="deleteBlock(index)"
					ref="block">
				</esquisse-block>
			</div>

			<div class="horizontal-split">
				<hr>
				<button type="button" @click="transform">ASCII &#129095;</button>
			</div>

			<pre>{{ asciiContent }}</pre>
		</div>
	`
})
export default class AppComponent extends Vue {
	blocksData: BlockData[] = []
	nextId = 1
	newBlockStartEditing = false
	asciiContent = asciiFixture

	created() {
		this.blocksData = parseAsciiText(this.asciiContent)
		this.nextId = this.blocksData.length + 1
	}

	mounted() {
		// After the first render of blocks, new blocks added will appear in editing mode.
		this.newBlockStartEditing = true
	}

	transform() {
		this.asciiContent = toAscii(this.$refs.blocksContainer as Element)
	}

	addBlock() {
		this.blocksData.push(this.newEmptyBlock(this.nextId++))
	}

	deleteBlock(index) {
		this.blocksData.splice(index, 1)
	}

	newEmptyBlock(id: number): BlockData {
		return {
			id,
			charMapRef: 'unicode-single',
			header: '',
			lines: [''],
			padding: [2, 0]
		}
	}
}
