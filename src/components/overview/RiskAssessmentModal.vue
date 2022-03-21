<template>
	<DataTable :tableData="data" :title="title" :excelTitle="excelTitle" :perPage="perPage" @update:per-page="$emit('update:per-page', $event)">
		<template #head>
			<tr v-if="!isRiskToDo">
				<Th class="w-35" prop="ActivityName" sort export>{{ getTranslation('I00.00049430', 'Activity name') }}</Th>
				<Th prop="Organisation" sort defaultSort export>{{ getTranslation('I00.00004400', 'Organisation') }}</Th>
				<Th class="w-35" prop="RiskSources" sort export>{{ getTranslation('I00.00021860', 'RiskSources') }}</Th>
			</tr>
			<tr v-else>
				<Th prop="OrganisationPath" sort export>{{ getTranslation('I00.00022520', 'Organisation') }}</Th>
				<Th class="w-20" prop="Qty" sort defaultSort export>{{ getTranslation('I00.00016110', 'Qty') }}</Th>
			</tr>
		</template>
		<template #body="data">
			<tr v-if="!isRiskToDo">
				<td class="w-35">
					<router-link :to="{ name: 'risk', params: { riskId: data.item.RaId, component: 'summary' } }">
						<span>{{ data.item.ActivityName }}</span>
					</router-link>
				</td>
				<td>
					<router-link :to="{ name: 'risk', params: { riskId: data.item.RaId, component: 'summary' } }">
						<span>{{ data.item.Organisation }}</span>
					</router-link>
				</td>
				<td class="wp-35">
					<router-link :to="{ name: 'risk', params: { riskId: data.item.RaId, component: 'summary' } }">
						<span>{{ data.item.RiskSources }}</span>
					</router-link>
				</td>
			</tr>
			<tr v-else>
				<td>
					<A>
						<span @click="goToProductsWithoutRisk(data.item.OrgID)">{{ data.item.OrganisationPath }}</span>
					</A>
				</td>
				<td class="wp-20">
					<A @click="goToProductsWithoutRisk(data.item.OrgID)">
						<span>{{ data.item.Qty }}</span>
					</A>
				</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
import { idsAreEqual } from '../../libraries/common';

export default {
  props: ['data', 'title', 'excelTitle', 'isRiskToDo', 'perPage'],
  methods: {
    goToProductsWithoutRisk(orgId) {
      var find = this.sideTree.getAllData().find(f => idsAreEqual(f.item.orgID, orgId));
      this.$store.getters.treeStateClick(find);
      this.$router.push("/chemicals/risk_assessment/products");
    }
  }

}
</script>