<template>
	<div :class="`alert alert-${type} fade`" @mousemove="$emit('mousemove')" @mouseenter="$emit('moseenter')" @mouseleave="$emit('mouseleave')">
		<div>{{ text }}</div>
		<button type="button" class="close" @click="$emit('close')"><span>&times;</span></button>
	</div>
</template>

<script>
export default {
  props: ['text', 'type'],
}
</script>