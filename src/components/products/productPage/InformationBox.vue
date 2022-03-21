<template>
	<SmallLoader v-if="loader" />
	<div class="card mt-4" :class="{ flipIn: showAnimation }" v-else>
		<div class="mainTtl d-flex align-items-center" v-if="title || !propToBool(noEdit)">
			<h5>{{ title }}</h5>
			<div class="actionBtn ml-auto" v-if="!propToBool(noEdit)"><span :class="`icons ${editIcon || 'icon-edit'}`" v-tooltip="tooltipTtl" @click="emitEdit"></span></div>
		</div>
		<div class="row" :class="additionalClass" v-if="!noRow">
			<slot></slot>
		</div>
		<slot v-else></slot>
	</div>
</template>

<script>
import { propToBool } from '../../../libraries/vue';
export default {
  props: ['title', 'loader', 'noEdit', 'editIcon', 'additionalClass', 'noRow', 'tooltipTtl'],
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
 