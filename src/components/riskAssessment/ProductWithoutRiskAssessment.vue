<template>
	<DataTable :tableData="data" :title="title" ref="dt" excelTitle :perPage="perPage" @update:per-page="$emit('update:per-page', $event)">
		<template #head>
			<tr>
				<Th class="prioCell" prop="totalPrioRisk" sort export defaultSort :excel-fnc="convertPrio">{{ getTranslation('I00.00026030', 'Priority') }}</Th>
				<Th class="prodNo" prop="articleNumber" sort export>{{ getTranslation('I00.00015350', 'ArtNoHeader') }}</Th>
				<Th class="w-30" prop="productName" sort export>{{ getTranslation('I00.00006920', 'NameHeader') }}</Th>
				<Th class="consume" :prop="getValueUnits('usage')" sort :export="getValues('usage')">{{ getTranslation('I00.00003420', 'Usage') }}</Th>
				<Th :prop="getUnits('usage')" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="consume" :prop="getValueUnits('storage')" sort export="getValues('storage')">{{ getTranslation('I00.00004090', 'Storage') }}</Th>
				<Th :prop="getUnits('storage')" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="dangerSymbol" prop="classifications" sort export :excelTitle="getTranslation('I00.00014470', 'Clasification')">{{ getTranslation('I00.00014470', 'Clasification') + ' / ' + getTranslation('I00.00006610', 'Danger symbols') }}</Th>
				<Th :export="imageResult" v-show="false">{{ getTranslation('I00.00006610', 'Danger symbols') }}</Th>
				<Th class="w-15" prop="rphrases" sort export>{{ getTranslation('I00.00014490', 'R-frase') }}</Th>
				<Th class="wp-80" prop="inventoryDate" sort export>{{ getTranslation('I00.00017620', 'InventoryDate') }}</Th>
			</tr>
		</template>
		<template #body="risk">
			<tr>
				<td class="prioCell">
					<div class="tooltipPrio">
						<p :class="'prioLvl' + risk.item.totalPrioRisk" :title="risk.item.totalPrioRisk || 'M'">{{ risk.item.totalPrioRisk || 'M' }}</p>
						<span>{{ risk.item.totalPrioRisk === 0 ? getTranslation('I00.00048560', 'Prio description Medical') : getTranslation('I00.00034030', 'Prio description') }}</span>
					</div>
				</td>
				<td class="prodNo">
					<A @click="createNewRisk(risk.item)">{{ risk.item.articleNumber }}</A>
				</td>
				<td class="w-30">
					<A @click="createNewRisk(risk.item)">{{ risk.item.productName }}</A>
				</td>
				<td class="consume">
					<p v-for="(arr, ind) in risk.item.usage" :key="ind">
						<span class="consume">{{ arr.value }}</span>
						<span class="noWrap">{{ arr.unit }}</span>
					</p>
				</td>
				<td class="consume">
					<p v-for="(arr, ind) in risk.item.storage" :key="ind">
						<span class="consume">{{ arr.value }}</span>
						<span class="noWrap">{{ arr.unit }}</span>
					</p>
				</td>
				<td class="dangerSymbol">
					{{ risk.item.classifications }}
					<DangerSymbols :dat="risk.item" />
				</td>
				<td class="w-15">{{ risk.item.rphrases }}</td>
				<td class="wp-80 noWrap">{{ risk.item.inventoryDate }}</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
import { genericDangerSymbolsResult } from '../../libraries/exportToExcel';
import DangerSymbols from './DangerSymbols';
import { ticker, parseID } from '../../libraries/common';
import { propToBool } from '../../libraries/vue';

export default {
  components: {
    DangerSymbols,
  },
  props: ['data', 'title', 'writeRights', 'perPage'],
  data() {
    return {
      settings: {
        getRiskEvaluation: () => false
      },
    };
  },
  methods: {
    getValueUnits: (prop) => (product) => product[prop].map((f) => (f.value + '') + (f.unit || '')).join('\n'),
    getValues: (prop) => (product) => product[prop].map((f) => f.value).join('\n'),
    getUnits: (prop) => (product) => product[prop].map((f) => f.unit).join('\n'),
    convertPrio(prio) {
      return prio === 0 ? 'M' : prio;
    },
    propToBool: propToBool,
    imageResult(product) {
      return genericDangerSymbolsResult(["vattenfallDangerSymbols", "oldLawNotVattenfallDangerSymbols", "newLawDangerSymbols"], product);
    },
    resetData() {
      this.$refs.dt.resetData();
    },
    createNewRisk(item) {
      if (!this.writeRights) {
        ticker.addWarningMessage(this.getTranslation('I00.00016210', 'You don\'t have enough permissions. This page is read-only.'));
      } else {
        var prod = {
          prodID: parseID(item.id),
          artNo: item.articleNumber,
          name: item.productName,
        };
        this.$router.push(`/chemicals/risk_assessment/risk_new/handling?product=${btoa(JSON.stringify(prod))}`);
      }
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisProductWithoutRiskAssessment'] = this;
  },
}
</script>