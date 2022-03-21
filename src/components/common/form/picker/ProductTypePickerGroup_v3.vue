<template>
	<div class="form-group mb-0" withReadOnlyMode>
		<label class="form-control-label" v-if="text != null">
			{{ text }}
			<sup class="icons astera" v-if="propToBool(required)"></sup>
		</label>
		<ProductTypePicker :class="{ notValid: !isValid }" v-model="currentValue" :removedItems="value" @add="addType" />
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
		<div v-if="value && value.length" class="mt-3 p-3 lightGrayBg rounded borderTRBL">
			<Badge class="m-1" @delete="removeType(item)" :title="getTranslation('I00.00027390', 'Remove')" v-for="(item, ind) in value" :key="ind">
				{{ getTranslation(findTypeName(item), 'Product type') }}
			</Badge>
		</div>
	</div>
</template>

<script>
import ProductTypePickerGroup from './ProductTypePickerGroup';
import ProductTypePicker from './ProductTypePicker_v3';
import Badge from '../../badge/Badge_v3';

export default {
  extends: ProductTypePickerGroup,
  name: 'ProductTypePickerGroup',
  components: {
    ProductTypePicker,
    Badge
  }
}
</script>