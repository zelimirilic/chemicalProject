<template>
	<div class="smallLoader loader">
		<div class="loaderInner">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>
</template>

<script>
import { propToBool } from '../../../libraries/vue';
export default {
  methods: {
    propToBool: propToBool
  },
  mounted() {
    this.$emit('mounted');
  }
}
</script>