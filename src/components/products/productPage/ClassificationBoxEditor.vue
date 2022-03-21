<template>
	<div>
		<InformationBox :tooltipTtl="getTranslation('I00.00006260', 'Edit')" :noRow="true" :noEdit="!isLocalProduct(product)" :title="getTranslation('I00.00014470', 'Classification')" @edit="edit()" v-show="!isEditing">
			<ClassificationBox :product="product" @edit="edit" />
		</InformationBox>
		<InformationBoxEdit :noRow="true" :title="getTranslation('I00.00014470', 'Classification')" @cancel="cancel()" :isChanged="isChanged" :isModelValid="true" @save="save()" :loader="isSaving" v-if="isEditing">
			<ClassificationBoxEdit :productClassificationCodes="productClassificationCode" :loader="isSaving" @cancel="cancel" @save="save" />
		</InformationBoxEdit>
	</div>
</template>

<script>
import axios from '../../../axios';
import { errorDebug, hashCode, deepClone } from '../../../libraries/common';
import { isLocalProduct } from '../../../libraries/product';
import ClassificationBox from '../../../components/products/productPage/ClassificationBox';
import ClassificationBoxEdit from '../../../components/products/productPage/ClassificationBoxEdit';
import InformationBox from './InformationBox';
import InformationBoxEdit from './InformationBoxEdit';

export default {
  components: {
    ClassificationBox,
    ClassificationBoxEdit,
    InformationBox,
    InformationBoxEdit
  },
  props: ['product'],
  data() {
    return {
      isSaving: false,
      isEditing: false,
      startHash: null,
      productClassificationCode: deepClone(this.product.productClassificationCode),
    };
  },
  methods: {
    edit() {
      this.isEditing = true;
      this.startHash = hashCode(this.productClassificationCode);
    },
    cancel() {
      this.isEditing = false;
      this.productClassificationCode = deepClone(this.product.productClassificationCode);
    },
    save() {
      this.isSaving = true;
      return axios.post('/LocalProduct/SaveProductForChemsoft', { product: { ...this.product, productClassificationCode: this.productClassificationCode } })
        .then((response) => {
          this.isSaving = false;
          this.isEditing = false;
          this.product.productClassificationCode = response.data.productClassificationCode;
          this.productClassificationCode = deepClone(this.product.productClassificationCode);
        }).catch(error => {
          this.isSaving = false;
          errorDebug(error);
        });
    },
    isLocalProduct,
    deepClone: deepClone
  },
  computed: {
    isChanged() {
      return this.startHash != hashCode(this.productClassificationCode);
    }
  },
  beforeDestroy() {
    axios.cancelAll();
  }
};
</script>