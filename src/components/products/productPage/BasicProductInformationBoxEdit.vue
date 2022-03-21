<template>
	<InformationBoxEdit additionalClass="p-4" :title="getTranslation('I00.00003930', 'Product information')" @cancel="$emit('cancel')" @save="$emit('input', product)" :isChanged="isChanged" :isModelValid="isModelValid" :loader="loader">
		<div class="col-12 mb-4" v-if="isLocalID(product.id)">
			<label class="form-control-label">{{ getTranslation('I00.00055740', 'General') }}</label>
			<CheckBoxGroup v-model="product.productIsSubstance">{{ getTranslation('I00.00054990', 'Product is a substance') }}</CheckBoxGroup>
		</div>
		<div class="col-6">
			<InputGroup :specialType="!isLocalID(product.id) && product.name != null && product.name != (productFromRoot || {}).name ? true : false" v-if="!appSettings.disableTradeNameAndArtNoEdit" :text="getTranslation('I00.00003590', 'ProductName')" :value="product.name != null ? product.name : (productFromRoot || {}).name" @input="product.name = $event" required>
				<template v-if="!isLocalID(product.id) && product.name != null && product.name != (productFromRoot || {}).name" #tooltip><span class="tooltipInfo icons icon-info plainIcn ml-1" v-tooltip="getTranslation('I00.00054350', 'Original product name') + ': ' + (productFromRoot || {}).name"></span></template>
				<div class="input-group-append" v-if="!isLocalID(product.id) && product.name != null && product.name != (productFromRoot || {}).name"><span class="input-group-text icons icon-restore" v-tooltip="getTranslation('I00.00054380', 'Restore original trade name')" @click="product.name = null"></span></div>
			</InputGroup>
			<InputGroup class="readOnly" readonly="readonly" :text="getTranslation('I00.00003590', 'ProductName')" :value="product.name" v-else></InputGroup>
		</div>
		<div class="col-6">
			<InputGroup :specialType="!isLocalID(product.id) && product.artNo != null && product.artNo != product.originalArtNo ? true : false" :text="getTranslation('I00.00015350', 'ArticleNumber')" :validations="[maxLength(255)]" :value="product.artNo != null ? product.artNo : product.originalArtNo" @input="product.artNo = $event" required>
				<template v-if="!isLocalID(product.id) && product.artNo != null && product.artNo != product.originalArtNo" #tooltip><span class="tooltipInfo icons icon-info plainIcn ml-1" v-tooltip="getTranslation('I00.00054340', 'Original article number') + ': ' + product.originalArtNo"></span></template>
				<div class="input-group-append" v-if="!isLocalID(product.id) && product.artNo != null && product.artNo != product.originalArtNo"><span class="input-group-text icons icon-restore" v-tooltip="getTranslation('I00.00054390', 'Restore original prod. no.')" @click="product.artNo = null"></span></div>
			</InputGroup>
		</div>
		<div class="col-6 mt-3">
			<InputGroup class="readOnly" readonly="readonly" :text="getTranslation('I00.00004110', 'Supplier')" :value="value.section1Info.supplier.name"></InputGroup>
		</div>
		<div class="col-6 mt-3">
			<InputGroup :specialType="!isLocalID(product.id) && getUfiCode(product) && ((getUfiCode(product) || {}).value || '') != (productFromRoot || {}).ufiFromRoot ? true : false" :text="getTranslation('I00.00050690', 'UFI code')" :validations="[maxLength(255)]" :value="(getUfiCode(product) || {}).value || (productFromRoot || {}).ufiFromRoot" @input="setUfi">
				<template v-if="!isLocalID(product.id) && getUfiCode(product) && ((getUfiCode(product) || {}).value || '') != (productFromRoot || {}).ufiFromRoot" #tooltip><span class="tooltipInfo icons icon-info plainIcn ml-1" v-tooltip="getTranslation('I00.00054460', 'Original ufi no.') + ': ' + (productFromRoot || {}).ufiFromRoot"></span></template>
				<div class="input-group-append" v-if="!isLocalID(product.id) && getUfiCode(product) && ((getUfiCode(product) || {}).value || '') != (productFromRoot || {}).ufiFromRoot"><span class="input-group-text icons icon-restore" v-tooltip="getTranslation('I00.00054450', 'Restore original ufi no.')" @click="resetUfi"></span></div>
			</InputGroup>
		</div>
		<TextAreaGroup class="col-12 mt-3" :text="getTranslation('I00.00014970', 'Note')" :validations="[maxLength(2000)]" v-model="product.notes" />
	</InformationBoxEdit>
</template>

<script>
import { validators } from '../../../libraries/forms';
import { copyObjectProps, hashCode } from '../../../libraries/common';
import InformationBoxEdit from './InformationBoxEdit';
import { isLocalID, deepClone } from '../../../libraries/common';
import { getUfiCode } from '../../../libraries/product';

export default {
  components: {
    InformationBoxEdit
  },
  props: ['value', 'loader', 'productFromRoot'],
  data() {
    var product = deepClone(this.copyProductProps(this.value));
    return {
      product,
      $modelValidators: [],
      startHash: hashCode(product),
    };
  },
  methods: {
    copyProductProps(product) {
      return copyObjectProps(product, ['name', 'artNo', 'notes', 'msdsSection1', 'id', 'originalArtNo', 'productIsSubstance']);
    },
    setUfi(event) {
      var ufiObj = getUfiCode(this.product);
      if (ufiObj) {
        ufiObj.value = event;
        ufiObj.userDefined = true;
      }
      else
        this.product.msdsSection1.push({ keyID: 742, keyID_mdbID: 10, value: event, userDefined: true })
    },
    resetUfi() {
      var ufiObj = getUfiCode(this.product);
      if (ufiObj) {
        ufiObj.value = (this.productFromRoot || {}).ufiFromRoot;
        ufiObj.userDefined = false;
      }
    },
    maxLength: validators.maxLength,
    isLocalID: isLocalID,
    getUfiCode,
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    isChanged() {
      return this.startHash !== hashCode(this.product);
    }
  }
};
</script>