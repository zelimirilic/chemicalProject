<template>
	<div>
		<div class="card-body">
			<div class="whiteBg borderTRBL rounded">
				<TreeMultiple class="hp-280 py-3 pl-3" :data="data" :state="state" @click="addItem($event)" :listOfSelectedItems="listOfSelectedItems" v-if="data" />
			</div>
			<div class="multiSelTree mxhp-156 mt-3 scrollBar">
				<div class="statements d-flex align-items-center" v-for="(item, index) in listOfSelectedItems" :key="index">
					<div class="col"><span v-tooltip.left="nodeNamePath(item)">{{ item.item.name }}</span></div>
					<div class="col-auto"><span class="icons icon-delete plainIcn" v-tooltip.left="getTranslation('I00.00039230', 'Delete')" @click="addItem(item)"></span></div>
				</div>
			</div>
		</div>
		<div class="card-footer text-right">
			<ButtonCancel @click="$emit('cancel')" />
			<ButtonOk class="primary" @click="$emit('input', selectedItem)" />
		</div>
	</div>
</template>

<script>
import TreeMultiple from './TreeMultiple.vue';
import { defineState, nodeNamePath } from '../../libraries/tree';
export default {
  components: {
    TreeMultiple
  },
  props: ['data', 'value', 'listOfSelectedItems'],
  data(self) {
    var state = {};
    if (self.value)
      self.value.getParents().forEach(f => defineState(state, f.item, 'opened', true));

    defineState(state, (self.value || self.data).item, 'opened', open);
    defineState(state, (self.value || self.data).item, 'clicked', open);
    return {
      selectedItem: (self.value || self.data),
      state
    }
  },
  methods: {
    addItem(item) {
      this.$emit('addItem', item);
    },
    sendList() {
      this.$emit('input', this.selectedItem);
    },
    nodeNamePath: nodeNamePath
  }
}
</script>