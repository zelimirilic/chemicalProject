<template>
	<div class="form-group">
		<label class="form-control-label" v-if="text">
			{{ text }}
			<sup class="astera" v-if="propToBool(required)">*</sup>
		</label>
		<div class="input-group" :class="{ specialType: specialType === true }">
			<Select :class="{ notValid: !isValid }" :items="items" :value="value" @input="onInput" @click="$emit('click', $event)" :prop="prop" :disabledItems="disabledItems" :compareByHash="compareByHash" :alwaysOn="alwaysOn" />
			<slot></slot>
		</div>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
	</div>
</template>

<script>
import { propToBool, setAllValidationParents, removeAllValidationParents } from '../../../../libraries/vue';
import { checkIsValid } from '../../../../libraries/forms';

export default {
  props: ['value', 'items', 'prop', 'text', 'disabledItems', 'required', 'validations', 'compareByHash', 'alwaysOn', 'specialType'],
  data() {
    return {
      isValid: true,
      errorMessage: null,
    };
  },
  methods: {
    onInput(event) {
      this.$emit('input', event);
      this.$nextTick(() => this.checkIsValid());
    },
    propToBool: propToBool,
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