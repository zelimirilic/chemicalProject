<template>
	<div class="col-xl-6 col-12">
		<h5 class="blueTtl" v-if="text">{{ text }}</h5>
		<slot></slot>
	</div>
</template>

<script>
import HalfBox from './HalfBox';

export default {
  extends: HalfBox,
  name: 'HalfBox'
}
</script>