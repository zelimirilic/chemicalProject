<template>
	<DataTable :tableData="data" :orgId="orgId" :title="title" showHeadersWhenEmpty :perPage="perPage">
		<template #head>
			<tr>
				<Th class="IconColumn skipForSorting skipColumn ignoreInExportToExcel" name="icon"></Th>
				<Th class="width60" prop="typeName" name="typeName" sort export defaultSort :placeholder="getTranslation('I00.00006930', 'Type')">{{ getTranslation('I00.00006930', 'Type') }}</Th>
				<Th class="consumeType" :prop="(f) => getConsumeValueUnits(f)" :sort="(f) => getConsumeValues(f)" :export="(f) => getConsumeValues(f)" :placeholder="getTranslation('I00.00005480', 'Annual consumption')">{{ getTranslation('I00.00005480', 'Annual consumption') }}</Th>
				<Th :export="(f) => getConsumeUnits(f)" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="consumeType" :prop="(f) => getStorageValueUnits(f)" :sort="(f) => getStorageValues(f)" :export="(f) => getStorageValues(f)" :placeholder="getTranslation('I00.00006750', 'Storage')">{{ getTranslation('I00.00006750', 'Storage') }}</Th>
				<Th :export="(f) => getStorageUnits(f)" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
			</tr>
		</template>
		<template #body="{ item }">
			<tr>
				<td class="IconColumn hideOnPrint">
					<img :src="appSettings.imageFolder + 'icons/icon-anvand.gif'" alt="" class="iconSizeSmall" />
				</td>
				<td class="width60">
					<span>{{ item.typeName }}</span>
				</td>
				<td class="consumeType">
					<p class="row no-gutters" v-for="(arr, ind) in item.amounts" :key="ind">
						<span class="col-6 pr-1 text-right">{{ arr.consume }}</span>
						<span class="ccol-6 text-left noWrap">{{ arr.consumeUnit }}</span>
					</p>
				</td>
				<td class="consumeType">
					<p class="row no-gutters" v-for="(arr, ind) in item.amounts" :key="ind">
						<span class="col-6 pr-1 text-right">{{ arr.storage }}</span>
						<span class="col-6 text-left noWrap">{{ arr.storageUnit }}</span>
					</p>
				</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>

import DataTable from '../../common/dataTable/DataTable_v3'
import Th from '../../common/dataTable/Th_v3';

export default {
  components: {
    DataTable,
    Th
  },
  props: ['data', 'title', 'perPage', 'orgId'],
  methods: {
    getConsumeValueUnits: item => (item['amounts'] || []).map((f) => (f.consume + '') + (f.consumeUnit || '')).join('\n'),
    getConsumeValues: item => item['amounts'].map(f => f.consume).join('\n'),
    getConsumeUnits: item => item['amounts'].map(f => f.consumeUnit).join('\n'),
    getStorageValueUnits: item => (item['amounts'] || []).map((f) => (f.storage + '') + (f.storageUnit || '')).join('\n'),
    getStorageValues: item => item['amounts'].map(f => f.storage).join('\n'),
    getStorageUnits: item => item['amounts'].map(f => f.storageUnit).join('\n')
  }
};
</script>