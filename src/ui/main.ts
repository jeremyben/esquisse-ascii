import Vue from 'vue'

import { toAscii } from '../html-to-ascii/to-ascii'
import { parseAsciiText } from '../ascii-to-html/to-html'
import { asciiFixture } from '../fixtures'

import EsquisseBlockComponent from './esquisse-block.component'

new Vue({
	el: '#app',

	components: {
		'esquisse-block': EsquisseBlockComponent
	},

	data: {
		blocksData: <BlockData[]>[],
		nextId: 1,
		newBlockStartEditing: false,
		asciiContent: asciiFixture
	},

	methods: {
		transform() {
			this.asciiContent = toAscii(this.$refs.blocksContainer)
		},
		addBlock() {
			this.blocksData.push(newEmptyBlock(this.nextId++))
		},
		deleteBlock(index) {
			this.blocksData.splice(index, 1)
		}
	},

	created() {
		this.blocksData = parseAsciiText(this.asciiContent)
		this.nextId = this.blocksData.length + 1
	},
	mounted() {
		// After the first render of blocks, new blocks added will appear in editing mode.
		this.newBlockStartEditing = true
	}
})

function newEmptyBlock(id: number): BlockData {
	return {
		id,
		charMapRef: 'unicode-single',
		header: '',
		lines: [''],
		padding: [2, 0]
	}
}

function mountVueBlock() {
	const EsquisseBlockClass = Vue.extend(EsquisseBlockComponent)
	const newEsquisse = new EsquisseBlockClass({
		propsData: {
			blockData: newEmptyBlock(1),
			startEditing: true
		}
	})
	newEsquisse.$mount()
	this.$refs.blocksContainer.appendChild(newEsquisse.$el)
}
