<template>
	<div class="form-group mb-0">
		<label class="form-control-label" v-if="text != null">
			{{ text }}
			<sup class="astera" v-if="propToBool(required)">*</sup>
		</label>
		<div class="specialType input-group" :class="{ notValid: !isValid }">
			<Input :class="{ notValid: !isValid, readOnly: propToBool(readOnly) || disableProductNameEditing }" :placeholder="placeholder" :value="(value || {}).name" @input="setProductName($event)" @blur="setProductName($event)" />
			<ButtonIconAdd @click="openModal()" :title="title" withBorder withReadOnlyMode />
			<ModalDialog :class="{ maximize: maximizeModal, minimize: !maximizeModal }" :additionalClass="{ maximize: maximizeModal, minimize: !maximizeModal }" :withFooter="true" :title="getTranslation('I00.00009310', 'Choose product')" @close="cancel()" v-show="showInventoryAdd">
				<InventoryAddSimple @maximize="maximizeModal = !maximizeModal" @productPicked="addProduct" @productRemoved="removeProduct" @cancel="cancel()" :isProductApplication="true" :shouldShowRequestButton="shouldShowRequestButton" :isVisible="showInventoryAdd" withConsumption withProductType />
			</ModalDialog>
		</div>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
		<div class="d-flex mt-4" v-if="showDocumentLink && dat.applicationRequest && dat.applicationRequest.applicationDocument">
			<a class="docBox w-auto" :href="dat.applicationRequest.applicationDocument.url" target="_blank">
				<span class="docType icon-sds"></span>
				<p>{{ dat.applicationRequest.applicationDocument.shortFileName }}</p>
			</a>
		</div>
	</div>
</template>

<script>
import { propToBool } from '../../../libraries/vue';
import { checkIsValid } from '../../../libraries/forms';
import InventoryAddSimple from '../../inventory/InventoryAddSimple.vue';
import ButtonIconAdd from '../../common/button/buttonIcon/ButtonIconAdd';
import { alert } from '../../../libraries/common';
export default {
	components: {
		InventoryAddSimple,
		ButtonIconAdd
	},
	props: ['dataProp', 'placeholder', 'text', 'title', 'required', 'readOnly', 'dat', 'value', 'validations', 'disableProductNameEditing', 'sdsNotRequired', 'shouldShowRequestButton', 'showDocumentLink'],
	data() {
		return {
			showInventoryAdd: false,
			isValid: true,
			errorMessage: null,
			maximizeModal: false
		};
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
		openModal() {
			this.showInventoryAdd = true;
			alert.clearMessages();
		},
		propToBool: propToBool,
		checkIsValid: checkIsValid
	},
	mounted() {
		this.$set(this.dat, 'disableProductNameEditing', this.disableProductNameEditing);
		this.$set(this.dat, 'sdsNotRequired', this.sdsNotRequired);
		this.$set(this.dat, 'shouldShowRequestButton', this.shouldShowRequestButton);
	}
};
</script>