<template>
	<div class="row" :class="noPaddingClass">
		<div class="col-12" :class="noPaddingClass">
			<div class="mainTtl d-flex" :class="additionalClass">
				<h5>{{ text }}</h5>
				<span class="ml-auto cursor" v-if="buttonText" @click="$emit('buttonClicked')">{{ buttonText }}</span>
			</div>
			<slot></slot>
		</div>
	</div>
</template>

<script>
import { propToBool } from '../../../libraries/vue';
export default {
  props: ['text', 'noPadding', 'additionalClass', 'buttonText'],
  methods: {
    propToBool
  },
  computed: {
    noPaddingClass() {
      return {
        noPadding: propToBool(this.noPadding)
      };
    }
  }
};
</script>