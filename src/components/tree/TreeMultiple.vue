<template>
	<div class="eqtree-default">
		<ul class="eqtree-container-ul">
			<Leaf :item="data" :isRoot="true" :isLast="true" :isOpened="true" :state="state" :component="component" :listOfSelectedItems="listOfSelectedItems" @open="treeStateOpen" @click="treeStateClick" />
		</ul>
	</div>
</template>

<script>
import Leaf from './Leaf';
import SimpleLeafMultiple from './SimpleLeafMultiple';
import { defineState } from '../../libraries/tree';
import { errorDebug } from '../../libraries/common';
export default {
  props: ['data', 'state', 'listOfSelectedItems'],
  components: {
    Leaf,
  },
  data() {
    return {
      component: SimpleLeafMultiple
    }
  },
  methods: {
    treeStateOpen({ item, open }) {
      item.getParents().forEach(f => defineState(this.state, f.item, 'opened', true));
      defineState(this.state, item.item, 'opened', open);
      this.$emit('open', { item, open });
    },
    treeStateClick(item) {
      if (!this.$store.getters.state.modalTreeFlag) {
        if (this.$store.getters.state.saveStatus) {
          this.confirm(this.getTranslation('I00.00053950', 'Unsaved data'), this.getTranslation('I00.00053960', 'You have unsaved data. Are you sure you want to proceed?'))
            .then(() => {
              this.$store.state.filledSubSearches = [];
              this.$store.getters.state.saveStatus = false;
              if (this.$route.fullPath.includes('department?id')) {
                this.$store.state.avoidRouteLeave = true;
                this.$router.replace({ name: this.$route.name, params: { ...this.$route.params } });
              }
              this.next(item)
            })
            .catch(errorDebug);
        } else {
          this.$store.state.filledSubSearches = [];
          if (this.$route.fullPath.includes('department?id')) {
            this.$router.replace({ name: this.$route.name, params: { ...this.$route.params } });
          }
          this.next(item)
        }
      } else {
        this.next(item)
      }

    },
    next(item) {
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