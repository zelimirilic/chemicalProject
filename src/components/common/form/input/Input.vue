<template>
	<input class="form-control" :class="{ notValid: !isValid }" :value="value" :placeholder="placeholder" @input="onInput" @keyup="$emit('keyup', $event)" @keydown="$emit('keydown', $event)" @change="$emit('change', $event)" @blur="onBlur" @click="$emit('click', $event)" />
</template>
<script>
import { checkIsValid } from '../../../../libraries/forms';
import { setAllValidationParents, removeAllValidationParents, propToBool } from '../../../../libraries/vue';

export default {
  props: ['value', 'required', 'validations', 'placeholder', 'focus', 'noInputValidation'],
  data() {
    return {
      isValid: true,
    };
  },
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value);
      if (!propToBool(this.noInputValidation))
        this.$nextTick(() => this.checkIsValid());
    },
    onBlur(event) {
      this.$emit('blur', event.target.value);
      if (!propToBool(this.noInputValidation))
        this.$nextTick(() => this.checkIsValid());
    },
    checkIsValid: checkIsValid,
  },
  mounted() {
    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }

    if (propToBool(this.focus)) {
      this.$nextTick(() => this.$el.focus());
    }
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  },
}
</script>