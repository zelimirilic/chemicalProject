<template>
	<div class="form-group mb-0">
		<label class="form-control-label" v-if="text != null">
			{{ text }}
			<sup class="astera" v-if="propToBool(required)">*</sup>
			<slot name="tooltip"></slot>
			<span class="tooltipInfo icons icon-info plainIcn ml-1" v-if="tooltipTxt" v-tooltip="tooltipTxt"></span>
		</label>
		<div class="input-group" :class="{ notValid: !isValid, specialType: specialType === true }">
			<Input :type="type" :class="{ notValid: !isValid }" :disabled="disabled" :placeholder="placeholder" :value="value" @input="onInput" @keyup="$emit('keyup', $event)" @blur="onBlur" />
			<slot></slot>
		</div>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
	</div>
</template>
<script>
import { propToBool, setAllValidationParents, removeAllValidationParents } from '../../../../libraries/vue';
import { checkIsValid } from '../../../../libraries/forms';
export default {
  props: ['value', 'text', 'type', 'placeholder', 'required', 'validations', 'disabled', 'specialType', 'tooltipTxt'],
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