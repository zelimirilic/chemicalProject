<template>
	<input class="form-control" :class="{ required: !isValid }" :value="value" :placeholder="placeholder" @input="onInput" @keyup="$emit('keyup', $event)" @keydown="$emit('keydown', $event)" @change="$emit('change', $event)" @blur="onBlur" />
</template>

<script>
import Input from './Input';

export default {
  extends: Input,
  name: 'Input',
}
</script>