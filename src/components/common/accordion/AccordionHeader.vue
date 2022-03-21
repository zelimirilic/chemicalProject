<template>
	<header class="header d-flex justify-content-between align-items-center borderB cursor" @click="$emit('input', !value)">
		<span>{{ text }}</span>
		<span class="icons plainIcn icon-arrowup smallIcn" :class="{ arrowDown: !value }"></span>
	</header>
</template>

<script>
export default {
  props: ['text', 'value'],
}
</script>