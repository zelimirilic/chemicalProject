<template>
	<DataTable :tableData="data" :perPage="20" :title="title" ref="dt" noHeader noSearch>
		<template #head>
			<tr>
				<Th class="iconCol hideOnPrint" prop="title" sort>{{ getTranslation('I00.00046590', 'Status') }}</Th>
				<Th class="prodName w-75" prop="name" sort>{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="wp-80 noWrap" prop="date" sort>{{ getTranslation('I00.00026040', 'Date') }}</Th>
			</tr>
		</template>
		<template #body="product">
			<tr>
				<td class="iconCol hideOnPrint">
					<router-link :to="`/chemicals/risk_assessment/risk/${product.item.riskId}/summary`">
						<span class="m-1 status" :class="product.item.class" :title="product.item.title">{{ product.item.title }}</span>
					</router-link>
				</td>
				<td class="prodName w-75">
					<router-link :to="`/chemicals/risk_assessment/risk/${product.item.riskId}/summary`">
						<span>{{ product.item.name }}</span>
					</router-link>
				</td>
				<td class="wp-80 noWrap">
					{{ product.item.date }}
				</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
export default {
  props: ['data', 'title'],
  mounted() {
    this.getTranslation('I00.00012130', 'All');
  },
};
</script>