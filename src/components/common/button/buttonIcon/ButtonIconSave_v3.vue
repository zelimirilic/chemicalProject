<template>
	<ButtonIcon iconClass="icon-save" @click="$emit('click', $event)" :title="title || getTranslation('I00.00004810', 'Save')" :withBorder="withBorder" />
</template>

<script>
import ButtonIconSave from './ButtonIconSave';
import ButtonIcon from "./ButtonIcon_v3";

export default {
  extends: ButtonIconSave,
  name: 'ButtonIconSave',
  components: {
    ButtonIcon
  }
}
</script>