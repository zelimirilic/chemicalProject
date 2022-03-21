<template>
	<ButtonIcon iconClass="icon-delete" @click="$emit('click', $event)" :title="title || getTranslation('I00.00027390', 'Remove')" :withBorder="withBorder" />
</template>

<script>
import ButtonIcon from './ButtonIcon';
export default {
  components: {
    ButtonIcon
  },
  props: ['title', 'withBorder'],
}
</script>