<template>
	<div>
		<BasicProductInformationBox :product="product" :productFromRoot="productFromRoot" :loaderSS="loaderSS" @edit="isEditing = true" v-show="!isEditing" @showSignedActivity="$emit('showBaseAndActivitySafetySheet')" />
		<BasicProductInformationBoxEdit :value="product" :productFromRoot="productFromRoot" :loader="isSaving" @input="save" @cancel="isEditing = false" v-if="isEditing" />
	</div>
</template>

<script>
import BasicProductInformationBox from './BasicProductInformationBox';
import BasicProductInformationBoxEdit from './BasicProductInformationBoxEdit';
import { errorDebug } from '../../../libraries/common';
import axios from '../../../axios';

export default {
  components: {
    BasicProductInformationBox,
    BasicProductInformationBoxEdit,
  },
  props: ['product', 'productFromRoot', 'loaderSS'],
  data() {
    return {
      isSaving: false,
      isEditing: false,
      showLoader: true,
    };
  },
  methods: {
    save(event) {
      this.isSaving = true;
      return axios.post('/LocalProduct/SaveProductForChemsoft', { product: { ...this.product, ...event } })
        .then(() => {
          this.isSaving = false;
          this.isEditing = false;
          this.$emit('saved', event);
        }).catch(error => {
          this.isSaving = false;
          errorDebug(error);
        });
    },
  },
}
</script>