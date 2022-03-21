<template>
	<div class="eqtree-default">
		<ul class="eqtree-container-ul">
			<Leaf :item="data" :isRoot="true" :isLast="true" :isOpened="true" :state="state" :component="component" :listOfSelectedItems="listOfSelectedItems" @open="treeStateOpen" @click="treeStateClick" />
		</ul>
	</div>
</template>
<script>
import Leaf from './Leaf_v3';
import SimpleLeafMultiple from './SimpleLeafMultiple_v3.vue';
import { defineState } from '../../libraries/tree_v3';
export default {
  props: ['data', 'state', 'listOfSelectedItems'],
  components: {
    Leaf,
  },
  data() {
    return {
      component: SimpleLeafMultiple,
    }
  },
  methods: {
    treeStateOpen({ item, open }) {
      item.getParents().forEach(f => defineState(this.state, f.item, 'opened', true));
      defineState(this.state, item.item, 'opened', open);
      this.$emit('open', { item, open });
    },
    treeStateClick(item) {
      Object.keys(this.state).forEach(key => delete this.state[key]);
      [item, ...item.getParents()].forEach(f => defineState(this.state, f.item, 'opened', true));
      defineState(this.state, item.item, 'clicked', true);
      this.$emit('click', item);
    },
    selectedNode() {
      if (!this.data) return null;

      for (var key in this.state.sideTreeState) {
        if (this.state[key].clicked) {
          return this.data.find(f => f.item.id == key);
        }
      }
    },
  }
}
</script>