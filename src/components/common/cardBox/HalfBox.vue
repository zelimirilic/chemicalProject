<template>
	<div class="col-xl-6 col-12">
		<div class="mainTtl lightGrayBg" v-if="text">
			<h5>{{ text }}</h5>
		</div>
		<slot></slot>
	</div>
</template>

<script>
export default {
  props: ['text'],
};
</script>