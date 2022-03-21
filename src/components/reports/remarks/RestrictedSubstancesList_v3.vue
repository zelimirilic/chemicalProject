<template>
	<DataTable :tableData="currentData" :orgId="orgId" :title="title" :excelTitle="excelTitle" showHeadersWhenEmpty :perPage="perPage">
		<template #head>
			<tr>
				<Th class="IconColumn skipForSorting skipColumn ignoreInExportToExcel" name="icon"></Th>
				<Th class="prodNo" prop="artNum" name="artNum" sort export :placeholder="getTranslation('I00.00002880', 'Prod. No.')">{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="prodName" prop="name" name="name" sort export defaultSort :placeholder="getTranslation('I00.00004270', 'Name')">{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="consume" :prop="getValueUnits('consumption')" :sort="getValues('consumption')" :export="getValues('consumption')" :placeholder="getTranslation('I00.00005480', 'Annual consumption')">{{ getTranslation('I00.00005480', 'Annual consumption') }}</Th>
				<Th :export="getUnits('consumption')" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="consume" :prop="getValueUnits('storage')" :sort="getValues('storage')" :export="getValues('storage')" :placeholder="getTranslation('I00.00009610', 'Storage')">{{ getTranslation('I00.00009610', 'Storage') }}</Th>
				<Th :export="getUnits('storage')" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="supplier" prop="supplier" name="supplier" sort export :placeholder="getTranslation('I00.00004110', 'Supplier')">{{ getTranslation('I00.00004110', 'Supplier') }}</Th>
				<Th class="IconColumn hideOnPrint" name="sds">{{ getTranslation('I00.00005280', 'SDS') }}</Th>
			</tr>
		</template>
		<template #body="product">
			<tr>
				<td class="IconColumn hideOnPrint">
					<div class="xsBottomPadding" :title="product.item.iconTitle">
						<img :src="appSettings.imageFolder + product.item.iconLink" alt="" class="iconSizeSmall" />
					</div>
				</td>
				<td class="prodNo">
					<a :href="product.item.linkToISafe">{{ product.item.artNum }}</a>
				</td>
				<td class="prodName">
					<a :href="product.item.linkToISafe">{{ product.item.name }}</a>
				</td>
				<td class="consume">
					<p class="row no-gutters" v-for="(arr, ind) in product.item.consumption" :key="ind">
						<span class="col-xl-8 col-6 pr-1 text-right">{{ arr.value }}</span>
						<span class="col-xl-4 col-6 noWrap">{{ arr.unit }}</span>
					</p>
				</td>
				<td class="consume">
					<p class="row no-gutters" v-for="(arr, ind) in product.item.storage" :key="ind">
						<span class="col-xl-8 col-6 pr-1 text-right">{{ arr.value }}</span>
						<span class="col-xl-4 col-6 noWrap">{{ arr.unit }}</span>
					</p>
				</td>
				<td class="supplier">
					<a :href="product.item.linkToSupplier">
						<span>{{ product.item.supplier }}</span>
					</a>
				</td>
				<td class="IconColumn hideOnPrint">
					<a class="msdsIcon" :href="product.item.linkToSDS"></a>
				</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
import DataTable from '../../common/dataTable/DataTable_v3'
import Th from '../../common/dataTable/Th_v3';
import { hashCode } from '../../../libraries/common_v3';

export default {
  components: {
    DataTable,
    Th
  },
  props: ['data', 'title', 'excelTitle', 'perPage', 'orgId'],
  data() {
    return {
      currentData: this.data.map(f => ({ ...f, hashCode: () => hashCode(f) })),
    }
  },
  methods: {
    getValueUnits: (prop) => (product) => (product[prop] || []).map((f) => (f.value + '') + (f.unit || '')).join('\n'),
    getValues: prop => product => product[prop].map(f => f.value).join('\n'),
    getUnits: prop => product => product[prop].map(f => f.unit).join('\n')
  }
};
</script>