<template>
	<ButtonIcon iconClass="icon-restore" @click="$emit('click', $event)" :title="title || getTranslation('I00.00026430', 'Restore')" :withBorder="withBorder" />
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