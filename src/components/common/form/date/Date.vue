<template>
	<DatePicker class="dateInp mx-datepicker-inline" popupClass="dateBox" :editable="false" :class="{ notValid: !isValid }" :value="getDate" @input="setData" :placeholder="getTranslation('I00.00022620', 'Choose a date')" :disabledDate="disableDate" withReadOnlyMode />
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import moment from 'moment';
import { propToBool, setAllValidationParents, removeAllValidationParents, valueToFnc } from '../../../../libraries/vue';
import { checkIsValid } from '../../../../libraries/forms';
export default {
  components: {
    DatePicker,
  },
  props: ['value', 'required', 'minDate', 'maxDate', 'validations'],
  data() {
    return {
      isValid: true,
      isDatepickerSet: false,
      propToBool,
    };
  },
  methods: {
    setData(value) {
      this.$emit('input', value);
      this.$nextTick(() => this.checkIsValid());
    },
    disableDate(date) {
      return !((!this.minDate || date >= this.getMinDate) && (!this.maxDate || date <= this.getMaxDate));
    },
    checkIsValid: checkIsValid,
  },
  computed: {
    getDate() {
      return this.value ? moment(this.value, 'YYYY-MM-DD').toDate() : null;
    },
    getMinDate() {
      return this.minDate && moment(valueToFnc(this.minDate)(), 'YYYY-MM-DD').startOf('day');
    },
    getMaxDate() {
      return this.maxDate && moment(valueToFnc(this.maxDate)(), 'YYYY-MM-DD').endOf('day');
    }
  },
  mounted() {
    window['moment'] = moment;
    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  },
};
</script>