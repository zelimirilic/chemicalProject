<template>
	<SmallLoader v-if="!productsData" />
	<DataTable :tableClass="ResultTable" :tableData="camelCaseObj(productsData)" :title="title" :excelTitle="excelTitle" :perPage="perPage" noSearch v-else>
		<template #head>
			<tr>
				<Th class="IconColumn HideOnPrint skipForSorting ignoreInExportToExcel"></Th>
				<Th class="prodNo" prop="artNo" name="artNo" sort export>{{ getTranslation('I00.00015350', 'Product number') }}</Th>
				<Th prop="name" name="name" sort export defaultSort>{{ getTranslation('I00.00006920', 'Product name') }}</Th>
				<Th class="width20 skipForSorting" prop="supplier" name="supplier" sort export>{{ getTranslation('I00.00004110', 'Supplier') }}</Th>
				<Th class="dangerSymbol" :export="imageResult">{{ getTranslation('I00.00006610', 'Danger symbols') }}</Th>
			</tr>
		</template>
		<template #body="{ item }">
			<tr>
				<td class="IconColumn HideOnPrint">
					<span class="goodMediumIcon"></span>
				</td>
				<td class="prodNo">
					<a :href="item.link">{{ item.artNo }}</a>
				</td>
				<td>
					<a :href="item.link">{{ item.name }}</a>
				</td>
				<td class="width30">
					<span>{{ item.supplier }}</span>
				</td>
				<td class="dangerSymbol wrap">
					<DangerSymbols :dat="item" />
				</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
import DataTable from '../../components/common/dataTable/DataTable_v3';
import DangerSymbols from '../../components/riskAssessment/DangerSymbols_V3';
import Th from '../../components/common/dataTable/Th_v3';
import SmallLoader from '../../components/common/loaders/SmallLoader_v3';
import { camelCaseObj } from '../../libraries/common';
import { genericDangerSymbolsResult } from '../../libraries/exportToExcel_v3';
import { getDangerSymbols } from '../../libraries/reports';


export default {
  components: {
    DataTable,
    Th,
    SmallLoader,
    DangerSymbols
  },
  props: ['title', 'excelTitle', 'perPage', 'productsData'],
  methods: {
    imageResult(item) {
      return genericDangerSymbolsResult(['vattenfallDangerSymbols', 'oldLawNotVattenfallDangerSymbols', 'newLawDangerSymbols'], item);
    },
    getDangerSymbols: getDangerSymbols,
    camelCaseObj: camelCaseObj
  }
};
</script>
