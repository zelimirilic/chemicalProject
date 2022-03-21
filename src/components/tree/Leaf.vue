<template>
	<li :class="{ [liClass]: true, 'eqtree-last': isLast }">
		<i class="eqtree-icon eqtree-ocl" :class="{ rootName: isRoot, noChild: !hasChildren }" @click="emitOpen"></i>
		<component :is="component" :class="{ treeClicked: stateItem.clicked, treeMoving: stateItem.moving }" :item="item.item" :isRoot="isRoot" :listOfSelectedItems="listOfSelectedItems" :isEditing="isEditing" :placeholder="placeholder" :starred="stateItem.starred" @click="$emit('click', item)" @add="$emit('add', $event)" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" @cancel="$emit('cancel', $event)" @move="emitMove" @markAsRoot="emitMarkAsRoot" @resetRoot="emitResetRoot" @mouseEnter="$emit('mouseEnter', $event)" @mouseIn="$emit('mouseIn', $event)" @mouseLeave="$emit('mouseLeave', $event)" />
		<Leafs class="eqtree-container-ul" :items="item.children" :state="state" :component="component" :isEditing="isEditing" :listOfSelectedItems="listOfSelectedItems" :placeholder="placeholder" @open="$emit('open', $event)" @click="$emit('click', $event)" @add="$emit('add', $event)" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" @cancel="$emit('cancel', $event)" @move="emitMove" @markAsRoot="emitMarkAsRoot" @resetRoot="emitResetRoot" @mouseEnter="$emit('mouseEnter', $event)" @mouseIn="$emit('mouseIn', $event)" @mouseLeave="$emit('mouseLeave', $event)" v-if="isOpened" />
	</li>
</template>

<script>
import Leafs from './Leafs';
import SimpleLeaf from './SimpleLeaf';

export default {
  name: 'Leaf',
  props: ['item', 'isLast', 'isRoot', 'state', 'component', 'isEditing', 'placeholder', 'listOfSelectedItems'],
  components: {
    Leafs,
    SimpleLeaf
  },
  methods: {
    emitOpen() {
      if (this.hasChildren)
        this.$emit('open', { item: this.item, open: !this.isOpened });
    },
    emitMove(item, el, event) {
      this.$emit('move', item, el, event);
    },
    emitMarkAsRoot(item, el, event) {
      this.$emit('markAsRoot', item, el, event);
    },
    emitResetRoot(item, el, event) {
      this.$emit('resetRoot', item, el, event);
    }
  },
  computed: {
    liClass() {
      var openCloseClass = this.hasChildren ? (this.isOpened ? "eqtree-open" : "eqtree-closed") : "eqtree-leaf";
      return "eqtree-node " + openCloseClass + (this.isLast ? " eqtree-last" : "");
    },
    hasChildren() {
      return this.item.children && this.item.children.length;
    },
    isOpened() {
      return this.hasChildren && this.stateItem.opened;
    },
    stateItem() {
      return this.state[this.item.item.id] ? this.state[this.item.item.id] : {};
    }
  }
}
</script>