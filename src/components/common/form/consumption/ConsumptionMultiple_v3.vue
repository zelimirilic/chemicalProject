<template>
	<div>
		<div class="form-inline">
			<Number :class="{ notValid: !isValid }" v-model="value.value" class="wp-80" @input="onInput({ ...value, value: $event, orgID: orgId })" v-if="forceRerender" />
			<Select class="wp-80 ml-2" :class="{ notValid: !isValid }" :items="units" :value="getUnit(value.unit)" prop="shortName" @input="onInput({ ...value, unit: $event, orgID: orgId })" v-if="forceRerender" compareByHash />
		</div>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
	</div>
</template>

<script>
import axios from '../../../../axios';
import { errorDebug, isString } from '../../../../libraries/common';
import { validators } from '../../../../libraries/forms';
import { propToBool, removeAllValidationParents, setAllValidationParents } from '../../../../libraries/vue';
import Number from '../../../common/form/input/Number_v3';
import Select from '../../../common/form/select/Select_v3';
export default {
  props: ['required', 'validations', 'orgId', 'value', 'forceRerender'],
  components: {
    Number,
    Select
  },
  data() {
    return {
      isValid: true,
      propToBool: propToBool,
      errorMessage: null,
      units: []
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
    getUnit(unit) {
      return this.units.find(f => f.shortName === (unit !== null && unit !== undefined ? unit.shortName : "")) || null;
    }
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