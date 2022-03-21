<template>
	<div class="form-group mb-0">
		<label class="form-control-label" v-if="text">
			{{ text }}
			<sup class="astera" v-if="propToBool(required)">*</sup>
		</label>
		<div class="dropdownGroup input-group flex-nowrap">
			<SearchDropdown :value="value" :placeholder="placeholder" @input="onInput" @keyup="$emit('keyup', $event)" :prop="prop" :items="items"></SearchDropdown>
			<slot></slot>
		</div>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
	</div>
</template>
<script>
import { propToBool, setAllValidationParents, removeAllValidationParents } from '../../../../libraries/vue';
import { checkIsValid } from '../../../../libraries/forms';
export default {
  props: ['value', 'text', 'items', 'prop', 'placeholder', 'required', 'validations'],
  data() {
    return {
      isValid: true,
      propToBool,
      errorMessage: null,
    };
  },
  methods: {
    onInput(event) {
      this.$emit('input', event);
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