<template>
	<div class="row" :class="noPaddingClass">
		<div class="col-12" :class="noPaddingClass">
			<div class="mainTtl d-flex flex-row justify-content-between align-items-center">
				<h5>{{ text }}</h5>
				<slot name="extended"></slot>
			</div>
			<slot></slot>
		</div>
	</div>
</template>

<script>
import { propToBool } from '../../../libraries/vue';
export default {
  props: ['text', 'noPadding'],
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