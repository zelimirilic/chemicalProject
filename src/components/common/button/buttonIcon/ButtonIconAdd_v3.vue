<template>
	<ButtonIcon iconClass="icon-plus" @click="$emit('click', $event)" :title="title || getTranslation('I00.00013100', 'Add')" :withBorder="withBorder" />
</template>

<script>
import ButtonIconAdd from './ButtonIconAdd';
import ButtonIcon from './ButtonIcon_v3';


export default {
  extends: ButtonIconAdd,
  name: 'ButtonIconAdd',
  components: {
    ButtonIcon
  },
}
</script>