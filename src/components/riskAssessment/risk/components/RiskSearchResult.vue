<template>
	<SmallLoader v-if="!items" />
	<DataTable tableClass="border0" tableWrapClass="h-100" :tableData="items" noHeader noFooter noSearch :perPage="20" :isSearchResult="true" :hasOuterSearchWord="lastSearchObj.search_word" v-else>
		<template #head>
			<tr>
				<Th class="iconCol" prop="Status" sort>{{ getTranslation('I00.00014790', 'Status') }}</Th>
				<Th class="prodName" prop="ActivityName" sort defaultSort>{{ getTranslation('I00.00002970', 'Local name') }}</Th>
				<Th class="prodNo" prop="ProductNumbers" sort>{{ getTranslation('I00.00015350', 'Prod. No.') }}</Th>
				<Th class="prodName" prop="ProductNames" sort>{{ getTranslation('I00.00021860', 'Risk sources') }}</Th>
				<Th class="w-25" prop="DepartmentName" sort>{{ getTranslation('I00.00002940', 'Department') }}</Th>
			</tr>
		</template>
		<template #body="risk">
			<tr @click="selectRow(risk.item)" :class="{ selectedRow: risk.item.Selected }">
				<td class="iconCol">
					<span class="status" :class="risk.item.StatusClass" :title="risk.item.StatusText">&nbsp;</span>
				</td>
				<td class="prodName bold">{{ risk.item.ActivityName }}</td>
				<td class="prodNo wrap">{{ risk.item.ProductNumbers }}</td>
				<td class="prodName">{{ risk.item.ProductNames }}</td>
				<td class="w-25">{{ risk.item.DepartmentName }}</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>

export default {
  props: ['items', 'lastSearchObj'],
  methods: {
    selectRow(selectedRisk) {
      this.items.map((obj) => {
        obj.Selected = false;
      });

      selectedRisk.Selected = true;
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisRiskSearchResult'] = this;
  }
}
</script>