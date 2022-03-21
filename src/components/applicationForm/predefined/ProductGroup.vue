<template>
	<div class="form-group mb-0">
		<label class="form-control-label" v-if="text != null">
			{{ text }}
			<sup class="astera" v-if="propToBool(required)">*</sup>
		</label>
		<div class="specialType input-group" :class="{ notValid: !isValid }">
			<Input :class="{ notValid: !isValid, readOnly: propToBool(readOnly) || disableProductNameEditing }" :placeholder="placeholder" :value="(value || {}).name" @input="setProductName($event)" @blur="setProductName($event)" />
			<ButtonIconAdd @click="showInventoryAdd = true" :title="title" withBorder withReadOnlyMode />
			<ModalDialog additional-class="w-80" :withFooter="true" :title="getTranslation('I00.00009310', 'Choose product')" @close="cancel()" v-show="showInventoryAdd">
				<InventoryAddSimple @productPicked="addProduct" @productRemoved="removeProduct" @cancel="cancel()" :isProductApplication="true" :shouldShowRequestButton="shouldShowRequestButton" :isVisible="showInventoryAdd" withConsumption withProductType />
			</ModalDialog>
		</div>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
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
    ButtonIconAdd,
  },
  props: ['dataProp', 'placeholder', 'text', 'title', 'required', 'readOnly', 'dat', 'value', 'validations', 'disableProductNameEditing', 'sdsNotRequired', 'shouldShowRequestButton'],
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