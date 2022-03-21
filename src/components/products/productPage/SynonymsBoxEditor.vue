<template>
	<div>
		<SynonymsBox :product="product" @edit="edit" v-if="!isEditing" />
		<SynonymsBoxEdit :synonyms="synonymsArrayForSave" :loader="isSaving" @cancel="cancel" @save="save" v-if="isEditing" />
	</div>
</template>

<script>
import axios from '../../../axios';
import { errorDebug, deepClone } from '../../../libraries/common';
import SynonymsBox from './SynonymsBox';
import SynonymsBoxEdit from './SynonymsBoxEdit';

export default {
  components: {
    SynonymsBox,
    SynonymsBoxEdit
  },
  props: ['product'],
  data() {
    return {
      isSaving: false,
      isEditing: false,
      synonymsArrayForSave: deepClone(this.product.synonyms),
    };
  },
  methods: {
    save() {
      this.isSaving = true;
      var productObjectForSave = {
        ...this.product,
        synonyms: this.synonymsArrayForSave
      };
      return axios.post('/LocalProduct/SaveSynonymsForChemsoft', { product: productObjectForSave })
        .then(() => {
          this.isSaving = false;
          this.isEditing = false;
          this.$emit('saved', { synonyms: this.synonymsArrayForSave });
        }).catch(error => {
          this.isSaving = false;
          errorDebug(error);
        });
    },
    cancel() {
      this.synonymsArrayForSave = deepClone(this.product.synonyms);
      this.isEditing = false;
    },
    edit() {
      this.synonymsArrayForSave = deepClone(this.product.synonyms);
      this.isEditing = true;
    },
    deepClone: deepClone
  }
};
</script>