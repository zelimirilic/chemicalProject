<template>
	<div class="subtitle d-flex flex-row justify-content-between align-items-center">
		<h6 v-if="text">{{ text }}</h6>
		<slot></slot>
	</div>
</template>

<script>
import Subtitle from './Subtitle';

export default {
  extends: Subtitle,
  name: 'Subtitle'
}
</script>