<template>
	<div class="form-group">
		<label class="form-control-label" v-if="text != null">
			{{ text }}
			<sup class="astera" v-if="propToBool(required)">*</sup>
		</label>
		<Radio :class="{ notValid: !isValid }" v-for="(item, ind) in items" :value="item === value" :key="ind" @input="onInput(item)">
			<slot>{{ propFnc(item) }}</slot>
		</Radio>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
	</div>
</template>
<script>
import Radio from './Radio';
import { checkIsValid } from '../../../../libraries/forms';
import { setAllValidationParents, removeAllValidationParents, propToBool, propToFnc } from '../../../../libraries/vue';
export default {
  components: {
    Radio
  },
  props: ['value', 'items', 'text', 'prop', 'validations', 'required'],
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
  computed: {
    propFnc() {
      return propToFnc(this.prop);
    },
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