<template>
	<Button @click="$emit('click', $event)" :title="title || getTranslation('I00.00004370', 'Ok')">
		{{ getTranslation('I00.00004370', 'Ok') }}
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