<template>
	<Button @click="$emit('click', $event)" :title="title || getTranslation('I00.00004880', 'Close')">
		{{ getTranslation('I00.00004880', 'Close') }}
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