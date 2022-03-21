<template>
	<ButtonIcon iconClass="icon-delete" @click="$emit('click', $event)" :title="title || getTranslation('I00.00027390', 'Remove')" :withBorder="withBorder" />
</template>

<script>
import ButtonIconRemove from './ButtonIconRemove';
import ButtonIcon from "./ButtonIcon_v3";

export default {
  extends: ButtonIconRemove,
  name: 'ButtonIconRemove',
  components: {
    ButtonIcon
  }
}
</script>