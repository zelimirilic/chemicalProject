<template>
	<div>
		<div class="card-body">
			<div class="whiteBg borderTRBL rounded">
				<TreeMultiple class="hp-280 py-3 pl-3" :data="data" :state="state" @click="addItem($event)" :listOfSelectedItems="listOfSelectedItems" v-if="data" />
			</div>
			<div class="multiSelTree mxhp-156 mt-3 scrollBar" v-if="listOfSelectedItems.length > 0">
				<div class="statements d-flex align-items-center" v-for="(item, index) in listOfSelectedItems" :key="index">
					<div class="col" :title="nodeNamePath(sideTree.getAllData().find((y) => y.item.orgID.id === item.orgID.id))">{{ item.name }}</div>
					<div class="col-auto"><span class="icons icon-delete plainIcn" :title="getTranslation('I00.00039230', 'Delete')" @click="removeItem(item)"></span></div>
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
import TreeMultiple from './TreeMultiple_v3';
import { defineState, nodeNamePath } from '../../libraries/tree_v3';
import ButtonOk from "../common/button/button/ButtonOk_v3";
import ButtonCancel from "../common/button/button/ButtonCancel_v3";
export default {
  components: {
    TreeMultiple,
    ButtonOk,
    ButtonCancel
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
    removeItem(item) {
      this.$emit('removeItem', item);
    },
    sendList() {
      this.$emit('input', this.selectedItem);
    },
    nodeNamePath: nodeNamePath
  }
}
</script>