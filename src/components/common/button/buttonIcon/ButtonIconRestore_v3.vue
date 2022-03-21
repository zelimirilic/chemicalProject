<template>
	<ButtonIcon iconClass="icon-restore" @click="$emit('click', $event)" :title="title || getTranslation('I00.00026430', 'Restore')" :withBorder="withBorder" />
</template>

<script>
import ButtonIconRestore from './ButtonIconRestore';
import ButtonIcon from "./ButtonIcon_v3";

export default {
  extends: ButtonIconRestore,
  name: 'ButtonIconRestore',
  components: {
    ButtonIcon
  }
}
</script>