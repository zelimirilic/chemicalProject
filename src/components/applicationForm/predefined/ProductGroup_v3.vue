<template>
	<div class="form-group mb-0">
		<label class="form-control-label" v-if="text != null">
			{{ text }}
			<sup class="icons astera" v-if="propToBool(required)"></sup>
		</label>
		<div class="input-group" :class="{ notValid: !isValid }">
			<Input :class="{ notValid: !isValid, readOnly: propToBool(readOnly) || disableProductNameEditing }" :placeholder="placeholder" :value="(value || {}).name" @input="setProductName($event)" @blur="setProductName($event)" />
			<ButtonIconAdd @click="showInventoryAdd = true" :title="title" withBorder withReadOnlyMode />
			<ModalDialog :title="getTranslation('I00.00009310', 'Choose product')" @close="cancel()" :withFooter="!appSettings.disableInventoryShowRequestButton" additional-class="w-80" v-show="showInventoryAdd">
				<InventoryAddSimple @productPicked="addProduct" :isVisible="showInventoryAdd" @productRemoved="removeProduct" @cancel="cancel()" :isProductApplication="true" :shouldShowRequestButton="shouldShowRequestButton" withConsumption withProductType />
			</ModalDialog>
		</div>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
		<div class="d-flex mt-4" v-if="showDocumentLink && dat.applicationRequest && dat.applicationRequest.applicationDocument">
			<a class="docBox" :href="dat.applicationRequest.applicationDocument.url" target="_blank">
				<span class="docType icon-sds"></span>
				<p>{{ dat.applicationRequest.applicationDocument.shortFileName }}</p>
			</a>
		</div>
	</div>
</template>

<script>
import { propToBool } from '../../../libraries/vue_v3';
import { checkIsValid } from '../../../libraries/forms_v3';
import ButtonIconAdd from '../../common/button/buttonIcon/ButtonIconAdd_v3';
import InventoryAddSimple from '../../inventory/InventoryAddSimple_v3.vue';
import ModalDialog from '../../common/modal/ModalDialog_v3';
import Input from '../../common/form/input/Input_v3';
import { alert } from '../../../libraries/common';
export default {
  components: {
    InventoryAddSimple,
    ButtonIconAdd,
    ModalDialog,
    Input
  },
  props: ['dataProp', 'placeholder', 'text', 'title', 'required', 'readOnly', 'dat', 'value', 'validations', 'disableProductNameEditing', 'sdsNotRequired', 'shouldShowRequestButton', 'showDocumentLink'],
  data() {
    return {
      showInventoryAdd: false,
      isValid: true,
      errorMessage: null,
    }
  },
  methods: {
    setProductName(value) {
      this.$emit('input', { name: value, supplierName: (this.value || {}).supplierName });
      this.$nextTick(() => this.checkIsValid());
    },
    addProduct(product) {
      this.$emit('input', product);
      this.$nextTick(() => this.checkIsValid());
    },
    removeProduct() {
      this.$emit('input', {});
    },
    cancel() {
      this.showInventoryAdd = false;
      alert.clearMessages();
    },
    propToBool: propToBool,
    checkIsValid: checkIsValid,
  },
  mounted() {
    this.$set(this.dat, 'disableProductNameEditing', this.disableProductNameEditing);
    this.$set(this.dat, 'sdsNotRequired', this.sdsNotRequired);
    this.$set(this.dat, 'shouldShowRequestButton', this.shouldShowRequestButton);
  }
}
</script>