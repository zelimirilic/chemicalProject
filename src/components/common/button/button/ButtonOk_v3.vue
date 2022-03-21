<template>
	<Button @click="$emit('click', $event)" :title="title || getTranslation('I00.00004370', 'Ok')">
		{{ getTranslation('I00.00004370', 'Ok') }}
	</Button>
</template>

<script>
import ButtonOk from './ButtonOk';
import Button from "./Button_v3";

export default {
  extends: ButtonOk,
  name: 'ButtonOk',
  components: {
    Button
  }
}
</script>