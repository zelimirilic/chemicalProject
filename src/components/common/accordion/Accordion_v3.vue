<template>
	<div class="accordionBox mainGrayBox">
		<AccordionHeader :text="text" :value="value" @input="$emit('input', $event)" />
		<template v-if="value">
			<div class="mainGrayBoxTbl slideInTop" :class="accordionClass"><slot></slot></div>
		</template>
	</div>
</template>

<script>
import AccordionHeader from './AccordionHeader_v3';

export default {
  components: {
    AccordionHeader
  },
  props: ['text', 'value', 'accordionClass'],
}
</script>