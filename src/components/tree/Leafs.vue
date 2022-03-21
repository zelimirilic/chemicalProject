<template>
	<ul class="eqtree-children">
		<Leaf v-for="(child, ind) in items" :key="child.id" :item="child" :state="state" :isLast="ind === items.length - 1" :listOfSelectedItems="listOfSelectedItems" :component="component" :isEditing="isEditing" :placeholder="placeholder" @open="$emit('open', $event)" @click="$emit('click', $event)" @add="$emit('add', $event)" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" @cancel="$emit('cancel', $event)" @move="emitMove" @markAsRoot="emitMarkAsRoot" @resetRoot="emitResetRoot" @mouseEnter="$emit('mouseEnter', $event)" @mouseLeave="$emit('mouseLeave', $event)" @mouseIn="$emit('mouseIn', $event)" />
	</ul>
</template>

<script>
export default {
  props: ['items', 'state', 'component', 'isEditing', 'placeholder', 'listOfSelectedItems'],
  beforeCreate() {
    this.$options.components.Leaf = require('./Leaf.vue').default
  },
  methods: {
    emitMove(item, el, event) {
      this.$emit('move', item, el, event);
    },
    emitMarkAsRoot(item, el, event) {
      this.$emit('markAsRoot', item, el, event);
    },
    emitResetRoot(item, el, event) {
      this.$emit('resetRoot', item, el, event);
    }
  }
}
</script>