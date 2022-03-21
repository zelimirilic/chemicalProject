<template>
	<SmallLoader v-if="isSaving || allPhrases.length == 0" />
	<AccordionBoxEdit @cancel="$emit('cancel')" @save="save" :isChanged="isChanged" :isModelValid="isModelValid" v-else>
		<InputGroup class="col-xl-6 col-12 mb-3 primaryTxt" v-model="substance.name" :text="getTranslation('I00.00038130', 'Chemical name')" required />
		<InputGroup class="col-xl-6 col-12 mb-3 primaryTxt" v-model="substance.cas" :text="getTranslation('I00.00044260', 'Cas no.')" />
		<InputGroup class="col-xl-6 col-12 mb-3 primaryTxt" v-model="substance.eg" :text="getTranslation('I00.00018010', 'Ec no.')" />
		<div class="col-xl-6 col-12 mb-3">
			<div class="form-group">
				<label class="form-control-label primaryTxt">{{ getTranslation('I00.00038150', 'Concentration') }}</label>
				<div class="d-flex align-items-stretch">
					<Select class="w-40 mr-1" :items="['>', '≥']" v-model="substance.concLowSign" />
					<Input v-model="substance.lowConc" />
					<span class="align-self-center mx-1">-</span>
					<Select class="w-40 mr-1" :items="['<', '≤']" v-model="substance.concHighSign" />
					<Input v-model="substance.highConc" />
				</div>
			</div>
		</div>
		<SelectListItem class="col-12 mb-4 px-3" :data="allPhrases.newRPhrasesList" :selectedItems="substance.rCodes" :text="getTranslation('I00.00006950', 'Hazard statements')" />
		<SelectListItem class="col-12 px-3" :data="allPhrases.newClassificationList" :selectedItems="substance.dangerClasses" :text="getTranslation('I00.00051950', 'Hazard class and category')" />
	</AccordionBoxEdit>
</template>

<script>
import axios from '../../../axios';
import AccordionBoxEdit from './../../products/productPage/AccordionBoxEdit';
import SelectListItem from '../../../components/products/productPage/classification/SelectListItem';
import { errorDebug } from '../../../libraries/common';
import { checkIsValid } from '../../../libraries/vue';

export default {
  components: {
    AccordionBoxEdit,
    SelectListItem
  },
  props: ['substance', 'product', 'isChanged'],
  data() {
    return {
      $modelValidators: [],
      allPhrases: [],
      isSaving: false
    }
  },
  methods: {
    getClassificationData() {
      axios.post('/LocalProduct/GetClassificationDataForChemsoft')
        .then(response => { this.allPhrases = response.data; }).catch(errorDebug);
    },
    save() {
      if (!checkIsValid(this)) return;
      this.isSaving = true;
      axios.post('/ProductPage/SaveSubstance', { substance: this.substance })
        .then(response => {
          if (response.data.isSaved) {
            this.isSaving = false;
            this.$emit('reRenderCompositionList');
          } else
            return;

        }).catch(errorDebug);
    }
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    }
  },
  mounted() {
    this.getClassificationData();
  }
};
</script>