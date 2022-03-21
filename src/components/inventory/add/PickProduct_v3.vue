<template>
	<div class="row">
		<div class="col mw-65 mb-4" v-if="withProductType">
			<SmallLoader v-if="!productTypes" />
			<template v-else>
				<ProductTypePicker :title="getTranslation('I00.00012550', 'ProductType')" v-model="selectedType" :removedItems="value.productTypes.notDeleted().map((f) => f.id)" @add="addType" />
				<div v-if="productTypes" class="mt-3 p-3 lightGrayBg rounded borderTRBL">
					<Badge class="m-1" @delete="$set(item, 'deleted', true)" :title="getTranslation('I00.00027390', 'Remove')" v-for="(item, ind) in value.productTypes.notDeleted()" :key="ind">
						{{ getTranslation(findTypeName(item), 'Product type') }}
					</Badge>
				</div>
			</template>
		</div>
		<div class="col-auto mb-4">
			<div class="form-inline">
				<DateGroup class="align-items-center" :text="getTranslation('I00.00017670', 'InventoryDateText') + ':'" v-model="value.startDate" :maxDate="parseDate(new Date())" @input="emitProductChanged" />
			</div>
		</div>
		<div class="col-auto mb-4" v-if="withConsumption">
			<div class="form-inline">
				<CheckBoxGroup class="mr-2" v-model="value.usage.isSet" :validations="isSetValidators" @input="emitProductChanged">{{ getTranslation('I00.00003420', 'ConsumptionLabelText') }}</CheckBoxGroup>
				<div class="form-inline mr-5">
					<Number v-model="value.usage.value" class="form-control wp-90" @input="emitProductChanged" />
					<Select :items="allUnits" v-model="value.usage.unit" prop="shortName" @input="emitProductChanged"></Select>
				</div>
				<CheckBoxGroup class="mr-2" v-model="value.storage.isSet" :validations="isSetValidators" @input="emitProductChanged">{{ getTranslation('I00.00004090', 'StockLabelText') }}</CheckBoxGroup>
				<div class="form-inline">
					<Number v-model="value.storage.value" class="form-control wp-90" @input="emitProductChanged" />
					<Select :items="allUnits" v-model="value.storage.unit" prop="shortName" @input="emitProductChanged"></Select>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import PickProduct from './PickProduct';
import CheckBoxGroup from '../../common/form/checkBox/CheckBoxGroup_v3';
import Number from '../../common/form/input/Number_v3';

import SmallLoader from '../../common/loaders/SmallLoader_v3';
import ProductTypePicker from '../../common/form/picker/ProductTypePicker_v3';
import Badge from '../../common/badge/Badge_v3';
import DateGroup from '../../common/form/date/DateGroup_v3';
import Select from '../../common/form/select/Select_v3';


export default {
  extends: PickProduct,
  name: 'PickProduct',
  components: {
    CheckBoxGroup,
    Number,
    SmallLoader,
    ProductTypePicker,
    Badge,
    DateGroup,
    Select
  }
}
</script>