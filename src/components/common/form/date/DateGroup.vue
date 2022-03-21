<template>
	<div :class="{ 'form-inline': !blockDate, 'form-group mb-0': blockDate }">
		<label class="d-block pr-2" v-if="text != null">
			{{ text }}
			<sup class="astera" v-if="propToBool(required)">*</sup>
		</label>
		<Date :class="{ notValid: !isValid }" :value="value" :minDate="minDate" :maxDate="maxDate" :changeMonth="changeMonth" :changeYear="changeYear" @input="setData($event)" />
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
	</div>
</template>

<script>
import { propToBool, setAllValidationParents, removeAllValidationParents } from '../../../../libraries/vue';
import { checkIsValid } from '../../../../libraries/forms';
export default {
  props: ['value', 'text', 'required', 'minDate', 'maxDate', 'changeMonth', 'changeYear', 'validations', 'blockDate'],
  data() {
    return {
      isValid: true,
      errorMessage: null,
      propToBool
    };
  },
  methods: {
    setData(value) {
      this.$emit('input', value);
      this.$nextTick(() => this.checkIsValid());
    },
    checkIsValid: checkIsValid,
  },
  mounted: function () {
    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }
  },
  beforeDestroy: function () {
    removeAllValidationParents(this);
  },
};
</script>