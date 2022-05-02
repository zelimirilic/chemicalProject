<template>
	<div :class="`d-flex align-items-center alerts alert alert-${type}`">
		<div>{{ text }}</div>
		<button type="button" class="close ml-auto" @click="$emit('close')"><span>&times;</span></button>
	</div>
</template>

<script>
export default {
	props: ['text', 'type'],
};
</script>
