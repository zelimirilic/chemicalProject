<template>
	<input class="form-control" :class="{ notValid: !isValid }" :placeholder="placeholder" :value="localValue" @input="emit('input', $event)" @blur="emit('blur', $event)" />
</template>
<script>
import { propToBool, setAllValidationParents, removeAllValidationParents } from '../../../../libraries/vue';
import { checkIsValid, validators } from '../../../../libraries/forms';
import { isNullOrEmpty } from '../../../../libraries/common';

var getLocalLanguageDisplayValue = (value, replaceChar) => (value || '')
  .toLocaleString(navigator.language, { minimumFractionDigits: ((value || '').toString().split('.').tail().last() || '').length })
  .replaceAll(replaceChar, '')
  .substring(0, 18);

export default {
  props: ['value', 'placeholder', 'required', 'validations'],
  data(self) {
    var decimalChar = 0.1.toLocaleString().replace(/\d/g, '');
    var replaceChar = decimalChar == '.' ? ',' : '.';
    return {
      isValid: true,
      propToBool: propToBool,
      errorMessage: null,
      replaceChar,
      decimalChar,
      localValue: getLocalLanguageDisplayValue(self.value || '', replaceChar),
    };
  },
  methods: {
    toNumber(value) {
      var val = value.toString().replace(',', '.');
      if (isNullOrEmpty(val)) return val;
      var num = Number(val);
      return isNaN(num) ? val : num;
    },
    emit(prop, event) {
      var val = this.toNumber(event.target.value);
      this.localValue = event.target.value.replaceAll(this.replaceChar, this.decimalChar);
      this.$emit(prop, val);
      this.$nextTick(() => this.checkIsValid());
    },
    checkIsValid: checkIsValid,
  },
  computed: {
    defaultValidations() {
      return [validators.isNumber];
    }
  },
  mounted() {
    setAllValidationParents(this);
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  },
}
</script>