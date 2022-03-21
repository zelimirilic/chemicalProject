<template>
	<Button @click="$emit('click', $event)" :title="title || getTranslation('I00.00017780', 'Cancel')">
		{{ getTranslation('I00.00017780', 'Cancel') }}
	</Button>
</template>

<script>
import ButtonCancel from './ButtonCancel';
import Button from "./Button_v3";

export default {
  extends: ButtonCancel,
  name: 'ButtonCancel',
  components: {
    Button
  }
}
</script>