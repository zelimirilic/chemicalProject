<template>
	<div class="form-group mb-0">
		<label class="form-control-label pb-2" v-if="text != null">
			{{ text }}
			<sup class="icons astera" v-if="propToBool(required)"></sup>
		</label>
		<div class="input-group" :class="{ notValid: !isValid }">
			<Input :type="type" :placeholder="placeholder" :disabled="disabled" :value="value" @input="onInput" @keyup="$emit('keyup', $event)" @blur="onBlur" />
			<slot></slot>
		</div>
		<div>
			<label class="notValid Box mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
		</div>
	</div>
</template>
<script>
import { propToBool, setAllValidationParents, removeAllValidationParents } from '../../../../libraries/vue_v3';
import { checkIsValid } from '../../../../libraries/forms_v3';
import Input from './Input_v3';
export default {
  props: ['value', 'text', 'type', 'placeholder', 'required', 'validations', 'disabled'],
  components: {
    Input
  },
  data() {
    return {
      isValid: true,
      propToBool: propToBool,
      errorMessage: null,
    };
  },
  methods: {
    onInput(event) {
      this.$emit('input', event);
      this.$nextTick(() => this.checkIsValid());
    },
    onBlur(event) {
      this.$emit('blur', event);
      this.$nextTick(() => this.checkIsValid());
    },
    checkIsValid: checkIsValid,
  },
  mounted() {
    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  },
}
</script>