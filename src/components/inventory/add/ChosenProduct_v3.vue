<template>
	<div class="px-3 pt-4" :class="{ disabled: value == null }">
		<PickProduct :units="units" :value="value" :withConsumption="withConsumption" :withProductType="withProductType" :validations="validations && validations.map((f) => ({ ...f, message: () => null }))" @productChanged="$emit('productChanged', $event)" v-if="!propToBool(simplePick)" />
		<SimplePickProduct :validations="validations && validations.map((f) => ({ ...f, message: () => null }))" v-else />
	</div>
</template>

<script>
import ChosenProduct from './ChosenProduct';
import PickProduct from './PickProduct_v3';
import SimplePickProduct from './SimplePickProduct_v3';

export default {
  extends: ChosenProduct,
  name: 'ChosenProduct',
  components: {
    PickProduct,
    SimplePickProduct


  }
}
</script>