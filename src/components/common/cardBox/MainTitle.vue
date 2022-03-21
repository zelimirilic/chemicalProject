<template>
	<div @mousemove="$emit('mouseMove', $event)">
		<div class="mainTtl d-flex flex-row justify-content-between align-items-center">
			<h5 v-if="text">{{ text }}</h5>
			<div class="d-flex align-items-center actionLink">
				<slot name="linkSlot"></slot>
			</div>
		</div>
		<slot></slot>
	</div>
</template>

<script>
export default {
  props: ['text'],
};
</script>