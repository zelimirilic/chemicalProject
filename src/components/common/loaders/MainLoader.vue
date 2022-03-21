<template>
	<div class="mainLoader loader">
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
		</div>
	</div>
</template>

<script>
export default {
  mounted() {
    this.$store.state.mainLoaderVisible = true;
  },
  beforeDestroy() {
    this.$store.state.mainLoaderVisible = false;
  },
}
</script>