<template>
	<ButtonIcon iconClass="icon-plus" @click="$emit('click', $event)" :title="title || getTranslation('I00.00013100', 'Add')" :withBorder="withBorder" />
</template>

<script>
import ButtonIcon from './ButtonIcon';
export default {
  components: {
    ButtonIcon
  },
  props: ['title', 'additionalIcnClass', 'withBorder'],
}
</script>