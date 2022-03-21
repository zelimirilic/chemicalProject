<template>
	<ButtonIcon iconClass="icon-save" @click="$emit('click', $event)" :title="title || getTranslation('I00.00004810', 'Save')" :withBorder="withBorder" />
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