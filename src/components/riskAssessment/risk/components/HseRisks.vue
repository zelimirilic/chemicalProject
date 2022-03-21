<template>
	<div>
		<table class="table table-hover dataTable valignM">
			<thead>
				<tr>
					<th class="w-30">{{ getTranslation('I00.00027480', 'Risk type') }}</th>
					<th class="w-25">{{ getTranslation('I00.00005920', 'ProbabilityLabel') }}</th>
					<th class="w-30">{{ getTranslation('I00.00005930', 'ConsequenceLabel') }}</th>
					<th>{{ getTranslation('I00.00005910', 'Risk') }}</th>
					<th class="iconCol">&nbsp;</th>
				</tr>
			</thead>
			<tbody>
				<template v-if="selectedRisks.length > 0">
					<tr v-for="riskItem in risks" :key="riskItem.itemRisk.text">
						<td class="w-30">{{ riskItem.name == null ? riskItem.itemRisk.text : riskItem.name }}</td>
						<td class="w-25">
							<Select :items="riskItems(blnProp, 'Prop')" prop="text" :value="riskItem.itemProp || firstPropCons(riskItems(blnProp, 'Prop'), 'itemProp', riskItem)" @input="riskPropConsSelected(riskItem, 'itemProp', $event)" compareByHash></Select>
						</td>
						<td class="w-30">
							<Select :items="riskItems(blnProp, 'Cons')" prop="text" :value="riskItem.itemCons || firstPropCons(riskItems(blnProp, 'Cons'), 'itemCons', riskItem)" @input="riskPropConsSelected(riskItem, 'itemCons', $event)" compareByHash></Select>
						</td>
						<td class="text-center">{{ riskValue(riskItem) }}</td>
						<td class="iconCol"><span class="icons icon-delete" v-tooltip="getTranslation('I00.00039230', 'Delete')" @click="$emit('remove', riskItem)" withReadOnlyMode></span></td>
					</tr>
				</template>
				<tr v-else>
					<td :colspan="4">
						<div class="emptyTxt text-center p-4">
							<p class="icons icon-noitems plainIcn bigIcn m-0 p-0"></p>
							<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055680', 'No items found') }}</h4>
							<h6 class="mb-3">{{ getTranslation('I00.00055690', 'You don’t have any items here.') }}</h6>
						</div>
					</td>
				</tr>
				<tr class="noHover">
					<td class="w-30">
						<div class="selectWrapper">
							<Select :items="[firstRiskItem].pushMany(riskItems(blnProp, 'Risk'))" @click="$emit('clicked')" :disabledItems="selectedRisks" :prop="getProp" :value="firstRiskItem" @input="riskItemSelected" compareByHash></Select>
						</div>
					</td>
					<td colspan="4">&nbsp;</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
  props: ['blnProp', 'risks', 'allRiskItems'],
  methods: {
    riskItemSelected(it) {
      this.$emit('add', it);
    },
    riskPropConsSelected(risk, prop, it) {
      this.$set(risk, prop, it);
    },
    firstPropCons(riskItems, prop, item) {
      if (riskItems.length > 0)
        this.$set(item, prop, riskItems.first());
    },
    riskItems(prop, type) {
      return this.allRiskItems.filter(f => f[prop] && f.type === type);
    },
    riskValue(risk) {
      if (risk.itemProp == null || risk.itemCons == null) return 0;
      return (risk.itemProp.itemValue_v3 || 0) * (risk.itemCons.itemValue_v3 || 0);
    },
    getProp(item) {
      return item.text == null ? item.itemText : item.text;
    }
  },
  computed: {
    firstRiskItem() { return { text: this.getTranslation("I00.00008210", "Add risk") }; },
    selectedRisks() {
      return this.allRiskItems.filter(x => this.risks.some(f => f.itemRisk.itemText == x.itemText));
    },
  }
};
</script>