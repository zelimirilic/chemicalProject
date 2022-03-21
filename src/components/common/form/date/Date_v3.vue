<template>
	<DatePicker class="dateInp mx-datepicker-inline" popupClass="dateBox" :editable="false" :class="{ notValid: !isValid }" :value="getDate" @input="setData" :placeholder="getTranslation('I00.00022620', 'Choose a date')" :disabledDate="disableDate" withReadOnlyMode />
</template>

<script>
import Date from './Date';

export default {
  extends: Date,
  name: 'Date'
}
</script>