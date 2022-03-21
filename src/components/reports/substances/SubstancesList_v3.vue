<template>
	<DataTable :tableData="data" :orgId="orgId" :perPage="perPage" @update:per-page="$emit('update:per-page', $event)" :title="title" ref="dt" exportHeader :excelTitle="excelTitle" showHeadersWhenEmpty>
		<template #head>
			<tr>
				<Th class="IconColumn skipForSorting skipColumn ignoreInExportToExcel" name="icon"></Th>
				<Th class="prodName" prop="name" export :placeholder="getTranslation('I00.00011590', 'Substance')">{{ getTranslation('I00.00011590', 'Substance') }}</Th>
				<Th class="consume" :prop="getValueUnits('annualConsumption')" :sort="getValues('annualConsumption')" :export="getValues('annualConsumption')" :placeholder="getTranslation('I00.00005480', 'Annual consumption')">{{ getTranslation('I00.00005480', 'Annual consumption') }}</Th>
				<Th :export="getUnits('annualConsumption')" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="prodNo" prop="casNumber" export :placeholder="getTranslation('I00.00011610', 'CAS-number')">{{ getTranslation('I00.00011610', 'CAS-number') }}</Th>
				<Th class="prodNo" prop="egnumber" export :placeholder="getTranslation('I00.00020780', 'EG-number')">{{ getTranslation('I00.00020780', 'EG-number') }}</Th>
				<Th class="w-15" prop="rcodes" sort export :placeholder="getTranslation('I00.00014490', 'H-codes / R-codes')">{{ getTranslation('I00.00014490', 'H-codes / R-codes') }}</Th>
				<Th class="wp-110" prop="dangerClass" name="dangerClass" sort export="dangerClass" :excelTitle="getTranslation('I00.00017860', 'FaroKod')" :placeholder="getTranslation('I00.00017860', 'FaroKod')">{{ getTranslation('I00.00017860', 'FaroKod') }}</Th>
				<Th class="prodNo smallCell skipForSorting" prop="additionalData1" export :placeholder="getReachText()">{{ getReachText() }}</Th>
				<Th class="prodNo smallCell skipForSorting" prop="additionalData2" export :placeholder="getAdditionalHeaderText('additionalData2')">{{ getAdditionalHeaderText('additionalData2') }}</Th>
				<Th class="prodNo smallCell skipForSorting" prop="additionalData3" export :placeholder="getAdditionalHeaderText('additionalData3')">{{ getAdditionalHeaderText('additionalData3') }}</Th>
			</tr>
		</template>
		<template #body="product">
			<tr>
				<td class="IconColumn hideOnPrint">
					<img class="iconSizeSmall" :src="appSettings.imageFolder + product.item.icon" />
				</td>
				<td class="prodName">
					<a :href="product.item.linkToISafe">{{ product.item.name }}</a>
				</td>
				<td class="consume">
					<p v-for="(arr, ind) in product.item.annualConsumption" :key="ind">
						<span class="consume">{{ arr.value }}</span>
						<span class="noWrap">{{ arr.unit }}</span>
					</p>
				</td>
				<td class="prodNo">{{ product.item.casNumber }}</td>
				<td class="prodNo">{{ product.item.egnumber }}</td>
				<td class="w-15">{{ product.item.rcodes }}</td>
				<td class="wp-110">
					{{ product.item.dangerClass }}
				</td>
				<td class="prodNo smallCell">{{ product.item.additionalData1 }}</td>
				<td class="prodNo smallCell">{{ product.item.additionalData2 }}</td>
				<td class="prodNo smallCell">{{ product.item.additionalData3 }}</td>
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
  props: ['data', 'title', 'excelTitle', 'customFieldsTitles', 'perPage', 'orgId'],
  methods: {
    getValueUnits: (prop) => (product) => (product[prop] || []).map((f) => (f.value + '') + (f.unit || '')).join('\n'),
    getValues: prop => product => product[prop].map(f => f.value).join('\n'),
    getUnits: prop => product => product[prop].map(f => f.unit).join('\n'),
    getReachText() {
      var translator = {
        german: 'Annx17',
        danish: 'LOUS',
      };
      return translator[this.appSettings.orgProdListLawOtherCountry.toLowerCase()] || this.getTranslation('I00.00014460', 'REACH');
    },
    getAdditionalHeaderText(prop) {
      var translator = {
        german: {
          additionalData2: 'SVHC01',
          additionalData3: 'ChemVV',
        },
        danish: {
          additionalData2: 'Græns',
          additionalData3: 'Vand',
        },
        default: {
          additionalData2: this.getTranslation('I00.00010910', 'PRIO'),
          additionalData3: this.getTranslation('I00.00011630', 'Water framework directive'),
        }
      };
      return (translator[this.appSettings.orgProdListLawOtherCountry.toLowerCase()] || {})[prop] || translator['default'][prop];
    }
  }
};
</script>