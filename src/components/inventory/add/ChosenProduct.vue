<template>
	<div class="px-3 pt-4" :class="{ disabled: value == null }">
		<PickProduct :minDate="minDate" :maxDate="maxDate" :units="units" :value="value" :withConsumption="withConsumption" :withProductType="withProductType" :validations="validations && validations.map((f) => ({ ...f, message: () => null }))" @productChanged="$emit('productChanged', $event)" v-if="!propToBool(simplePick)" />
		<SimplePickProduct :validations="validations && validations.map((f) => ({ ...f, message: () => null }))" v-else />
	</div>
</template>

<script>
import { propToBool } from '../../../libraries/vue';
import PickProduct from './PickProduct';
import SimplePickProduct from './SimplePickProduct';

export default {
  components: {
    PickProduct,
    SimplePickProduct,
  },
  props: ['value', 'units', 'withConsumption', 'withProductType', 'simplePick', 'validations', 'minDate', 'maxDate'],
  methods: {
    propToBool,
  }
}
</script>