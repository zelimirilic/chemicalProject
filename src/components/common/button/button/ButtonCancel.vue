<template>
	<Button @click="$emit('click', $event)" :title="title || getTranslation('I00.00017780', 'Cancel')">
		{{ getTranslation('I00.00017780', 'Cancel') }}
	</Button>
</template>

<script>
import Button from './Button';
export default {
  components: {
    Button
  },
  props: ['title'],
}
</script>