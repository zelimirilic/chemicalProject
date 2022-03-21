<template v-if="hseSource && hseSource.risks">
	<div class="mb-4">
		<p class="mainTtl p-4">{{ title }}</p>
		<DataTable :tableData="hseSource.risks || []" noHeader noSearch noFooter>
			<template #head>
				<tr>
					<th class="w-30">{{ getTranslation('I00.00027480', 'Risk type') }}</th>
					<th class="w-25">{{ getTranslation('I00.00005920', 'Probability') }}</th>
					<th class="w-35">{{ getTranslation('I00.00005930', 'Consequence') }}</th>
					<th class="text-center">{{ getTranslation('I00.00006170', 'Risk') }}</th>
				</tr>
			</template>
			<template #body="{ item }">
				<tr>
					<td class="w-30">{{ item.name == null ? item.itemRisk.text : item.name }}</td>
					<td class="w-25">{{ item.itemProp == null ? '-' : item.itemProp.text }}</td>
					<td class="w-35">{{ item.itemCons == null ? '-' : item.itemCons.text }}</td>
					<td class="text-center">{{ riskValue(item) }}</td>
				</tr>
			</template>
		</DataTable>
		<div class="tag large mx-4 mt-4" v-if="haveHygienicExposureLimits">{{ getTranslation('I00.00050460', 'Hygienic exposure limits') }}</div>
	</div>
</template>

<script>
export default {
  props: ['title', 'hseSource', 'haveHygienicExposureLimits'],
  methods: {
    riskValue(risk) {
      if (risk.itemProp == null || risk.itemCons == null) return 0;
      return (risk.itemProp.itemValue_v3 || 0) * (risk.itemCons.itemValue_v3 || 0);
    }
  }
};
</script>