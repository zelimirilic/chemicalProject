<template>
	<input class="form-control" :class="{ notValid: !isValid }" :placeholder="placeholder" :value="localValue" @input="emit('input', $event)" @blur="emit('blur', $event)" />
</template>
<script>
import Number from './Number';

export default {
  extends: Number,
  name: 'Number'
}
</script>

