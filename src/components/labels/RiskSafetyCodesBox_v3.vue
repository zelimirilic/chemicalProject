<template>
	<div class="codeBox borderTRBL" v-if="allCodes">
		<div class="titleRow row no-gutters">
			<div class="col wp-60 px-2">{{ getTranslation('I00.00037000', 'Code') }}</div>
			<div class="col px-2">{{ title }}</div>
		</div>
		<div class="hp-140 scrollBarY scroll borderB">
			<RiskItem :item="item" v-for="(item, ind) in riskSafetyCodes" :key="ind" @remove="riskSafetyCodes.remove(item)" :isDisabled="riskSafetyCodesFromProduct.filter((x) => x.Code == item.Code).length > 0" :productChecked="riskSafetyCodesFromProduct.filter((x) => x.Code == item.Code && x.Checked).length > 0" @setCodeFromProduct="setCodeFromProduct" />
		</div>
		<SelectGroup class="m-2" :items="allCodes" :disabledItems="disabledItems" :prop="(f) => replaceString(f.Code + ' ' + f.Text)" @input="riskSafetyCodes.push($event)" />
	</div>
</template>

<script>
import RiskItem from './RiskSafetyItem_v3.vue';
import SelectGroup from '../common/form/select/SelectGroup_v3.vue';

export default {
  components: {
    RiskItem,
    SelectGroup
  },
  props: ['allCodes', 'riskSafetyCodes', 'riskSafetyCodesFromProduct', 'title'],
  data() {
    return {
      isSaving: false,
      isEditing: false
    };
  },
  methods: {
    replaceString(item) {
      if (item != undefined)
        return item.replaceAll('.?', '[...]');
    },
    setCodeFromProduct(item) {
      this.riskSafetyCodesFromProduct.find(x => x.Code === item.Code).Checked = !this.riskSafetyCodesFromProduct.find(x => x.Code === item.Code).Checked;
    }
  },
  computed: {
    disabledItems() {
      return this.riskSafetyCodes.map(f => this.allCodes.find(g => g.Code == f.Code));
    },
  }
};
</script>