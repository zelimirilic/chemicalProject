<template>
	<div>
		<SelectListItem class="p-4 borderB" :data="allPhrases.newRPhrasesList" :selectedItems="productClassificationCodes.rcodes" :text="getTranslation('I00.00006950', 'Hazard statements')" />
		<SelectListItem class="p-4 borderB" :data="allPhrases.newSPhrasesList" :selectedItems="productClassificationCodes.scodes" :text="getTranslation('I00.00014450', 'Precautionary statements')" />
		<SelectListItem class="p-4" :data="allPhrases.newClassificationList" :selectedItems="productClassificationCodes.dangerClasses" :text="getTranslation('I00.00051950', 'Hazard class and category')" />
	</div>
</template>

<script>
import axios from '../../../axios';
import { errorDebug } from '../../../libraries/common';
import SelectListItem from '../../../components/products/productPage/classification/SelectListItem';


export default {
  components: {
    SelectListItem,
  },
  props: ['productClassificationCodes'],
  data() {
    return {
      isSaving: false,
      isEditing: false,
      allPhrases: []
    };
  },
  methods: {
    getClassificationData() {
      axios.post('/LocalProduct/GetClassificationDataForChemsoft')
        .then(response => { this.allPhrases = response.data; }).catch(errorDebug);
    }
  },
  mounted() {
    this.getClassificationData();
  },
  beforeDestroy() {
    axios.cancelAll();
  }
};
</script>