<template>
	<div class="mainGrayBoxTtl headerWrapper px-2">
		<h5 class="headerTitle d-flex align-items-center" @click="$emit('input', !value)">
			<span class="searchArrow" :class="{ arrowClose: !value }"></span>
			<span>{{ text }}</span>
		</h5>
	</div>
</template>

<script>

import AccordionHeader from './AccordionHeader';
export default {
  extends: AccordionHeader,
  name: 'AccordionHeader',
  props: ['text', 'value'],
}
</script>