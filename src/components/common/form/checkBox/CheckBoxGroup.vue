<template>
	<div :class="{ subGroupInner: subGroup }">
		<div class="custom-check" withReadOnlyMode>
			<CheckBox :class="{ notValid: !isValid }" :value="value" @input="onInput" />
			<label class="custom-label" @click="onInput(!value)">
				<slot>{{ text }}</slot>
				<sup class="astera" v-if="propToBool(required)">*</sup>
			</label>
			<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
		</div>
	</div>
</template>
<script>

import { checkIsValid } from '../../../../libraries/forms';
import { setAllValidationParents, removeAllValidationParents, propToBool } from '../../../../libraries/vue';
export default {
  props: ['value', 'text', 'required', 'validations', 'subGroup'],
  data() {
    return {
      isValid: true,
      errorMessage: null,
      propToBool: propToBool,
    };
  },
  methods: {
    onInput(value) {
      this.$emit('input', value);
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
};
</script>