<template>
	<div class="row">
		<div class="col-xl-6 col-4 mb-4" v-if="withProductType">
			<SmallLoader v-if="!productTypes" />
			<template v-else>
				<label class="form-control-label">{{ getTranslation('I00.00012550', 'ProductType') }}</label>
				<ProductTypePicker :title="getTranslation('I00.00012550', 'ProductType')" v-model="selectedType" :removedItems="value.productTypes.notDeleted().map(f => f.id)" @add="addType" />
				<template v-if="productTypes">
					<Badge class="mx-1 mt-2" @delete="$set(item, 'deleted', true)" :title="getTranslation('I00.00027390', 'Remove')" v-for="(item, ind) in value.productTypes.notDeleted()" :key="ind">
						{{ getTranslation(findTypeName(item), 'Product type') }}
					</Badge>
				</template>
			</template>
		</div>
		<div class="col-auto mb-4">
			<DateGroup class="smallDate" :text="getTranslation('I00.00017670', 'InventoryDateText') + ':'" v-model="minDate" :minDate="minDate" :maxDate="maxDate" @input="emitProductChanged" :blockDate="true" />
		</div>
		<div class="col-auto mb-4" v-if="withConsumption">
			<CheckBoxGroup class="mb-2" v-model="value.usage.isSet" :validations="isSetValidators" @input="emitProductChanged">{{ getTranslation('I00.00003420', 'ConsumptionLabelText') }}</CheckBoxGroup>
			<div class="form-inline">
				<Number v-model="value.usage.value" class="form-control wp-80 mr-2" @input="emitProductChanged" />
				<Select :items="allUnits" v-model="value.usage.unit" prop="shortName" @input="emitProductChanged"></Select>
			</div>
		</div>
		<div class="col-auto mb-4" v-if="withConsumption">
			<CheckBoxGroup class="mb-2" v-model="value.storage.isSet" :validations="isSetValidators" @input="emitProductChanged">{{ getTranslation('I00.00004090', 'StockLabelText') }}</CheckBoxGroup>
			<div class="form-inline">
				<Number v-model="value.storage.value" class="form-control wp-80 mr-2" @input="emitProductChanged" />
				<Select :items="allUnits" v-model="value.storage.unit" prop="shortName" @input="emitProductChanged"></Select>
			</div>
		</div>
	</div>
</template>

<script>
import ProductTypePicker from '../../common/form/picker/ProductTypePicker';
import Badge from '../../common/badge/Badge';
import { isNullOrEmpty, idsAreEqual } from '../../../libraries/common';
import { validators } from '../../../libraries/forms';
import { inventoryValidators } from '../../../libraries/inventory';
import { parseDate } from '../../../libraries/date';
import { getProductTypeTreeData } from '../../../libraries/tree';
export default {
	components: {
		ProductTypePicker,
		Badge
	},
	props: ['withConsumption', 'withProductType', 'value', 'units', 'isCustomerProduct', 'validations', 'minDate', 'maxDate'],
	data() {
		return {
			emptyUnit: { shortName: '-' },
			showVariantBox: false,
			selectedType: null,
			productTypes: null
		};
	},
	methods: {
		composeProductName(f) {
			return [f.ArtNo]
				.pushMany([f.ArtName, (f.Department || {}).Name])
				.filter(g => !isNullOrEmpty(g))
				.join(' - ');
		},
		emitProductChanged() {
			this.$emit('productChanged', this.value);
		},
		addType(event) {
			this.value.productTypes.push({ id: event });
			this.selectedType = null;
		},
		findTypeName(item) {
			var find = this.productTypes.find(f => idsAreEqual(f.item.orgID, item.id));
			return find ? find.item.name : null;
		},
		parseDate
	},
	computed: {
		allUnits() {
			return [this.emptyUnit].pushMany(this.units);
		},
		isSetValidators() {
			return [
				{
					fnc: inventoryValidators.isSet(this.value).fnc,
					message: () => null
				}
			];
		},
		isNumberValidators() {
			return [
				{
					fnc: validators.isNumber.fnc,
					message: () => null
				}
			];
		}
	},
	mounted() {
		getProductTypeTreeData().then(response => (this.productTypes = response));
	}
};
</script>
