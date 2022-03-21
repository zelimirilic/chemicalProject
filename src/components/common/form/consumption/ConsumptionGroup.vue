<template>
	<div>
		<label class="form-control-label" v-if="text != null">
			{{ text }}
			<sup class="astera" v-if="propToBool(required)">*</sup>
		</label>
		<div class="form-inline">
			<Number :class="{ notValid: !isValid }" :value="value.value" class="wp-80" @input="onInput({ ...value, value: $event })" />
			<Select class="ml-2" :class="{ notValid: !isValid }" :items="units" :value="value.unit" prop="shortName" @input="onInput({ ...value, unit: $event })" compareByHash />
		</div>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
	</div>
</template>

<script>
import axios from '../../../../axios';
import { errorDebug, isString } from '../../../../libraries/common';
import { validators } from '../../../../libraries/forms';
import { propToBool, removeAllValidationParents, setAllValidationParents } from '../../../../libraries/vue';
export default {
  props: ['value', 'text', 'type', 'placeholder', 'required', 'validations'],
  data() {
    return {
      isValid: true,
      propToBool: propToBool,
      errorMessage: null,
      units: [],
    };
  },
  methods: {
    onInput(event) {
      this.$emit('input', event);
      this.$nextTick(() => this.checkIsValid());
    },
    checkIsValid() {
      this.isValid = true;
      this.errorMessage = null;

      if (propToBool(this.required) && (!validators.isRequired.fnc(this.value.value) || !validators.isRequired.fnc(this.value.unit))) {
        this.isValid = false;
        this.errorMessage = validators.isRequired.message();
        return this.isValid;
      }

      if (!validators.isNumber.fnc(this.value.value)) {
        this.isValid = false;
        this.errorMessage = validators.isNumber.message();
        return this.isValid;
      }

      var validations = this.validations;
      if (validations) {
        var find = validations.find(validation => !validation.fnc(this.value));
        if (find) {
          this.isValid = false;
          this.errorMessage = isString(find.message) ? find.message : find.message();
          return this.isValid;
        }
      }

      return this.isValid;
    },
  },
  mounted() {
    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }

    axios.get('/InventoryAdd/GetUnits')
      .then(response => this.units = response.data)
      .catch(errorDebug);
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  },
}
</script>