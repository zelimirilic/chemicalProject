<template>
	<div class="btnLight">
		<div class="d-flex align-items-center">
			<span><slot></slot></span>
			<span class="badge ml-2" @click="$emit('delete')" v-if="showDelete"><span class="icons icon-delete"></span></span>
		</div>
	</div>
</template>

<script>
import Badge from './Badge';

export default {
  extends: Badge,
  name: 'Badge',
}
</script>