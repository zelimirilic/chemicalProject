<template>
	<keep-alive>
		<DataTable :tableData="data" :title="title" ref="dt" @archiveRisks="$emit('archiveRisks')" @restoreRisks="$emit('restoreRisks')" :isArchiveEnabled="isArchiveEnabled" :isRestoreEnabled="isRestoreEnabled" :selectedIndex="selectedIndex" :selectFilterProps="['status', 'healthRisk', 'safetyRisk', 'environmentRisk', 'totalRiskValue']" @filteredTableData="setFilteredData" :selectFilterValues="filteredDataValues" noHeader excelTitle :perPage="perPage" @update:per-page="$emit('update:per-page', $event)">
			<template #additonalIcons>
				<span class="icons icon-archive mr-1" :class="{ disabledTooltip: !isArchiveEnabled, active: isArchiveEnabled }" v-tooltip="getTranslation('I00.00034190', 'Archive')" @click="isArchiveEnabled ? $emit('archiveRisks') : ''" v-if="selectedIndex === 0 && appSettings.riskAssessmentArchiveMany"></span>
				<span class="icons icon-restore mr-1" :class="{ disabledTooltip: !isRestoreEnabled }" v-tooltip="getTranslation('I00.00026430', 'Restore')" @click="isRestoreEnabled ? $emit('restoreRisks') : ''" v-if="selectedIndex === 2 && appSettings.riskAssessmentArchiveMany"></span>
			</template>
			<template #head>
				<tr>
					<th class="hideOnPrint" v-if="hasWriteRights() && appSettings.riskAssessmentArchiveMany">
						<input type="checkbox" @click="checkAll($event.target.checked)" :checked="isAllChecked()" :title="getTranslation('I00.00022740', 'Select all')" />
					</th>
					<Th class="iconCol" prop="status" name="status" sort export>{{ getTranslation('I00.00006090', 'Risk assessment') }}</Th>
					<Th class="prodName" prop="riskName" sort export>{{ getTranslation('I00.00025590', 'Activity') }}</Th>
					<Th class="prodNo" prop="articleNumbers" sort :export="exportToExcel.joinByNewLine('articleNumbers')">{{ getTranslation('I00.00015350', 'ArtNoHeader') }}</Th>
					<Th class="prodName" prop="productNames" sort :export="exportToExcel.joinByNewLine('productNames')">{{ appSettings.riskEvaluation ? getTranslation('I00.00006920', 'NameHeader') : getTranslation('I00.00021860', 'RiskSources') }}</Th>
					<Th class="prioCell" prop="healthRisk" sort export>{{ getTranslation('I00.00025290', 'Health') }}</Th>
					<Th class="prioCell" prop="safetyRisk" sort export>{{ getTranslation('I00.00025300', 'Safety') }}</Th>
					<Th class="prioCell" prop="environmentRisk" sort export>{{ getTranslation('I00.00025310', 'Environment') }}</Th>
					<Th class="prioCell" prop="totalRiskValue" :sort="(risk) => risk.totalRiskValue || -1" export>{{ getTranslation('I00.00021720', 'Risk level') }}</Th>
					<Th class="smallDate" prop="publishedDate" sort export>{{ getTranslation('I00.00016700', 'Published') }}</Th>
					<Th class="smallDate" prop="validUntilDate" sort export v-if="!propToBool(withArchivedDate)">{{ getTranslation('I00.00017760', 'Revision date') }}</Th>
					<Th class="smallDate" prop="archivedDate" sort export v-else>{{ getTranslation('I00.00055860', 'Archived') }}</Th>
				</tr>
			</template>
			<template #body="risk">
				<tr>
					<td class="hideOnPrint" v-if="hasWriteRights() && appSettings.riskAssessmentArchiveMany">
						<input type="checkbox" :checked="isChecked(risk.item)" @click="toggleCheck(risk.item)" />
					</td>
					<td class="iconCol">
						<span class="status" :class="risk.item.statusClass" :title="risk.item.status">&nbsp;</span>
					</td>
					<td class="prodName">
						<router-link :to="{ name: 'risk', params: { riskId: risk.item.raId, component: 'summary' } }">{{ risk.item.riskName || '-' }}</router-link>
					</td>
					<td class="mergedCell" colspan="2">
						<div class="d-flex prodLst AmountRow" v-for="(artNo, index) in getArticles(risk.item)" :key="index">
							<div class="prodNo mb-1">
								<p v-if="risk.item.productIds[index] != null && isLocalID(parseID(risk.item.productIds[index]))" class="mb-1">&nbsp;</p>
								<p class="mb-0">
									<router-link :to="{ name: 'risk', params: { riskId: risk.item.raId, component: 'summary' } }">{{ artNo }}</router-link>
								</p>
							</div>
							<div class="prodName mb-1">
								<p v-if="risk.item.productIds[index] != null && isLocalID(parseID(risk.item.productIds[index]))" class="tag mb-1">{{ getTranslation('I00.00050300', 'Own product') }}</p>
								<p class="mb-0">
									<router-link :to="{ name: 'risk', params: { riskId: risk.item.raId, component: 'summary' } }">{{ risk.item.productNames[index] }}</router-link>
								</p>
							</div>
						</div>
						<div class="w-100 text-center icons icon-details mt-2" v-if="risk.item.articleNumbers.length > 3" @click="toggleAllProducts(risk.item)"></div>
					</td>
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
					<td class="smallDate noWrap" v-if="!propToBool(withArchivedDate)">{{ risk.item.validUntilDate }}</td>
					<td class="smallDate noWrap" v-else>{{ risk.item.archivedDate }}</td>
				</tr>
			</template>
		</DataTable>
	</keep-alive>
</template>

<script>
import { isLocalID, parseID } from '../../libraries/common';
import { propToBool } from '../../libraries/vue';

export default {
  props: ['data', 'title', 'withArchivedDate', 'perPage', 'isArchiveEnabled', 'isRestoreEnabled', 'selectedIndex'],
  data() {
    return {
      checkedData: [],
      propToBool: propToBool,
      filteredDataValues: null,
    };
  },
  methods: {
    getArticles(risk) {
      return risk.articleNumbers.filter(function (f, ind) { return risk.opened || ind < 3; });
    },
    toggleAllProducts: function (risk) {
      this.$set(risk, 'opened', !risk.opened);
    },
    toggleCheck(item) {
      if (!this.isChecked(item))
        this.checkedData.push(item);
      else
        this.checkedData.remove(item);
      this.$emit('checked', this.checkedData);
    },
    isChecked(item) {
      return this.checkedData.indexOf(item) > -1;
    },
    checkAll(shouldCheck) {
      if (shouldCheck) {
        this.$refs.dt.filteredData.forEach(f => {
          if (!this.isChecked(f))
            this.checkedData.push(f);
        });
      } else {
        this.$refs.dt.filteredData.forEach(f => this.checkedData.remove(f));
      }
      this.$emit('checked', this.checkedData);
    },
    getDataAndRemoveChecked() {
      var checked = this.checkedData;
      this.checkedData = [];
      return checked;
    },
    resetData() {
      this.$refs.dt.resetData();
    },
    isAllChecked() {
      if (this.$refs.dt)
        return this.$refs.dt.filteredData.length && this.$refs.dt.filteredData.all(f => this.isChecked(f));
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
  }
}
</script>