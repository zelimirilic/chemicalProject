<template>
	<DataTable :tableData="data" :orgId="orgId" :perPage="perPage" @update:per-page="$emit('update:per-page', $event)" :title="title" ref="dt" exportHeader :excelTitle="excelTitle" showHeadersWhenEmpty secondHeaderFilter>
		<template #head>
			<tr>
				<Th class="iconCol skipForSorting skipColumn ignoreInExportToExcel"></Th>
				<Th class="prodNo" prop="artNum" sort export :placeholder="getTranslation('I00.00002880', 'Prod. No.')">{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="prodName" prop="name" sort export defaultSort :placeholder="getTranslation('I00.00033260', 'Current tradename')">{{ getTranslation('I00.00033260', 'Current tradename') }}</Th>
				<Th class="prodNo smallCell" prop="productType" sort export :placeholder="getTranslation('I00.00012550', 'Product type')">{{ getTranslation('I00.00012550', 'Product type') }}</Th>
				<Th class="consume" :prop="getValueUnits('consumption')" :sort="getValues('consumption')" :export="getValues('consumption')" :placeholder="getTranslation('I00.00005480', 'Annual consumption')">{{ getTranslation('I00.00005480', 'Annual consumption') }}</Th>
				<Th :export="getUnits('consumption')" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="w-15" prop="rcodes" sort export :placeholder="getTranslation('I00.00025440', 'Haz statements / R-codes')">{{ getTranslation('I00.00025440', 'Haz statements / R-codes') }}</Th>
				<Th class="w-15" prop="scodes" sort export :placeholder="getTranslation('I00.00025450', 'Pre statements / S-codes')">{{ getTranslation('I00.00025450', 'Pre statements / S-codes') }}</Th>
				<Th class="dangerSymbol" :export="imageResult" name="dangerSymbols" :excelTitle="getTranslation('I00.00006610', 'Danger symbols')">{{ getTranslation('I00.00006610', 'Danger symbols') }}</Th>
				<Th class="wp-110" prop="faroKlass" name="faroKlass" sort export="faroKlass" :excelTitle="getTranslation('I00.00014470', 'Clasification')" :placeholder="getTranslation('I00.00014470', 'Clasification')">{{ getTranslation('I00.00014470', 'Clasification') }}</Th>
				<Th class="statusCell" prop="wasserKlass" sort export v-if="isGerman" :placeholder="getTranslation('I00.00014630', 'Water class')">{{ getTranslation('I00.00014630', 'Water class') }}</Th>
				<Th class="statusCell" prop="ewc" sort export v-if="isGerman" :placeholder="'EWC'">EWC</Th>
				<Th class="prodNo smallCell" prop="deleted" sort export :placeholder="getTranslation('I00.00026750', 'Deprecated')">{{ getTranslation('I00.00026750', 'Deprecated') }}</Th>
				<Th class="IconColumn" prop="trafficLightStatusName" name="trafficLightStatusName" sort :export="trafficLightStatusName" v-if="!appSettings.hideTrafficLight">{{ getTranslation('I00.00049950', 'Trafic lights') }}</Th>
			</tr>
			<tr class="secondHead">
				<Th class="iconCol skipForSorting skipColumn ignoreInExportToExcel"></Th>
				<Th class="prodNo" :prop="getCasNumber" export :placeholder="getTranslation('I00.00011610', 'CAS-number') + ' / ' + getTranslation('I00.00020780', 'EG-number')">{{ getTranslation('I00.00011610', 'CAS-number') + ' / ' + getTranslation('I00.00020780', 'EG-number') }}</Th>
				<Th class="prodName" :prop="getCasName" export :placeholder="getTranslation('I00.00011590', 'Substance')">{{ getTranslation('I00.00011590', 'Substance') }}</Th>
				<Th class="consume" :prop="getSubstanceProperty('precentage')" export :placeholder="getTranslation('I00.00011600', 'Percentage')">{{ getTranslation('I00.00011600', 'Percentage') }}</Th>
				<Th class="consume" :prop="getSubstancePropertyValue('participation')" export :placeholder="getTranslation('I00.00005480', 'Annual consumption')">{{ getTranslation('I00.00005480', 'Annual consumption') }}</Th>
				<Th :prop="getSubstancePropertyUnit('participation')" v-show="false" export :placeholder="getTranslation('I00.00027360', 'Unit')">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="w-15" :prop="getSubstanceProperty('rcodes')" export :placeholder="getTranslation('I00.00025440', 'Haz statements / R-codes')">{{ getTranslation('I00.00025440', 'Haz statements / R-codes') }}</Th>
				<Th class="w-15" :prop="getSubstanceProperty('scodes')" export :placeholder="getTranslation('I00.00025450', 'Pre statements / S-codes')">{{ getTranslation('I00.00025450', 'Pre statements / S-codes') }}</Th>
				<Th class="prodNo smallCell skipForSorting" :prop="getSubstanceProperty('additionalData1')" export :placeholder="getReachText()">{{ getReachText() }}</Th>
				<Th class="prodNo smallCell skipForSorting" :prop="getSubstanceProperty('additionalData2')" export :placeholder="getAdditionalHeaderText('additionalData2')">{{ getAdditionalHeaderText('additionalData2') }}</Th>
				<Th class="prodNo smallCell skipForSorting" :prop="getSubstanceProperty('additionalData3')" export :placeholder="getAdditionalHeaderText('additionalData3')">{{ getAdditionalHeaderText('additionalData3') }}</Th>
				<Th class="skipForSorting" v-if="isGerman"></Th>
				<Th class="skipForSorting" v-if="isGerman"></Th>
				<Th class="skipForSorting"></Th>
			</tr>
		</template>
		<template #body="product">
			<tr class="productRow">
				<td class="iconColumn hideOnPrint">
					<img class="iconSizeSmall" :src="appSettings.imageFolder + product.item.iconLink" :title="product.item.iconTitle" alt="" />
				</td>
				<td class="prodNo">
					<a :href="product.item.linkToISafe">{{ product.item.artNum }}</a>
				</td>
				<td class="prodName">
					<a :href="product.item.linkToISafe">{{ product.item.name }}</a>
				</td>
				<td class="prodNo">{{ product.item.productType }}</td>
				<td class="consume">
					<p v-for="(arr, ind) in product.item.consumption" :key="ind">
						<span class="consume">{{ arr.value }}</span>
						<span class="noWrap">{{ arr.unit }}</span>
					</p>
				</td>
				<td class="w-15">{{ product.item.rcodes }}</td>
				<td class="w-15">{{ product.item.scodes }}</td>
				<td class="dangerSymbol">
					<DangerSymbols :dat="getDangerSymbols(product.item)" />
				</td>
				<td class="wp-110">{{ product.item.faroKlass }}</td>
				<td class="statusCell" v-if="isGerman">{{ product.item.wasserKlass }}</td>
				<td class="statusCell" v-if="isGerman">{{ product.item.ewc }}</td>
				<td class="prodNo smallCell">{{ product.item.deleted }}</td>
				<td class="IconColumn" v-if="!appSettings.hideTrafficLight">
					<span class="trafficLight middled" :class="product.item.trafficLightStatusClass" :title="product.item.trafficLightStatusName"></span>
				</td>
			</tr>
			<tr v-for="(substance, index) in product.item.substances" :key="product.index + '' + index + product.item.prodID + substance.casID">
				<td class="iconColumn hideOnPrint"><span class="casIcon"></span></td>
				<td class="prodNo">
					<div>{{ substance.casNumber }}</div>
					<div>{{ substance.egnumber }}</div>
				</td>
				<td class="prodName">{{ substance.casName }}</td>
				<td class="consume">{{ substance.precentage }}</td>
				<td class="consume">
					<p v-for="(arr, ind) in substance.participation" :key="ind">
						<span class="consume">{{ arr.value }}</span>
						<span class="noWrap">{{ arr.unit }}</span>
					</p>
				</td>
				<td class="w-15">{{ substance.rcodes }}</td>
				<td class="w-15">{{ substance.scodes }}</td>
				<td class="prodNo smallCell">{{ substance.additionalData1 }}</td>
				<td class="prodNo smallCell">{{ substance.additionalData2 }}</td>
				<td class="prodNo smallCell">{{ substance.additionalData3 }}</td>
				<td class="wp-110" v-if="isGerman">&nbsp;</td>
				<td class="wp-110" v-if="isGerman">&nbsp;</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
import { getDangerSymbols } from '../../../libraries/reports_v3';
import { genericDangerSymbolsResult } from '../../../libraries/exportToExcel_v3';
import DangerSymbols from '../../../components/riskAssessment/DangerSymbols';
import DataTable from '../../common/dataTable/DataTable_v3'
import Th from '../../common/dataTable/Th_v3';

export default {
  components: {
    DangerSymbols,
    DataTable,
    Th
  },
  props: ['data', 'title', 'excelTitle', 'customFieldsTitles', 'perPage', 'orgId'],
  computed: {
    isGerman() {
      return this.appSettings.orgProdListLawOtherCountry == 'German';
    },
  },
  methods: {
    getValueUnits: (prop) => (product) => (product[prop] || []).map((f) => (f.value + '') + (f.unit || '')).join('\n'),
    getValues: prop => product => product[prop].map(f => f.value).join('\n'),
    getUnits: prop => product => product[prop].map(f => f.unit).join('\n'),
    getReachText() {
      var translator = {
        german: 'Annex XVII',
        danish: 'LOUS',
        'non eu': 'SIN'
      };
      return translator[this.appSettings.orgProdListLawOtherCountry.toLowerCase()] || this.getTranslation('I00.00014460', 'REACH');
    },
    getCasNumber(product) {
      return product.substances.map(f => f.casNumber + '/' + f.egnumber);
    },
    getCasName(product) {
      return product.substances.map(f => f.casName);
    },
    getSubstanceProperty: prop => product => product.substances.map(f => f[prop]),
    getSubstancePropertyValue: prop => product => product.substances.map(f => f[prop].map(g => g.value).join('\n')),
    getSubstancePropertyUnit: prop => product => product.substances.map(f => f[prop].map(g => g.unit).join('\n')),
    imageResult(product) {
      return genericDangerSymbolsResult(["vattenfallDangerSymbols", "oldLawNotVattenfallDangerSymbols", "newLawDangerSymbols"], this.getDangerSymbols(product));
    },
    getAdditionalHeaderText(prop) {
      var translator = {
        german: {
          additionalData2: 'SVHC',
          additionalData3: 'ChemVerbotsV',
        },
        danish: {
          additionalData2: 'Græns',
          additionalData3: 'Vand',
        },
        'non eu': {
          additionalData2: this.getTranslation('I00.00046390', 'CMR list'),
          additionalData3: this.getTranslation('I00.00048320', 'Allergens list'),
        },
        default: {
          additionalData2: 'SVHC',
          additionalData3: this.getTranslation('I00.00011630', 'Water framework directive'),
        }
      };
      return (translator[this.appSettings.orgProdListLawOtherCountry.toLowerCase()] || {})[prop] || translator['default'][prop];
    },
    trafficLightStatusName(item) {
      return item.trafficLightStatusName;
    },
    getDangerSymbols
  }
};
</script>