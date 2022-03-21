<template>
	<span class="btn" @click="$emit('click', $event)" :title="title">
		<slot>{{ title }}</slot>
	</span>
</template>

<script>
export default {
  props: ['title'],
}
</script>