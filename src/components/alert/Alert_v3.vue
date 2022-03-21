<template>
	<div :class="`alerts alert alert-${type}`">
		{{ text }}
	</div>
</template>

<script>
export default {
  props: ['text', 'type'],
}
</script>