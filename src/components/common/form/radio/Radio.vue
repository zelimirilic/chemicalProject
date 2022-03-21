<template>
	<div class="custom-check radio" withReadOnlyMode>
		<input type="radio" class="custom-input" :class="{ notValid: !isValid }" :checked="value" @change="onChange" />
		<label class="custom-label" :class="{ notValid: !isValid }" @click="value ? null : onChange(!value)">
			<slot>{{ text }}</slot>
		</label>
	</div>
</template>
<script>

import { checkIsValid } from '../../../../libraries/forms';
import { setAllValidationParents, removeAllValidationParents } from '../../../../libraries/vue';
export default {
  props: ['value', 'text', 'validations'],
  data() {
    return {
      isValid: true,
      errorMessage: null,
    };
  },
  methods: {
    onChange() {
      this.$emit('input', !this.value);
      this.$nextTick(() => this.checkIsValid());
    },
    checkIsValid: checkIsValid,
  },
  watch: {
    value() {
      this.$el.checked = this.value;
    }
  },
  mounted() {
    if (this.validations) {
      setAllValidationParents(this);
    }
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  },
};
</script>