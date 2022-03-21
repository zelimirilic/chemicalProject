<template>
	<div>
		<MainLoader v-if="isSaving || isLoading" />
		<MainTitle v-else class="card pageWrapper" :text="getTranslation('I00.00042430', 'Create own, local product')">
			<template #linkSlot>
				<ButtonIconSave @click="saveProduct" :class="{ disabled: !isModelValid || isSaving }" />
			</template>
			<SubTitle :text="getTranslation('I00.00017680', 'BasicProductInfoTitle')"></SubTitle>
			<div class="row p-4">
				<div class="col-12">
					<CheckBoxGroup v-model="product.productIsSubstance">{{ getTranslation('I00.00054990', 'Product is a substance') }}</CheckBoxGroup>
				</div>
				<InputGroup class="col-2 mt-4" :text="getTranslation('I00.00015350', 'ArticleNumber')" v-model="product.ArtNo" required />
				<InputGroup class="col-5 mt-4" :text="getTranslation('I00.00004270', 'Name')" v-model="product.Name" required />
				<InputGroup class="col-5 mt-4" :text="getTranslation('I00.00004110', 'Supplier')" v-model="product.SupplierName" required />
				<TextAreaGroup class="col-12 mt-3" :text="getTranslation('I00.00014970', 'Note')" :validations="[maxLength(2000)]" v-model="product.notes" />
			</div>
		</MainTitle>
	</div>
</template>

<script>
import MainTitle from '../../../components/common/cardBox/MainTitle';
import axios from '../../../axios';
import { errorDebug, idToString } from '../../../libraries/common';
import SubTitle from '../../../components/common/cardBox/Subtitle';
import { checkIsValid } from '../../../libraries/vue';
import { validators } from '../../../libraries/forms';

export default {
  components: {
    MainTitle,
    SubTitle
  },
  data() {
    return {
      product: {},
      isSaving: false,
      isLoading: false,
      $modelValidators: []
    };
  },
  methods: {
    saveProduct() {
      if (!checkIsValid(this)) return;
      this.isSaving = true;
      axios.post('/LocalProduct/SaveProductForChemsoft', { product: this.product })
        .then(response => this.$router.replace({ name: 'product', params: { id: idToString(response.data.id) } }))
        .catch(errorDebug);
    },
    maxLength: validators.maxLength,
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    }
  },
  mounted() {
    this.getTranslation('I00.00024400', 'Saved');
  },
  beforeDestroy() {
    axios.cancelAll();
  }
};
</script>