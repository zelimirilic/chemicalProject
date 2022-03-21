<template>
	<DataTable :tableData="data" ref="dt" :selectFilterProps="['status', 'healthRisk', 'safetyRisk', 'environmentRisk', 'totalRiskValue']" @filteredTableData="setFilteredData" :selectFilterValues="filteredDataValues" excelTitle :perPage="perPage" @update:per-page="$emit('update:per-page', $event)" noHeader>
		<template #head>
			<tr>
				<Th class="iconCol" prop="status" name="status" sort export>{{ getTranslation('I00.00006090', 'Risk assessment') }}</Th>
				<Th class="prodName" prop="riskName" sort export>{{ getTranslation('I00.00025590', 'Activity') }}</Th>
				<Th class="prodNo" prop="articleNumbers" sort :export="exportToExcel.joinByNewLine('articleNumbers')">{{ getTranslation('I00.00015350', 'ArtNoHeader') }}</Th>
				<Th class="prodName" prop="productNames" sort :export="exportToExcel.joinByNewLine('productNames')">{{ settings.getRiskEvaluation() ? getTranslation('I00.00006920', 'NameHeader') : getTranslation('I00.00021860', 'RiskSources') }}</Th>
				<Th prop="department" sort export>{{ getTranslation('I00.00026380', 'Department') }}</Th>
				<Th class="prioCell" prop="healthRisk" name="healthRisk" sort export>{{ getTranslation('I00.00025290', 'Health') }}</Th>
				<Th class="prioCell" prop="safetyRisk" name="safetyRisk" sort export>{{ getTranslation('I00.00025300', 'Safety') }}</Th>
				<Th class="prioCell" prop="environmentRisk" name="environmentRisk" sort export>{{ getTranslation('I00.00025310', 'Environment') }}</Th>
				<Th class="prioCell" prop="totalRiskValue" :sort="(risk) => risk.totalRiskValue || -1" export>{{ getTranslation('I00.00021720', 'Risk level') }}</Th>
				<Th class="smallDate" prop="publishedDate" sort export>{{ getTranslation('I00.00016700', 'Published') }}</Th>
				<Th class="smallDate" prop="validUntilDate" sort export>{{ getTranslation('I00.00017760', 'Revision date') }}</Th>
			</tr>
		</template>
		<template #body="risk">
			<tr>
				<td class="iconCol">
					<span class="status" :class="risk.item.statusClass" :title="risk.item.status">&nbsp;</span>
				</td>
				<td class="prodName">
					<router-link :to="{ name: 'generalRisk', params: { riskId: risk.item.raId, component: 'summary' } }">{{ risk.item.riskName }}</router-link>
				</td>
				<td class="mergedCell" colspan="2">
					<div class="d-flex prodLst AmountRow" v-for="(artNo, index) in getArticles(risk.item)" :key="index">
						<div class="prodNo mb-1">
							<p v-if="risk.item.productIds[index] != null && isLocalID(parseID(risk.item.productIds[index]))" class="mb-1">&nbsp;</p>
							<p class="mb-0">
								<router-link :to="{ name: 'generalRisk', params: { riskId: risk.item.raId, component: 'summary' } }">{{ artNo }}</router-link>
							</p>
						</div>
						<div class="prodName mb-1">
							<p v-if="risk.item.productIds[index] != null && isLocalID(parseID(risk.item.productIds[index]))" class="tag mb-1">{{ getTranslation('I00.00050300', 'Own product') }}</p>
							<p class="mb-0">
								<router-link :to="{ name: 'generalRisk', params: { riskId: risk.item.raId, component: 'summary' } }">{{ risk.item.productNames[index] }}</router-link>
							</p>
						</div>
					</div>
					<div class="w-100 text-center icons icon-details mt-2" v-if="risk.item.articleNumbers.length > 3" @click="toggleAllProducts(risk.item)"></div>
				</td>
				<td>{{ risk.item.department }}</td>
				<td class="prioCell">
					<div class="tooltipPrio" v-if="risk.item.healthRisk != 0">
						<p :class="'raLvl' + risk.item.healthRisk" :title="risk.item.healthRisk">{{ risk.item.healthRisk }}</p>
					</div>
					<p class="text-center" v-else>-</p>
				</td>
				<td class="prioCell">
					<div class="tooltipPrio" v-if="risk.item.safetyRisk != 0">
						<p :class="'raLvl' + risk.item.safetyRisk" :title="risk.item.safetyRisk">{{ risk.item.safetyRisk }}</p>
					</div>
					<p class="text-center" v-else>-</p>
				</td>
				<td class="prioCell">
					<div class="tooltipPrio" v-if="risk.item.environmentRisk != 0">
						<p :class="'raLvl' + risk.item.environmentRisk" :title="risk.item.environmentRisk">{{ risk.item.environmentRisk }}</p>
					</div>
					<p class="text-center" v-else>-</p>
				</td>
				<td class="prioCell">
					<div class="tooltipPrio" v-if="risk.item.totalRiskValue != 0">
						<p :class="'raLvl' + risk.item.totalRiskValue" :title="risk.item.totalRiskPhrase">{{ risk.item.totalRiskValue }}</p>
					</div>
					<p class="text-center" v-else>-</p>
				</td>
				<td class="smallDate noWrap" :class="{ cursor: risk.item.publishedDate !== '-' }" @click="$emit('getLastSignedRiskForProduct', { raId: risk.item.raId, publishedDate: risk.item.publishedDate })">{{ risk.item.publishedDate }}</td>
				<td class="smallDate noWrap">{{ risk.item.validUntilDate }}</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
import { isLocalID, parseID } from '../../libraries/common';
export default {
  props: ['data', 'title', 'perPage'],
  data() {
    return {
      settings: {
        getRiskEvaluation: () => false
      },
      filteredDataValues: null
    };
  },
  methods: {
    getArticles(risk) {
      return risk.articleNumbers.filter((f, ind) => risk.opened || ind < 3);
    },
    toggleAllProducts: function (risk) {
      this.$set(risk, 'opened', !risk.opened);
    },
    resetData() {
      this.$refs.dt.resetData();
    },
    setFilteredData(items) {
      this.filteredDataValues = items ? {
        status: [...new Set([""].pushMany(items.map(x => x.status)))].sort(),
        healthRisk: [...new Set(([""].pushMany(items.map(x => x.healthRisk))).filter(x => x !== 0))].sort(),
        safetyRisk: [...new Set(([""].pushMany(items.map(x => x.safetyRisk))).filter(x => x !== 0))].sort(),
        environmentRisk: [...new Set(([""].pushMany(items.map(x => x.environmentRisk))).filter(x => x !== 0))].sort(),
        totalRiskValue: [...new Set(([""].pushMany(items.map(x => x.totalRiskValue))).filter(x => x !== 0))].sort()
      } : [];
    },
    parseID: parseID,
    isLocalID: isLocalID
  },
}
</script>