<template>
	<div class="btnBadge">
		<div class="d-flex align-items-center">
			<span><slot></slot></span>
			<span class="badge ml-2" @click="$emit('delete')" v-if="showDelete"><span class="icons icon-delete"></span></span>
		</div>
	</div>
</template>

<script>
export default {
  computed: {
    showDelete() {
      return this.$listeners.delete;
    },
  }
}
</script>