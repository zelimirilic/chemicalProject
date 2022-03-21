<template>
	<div class="accordionBox">
		<AccordionHeader :text="text" :value="value" @input="$emit('input', $event)" />
		<template v-if="value">
			<div class="slideInTop" :class="accordionClass"><slot></slot></div>
		</template>
	</div>
</template>

<script>
import AccordionHeader from './AccordionHeader';

export default {
  components: {
    AccordionHeader
  },
  props: ['text', 'value', 'accordionClass'],
}
</script>