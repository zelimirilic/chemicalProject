<template>
	<div class="form-inline">
		<label class="d-block pr-2" v-if="text != null">
			{{ text }}
			<sup class="icons astera" v-if="propToBool(required)"></sup>
		</label>
		<Date :class="{ notValid: !isValid }" :value="value" :minDate="minDate" :maxDate="maxDate" :changeMonth="changeMonth" :changeYear="changeYear" @input="setData($event)" />
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
	</div>
</template>

<script>
import DateGroup from './DateGroup';
import Date from './Date_v3';

export default {
  extends: DateGroup,
  name: 'DateGroup',
  components: {
    Date
  }
}
</script>