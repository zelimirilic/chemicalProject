<template>
	<div>
		<label class="form-control-label" v-if="text != null">
			{{ text }}
			<sup class="icons astera" v-if="propToBool(required)"></sup>
		</label>
		<div class="form-inline">
			<Number :class="{ notValid: !isValid }" :value="value.value" class="wp-80" @input="onInput({ ...value, value: $event })" />
			<Select class="wp-80 ml-2" :class="{ notValid: !isValid }" :items="units" :value="value.unit" prop="shortName" @input="onInput({ ...value, unit: $event })" compareByHash />
		</div>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
	</div>
</template>

<script>
import ConsumptionGroup from './ConsumptionGroup';
import Number from '../input/Number_v3';
import Select from '../../../common/form/select/Select_v3';

export default {
  extends: ConsumptionGroup,
  name: 'ConsumptionGroup',
  components: {
    Select,
    Number
  }
}
</script>