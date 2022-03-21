<template>
	<SmallLoader v-if="loader" />
	<div :class="{ flipIn: showAnimation }" v-else>
		<div class="px-4 py-2 text-right" v-if="!propToBool(noEdit)"><span :class="`icons ${editIcon || 'icon-edit'}`" v-tooltip="tooltipTtl" @click="emitEdit"></span></div>
		<slot></slot>
	</div>
</template>

<script>
import { propToBool } from '../../../libraries/vue';
export default {
  props: ['title', 'loader', 'noEdit', 'editIcon', 'tooltipTtl'],
  data() {
    return {
      showAnimation: false,
    };
  },
  methods: {
    emitEdit() {
      this.showAnimation = true;
      this.$emit('edit');
    },
    propToBool: propToBool
  }
};
</script>