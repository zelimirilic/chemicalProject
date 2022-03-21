<template>
	<div class="cursor" @mousemove="isHovering = true" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
		<slot v-if="isHovering"></slot>
		<slot name="hover" v-else></slot>
	</div>
</template>

<script>
export default {
  data() {
    return {
      isHovering: false
    };
  }
}
</script>