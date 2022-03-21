<template>
	<input type="checkbox" class="custom-input" :class="{ notValid: !isValid }" :checked="value" @change="onChange" />
</template>
<script>

import { checkIsValid } from '../../../../libraries/forms';
import { setAllValidationParents, removeAllValidationParents } from '../../../../libraries/vue';
export default {
  props: ['value', 'validations'],
  data() {
    return {
      isValid: true,
      errorMessage: null,
    };
  },
  methods: {
    onChange() {
      this.$emit('input', !this.value);
      this.$nextTick(() => {
        this.$el.checked = this.value;
        this.checkIsValid();
      });
    },
    checkIsValid: checkIsValid,
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