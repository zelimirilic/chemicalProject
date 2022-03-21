<template>
	<div class="mainTtl subTtl d-flex flex-row justify-content-between align-items-center">
		<h6 v-if="text">{{ text }}</h6>
		<slot></slot>
	</div>
</template>

<script>
export default {
  props: ['text'],
};
</script>