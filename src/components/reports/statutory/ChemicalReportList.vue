<template>
	<DataTable :tableData="data" :perPage="perPage" @update:per-page="$emit('update:per-page', $event)" :title="title" ref="dt" exportHeader :excelTitle="excelTitle" showHeadersWhenEmpty>
		<template #head>
			<tr>
				<!--Th class="iconCol skipForSorting skipColumn ignoreInExportToExcel"></Th-->
				<Th class="prodNo" prop="artNum" sort export>{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="prodName" prop="name" sort export defaultSort>{{ getTranslation('I00.00033260', 'Current tradename') }}</Th>
				<Th v-if="isPerDepartments" :prop="(f) => getOrganisationName(f)" name="departmentPath" sort :export="(f) => getOrganisationPathValues(f)" defaultSort="desc">{{ getTranslation('I00.00002940', 'Department') }}</Th>
				<Th class="prodNo smallCell" prop="productType" sort export>{{ getTranslation('I00.00012550', 'Product type') }}</Th>
				<Th class="consume" :prop="getValueUnits('consumption')" :sort="getValues('consumption')" :export="getValues('consumption')">{{ getTranslation('I00.00005480', 'Annual consumption') }}</Th>
				<Th :export="getUnits('consumption')" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="symbols" prop="faroKlass" sort export :excelTitle="getTranslation('I00.00014470', 'Clasification')">{{ getTranslation('I00.00014470', 'Clasification') + ' / ' + getTranslation('I00.00006610', 'Danger symbols') }}</Th>
				<Th :export="imageResult" v-show="false">{{ getTranslation('I00.00006610', 'Danger symbols') }}</Th>
				<Th class="w-15" prop="rcodes" sort export>{{ getTranslation('I00.00025440', 'Haz statements / R-codes') }}</Th>
				<Th class="w-15" prop="scodes" sort export>{{ getTranslation('I00.00025450', 'Pre statements / S-codes') }}</Th>
				<Th class="statusCell" prop="wasserKlass" sort export v-if="isGerman">{{ getTranslation('I00.00014630', 'Water class') }}</Th>
				<Th class="statusCell" prop="ewc" sort export v-if="isGerman">EWC</Th>
				<Th class="prodNo smallCell" prop="deleted" sort export>{{ getTranslation('I00.00026750', 'Deprecated') }}</Th>
				<Th class="prodNo smallCell skipForSorting">&nbsp;</Th>
			</tr>
			<tr class="secondHead">
				<!--Th class="iconCol skipForSorting skipColumn ignoreInExportToExcel"></Th-->
				<Th class="prodNo" :prop="getCasNumber" export>{{ getTranslation('I00.00011610', 'CAS-number') + ' / ' + getTranslation('I00.00020780', 'EG-number') }}</Th>
				<Th class="prodName" :prop="getCasName" export>{{ getTranslation('I00.00011590', 'Substance') + ' / ' + getReachText() }}</Th>
				<Th class="skipForSorting" v-if="isPerDepartments"></Th>
				<Th class="consume" :prop="getSubstanceProperty('precentage')" export>{{ '%' }}</Th>
				<Th class="consume" :prop="getSubstancePropertyValue('participation')" export>{{ getTranslation('I00.00005480', 'Annual consumption') }}</Th>
				<Th :prop="getSubstancePropertyUnit('participation')" v-show="false" export>{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="skipForSorting"></Th>
				<Th v-show="false"></Th>
				<Th class="w-15" :prop="getSubstanceProperty('rcodes')" export>{{ getTranslation('I00.00025440', 'Haz statements / R-codes') }}</Th>
				<Th class="w-15" :prop="getSubstanceProperty('scodes')" export>{{ getTranslation('I00.00025450', 'Pre statements / S-codes') }}</Th>
				<Th class="prodNo smallCell skipForSorting" :prop="getSubstanceProperty('additionalData2')" export>{{ getAdditionalHeaderText('additionalData2') }}</Th>
				<Th class="prodNo smallCell skipForSorting" :prop="getSubstanceProperty('additionalData3')" export>{{ getAdditionalHeaderText('additionalData3') }}</Th>
				<Th class="skipForSorting" v-if="isGerman"></Th>
				<Th class="skipForSorting" v-if="isGerman"></Th>
			</tr>
		</template>
		<template #body="product">
			<tr class="productRow">
				<!--td class="iconCol hideOnPrint">
					<span class="status" :class="product.item.icon" :title="product.item.iconTitle"></span>
				</td-->
				<td class="prodNo">
					<p v-if="isLocalID(createProdId(product.item))" class="mb-1">&nbsp;</p>
					<p class="mb-0">
						<router-link :to="`/product/${product.item.prodID}_${product.item.prodID_mdbID}`">
							<span>{{ product.item.artNum }}</span>
						</router-link>
					</p>
				</td>
				<td class="prodName">
					<p v-if="isLocalID(createProdId(product.item))" class="tag mb-1">{{ getTranslation('I00.00050300', 'Own product') }}</p>
					<p class="mb-0">
						<router-link :to="`/product/${product.item.prodID}_${product.item.prodID_mdbID}`">{{ product.item.name }}</router-link>
					</p>
				</td>
				<td v-if="isPerDepartments">
					<span :title="product.item.departmentInfo.departmentPath">{{ product.item.departmentInfo.tableName }}</span>
				</td>
				<td class="prodNo">{{ product.item.productType }}</td>
				<td class="statusCell" v-if="isGerman">{{ product.item.wasserKlass }}</td>
				<td class="consume">
					<p v-for="(arr, ind) in product.item.consumption" :key="ind">
						<span class="consume">{{ arr.value }}</span>
						<span class="noWrap">{{ arr.unit }}</span>
					</p>
				</td>

				<td class="symbols">
					<div class="symbolClass">{{ product.item.faroKlass }}</div>
					<DangerSymbols :dat="getDangerSymbols(product.item)" />
				</td>
				<td class="w-15">{{ product.item.rcodes }}</td>
				<td class="w-15">{{ product.item.scodes }}</td>
				<td class="statusCell" v-if="isGerman">{{ product.item.ewc }}</td>
				<td class="prodNo smallCell">{{ product.item.deleted }}</td>
				<td class="prodNo smallCell">&nbsp;</td>
			</tr>
			<tr v-for="(substance, index) in product.item.substances" :key="product.index + '' + index + product.item.prodID + substance.casID">
				<!--td class="iconCol hideOnPrint"></td-->
				<td class="prodNo">
					<div>{{ substance.casNumber }}</div>
					<div>{{ substance.egnumber }}</div>
				</td>
				<td class="prodName">
					<div>{{ substance.casName }}</div>
					<div>{{ getReachText() + ': ' + substance.additionalData1 }}</div>
				</td>
				<td v-if="isPerDepartments">&nbsp;</td>
				<td class="consume">{{ substance.precentage }}</td>
				<td class="consume">
					<p v-for="(arr, ind) in substance.participation" :key="ind">
						<span class="consume">{{ arr.value }}</span>
						<span class="noWrap">{{ arr.unit }}</span>
					</p>
				</td>
				<td class="symbols">&nbsp;</td>
				<td class="w-15">{{ substance.rcodes }}</td>
				<td class="w-15">{{ substance.scodes }}</td>
				<td class="prodNo smallCell">{{ substance.additionalData2 }}</td>
				<td class="prodNo smallCell">{{ substance.additionalData3 }}</td>
				<td class="wp-110" v-if="isGerman">&nbsp;</td>
				<td class="wp-110" v-if="isGerman">&nbsp;</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
import { getDangerSymbols } from '../../../libraries/reports';
import { genericDangerSymbolsResult } from '../../../libraries/exportToExcel';
import DangerSymbols from '../../../components/riskAssessment/DangerSymbols';
import { isLocalID } from '../../../libraries/common';
import { getOrganisationPathValues, getOrganisationName } from '../../../libraries/reports';

export default {
  components: {
    DangerSymbols
  },
  props: ['data', 'title', 'excelTitle', 'customFieldsTitles', 'perPage'],
  data() {
    return {
      isPerDepartments: this.data.find(x => x.departmentInfo),
    }
  },
  computed: {
    isGerman() {
      return this.appSettings.orgProdListLawOtherCountry == 'German';
    },
  },
  methods: {
    getOrganisationPathValues: getOrganisationPathValues,
    getOrganisationName: getOrganisationName,
    getValueUnits: (prop) => (product) => product[prop].map((f) => (f.value + '') + (f.unit || '')).join('\n'),
    getValues: prop => product => product[prop].map(f => f.value).join('\n'),
    getUnits: prop => product => product[prop].map(f => f.unit).join('\n'),
    getReachText() {
      var translator = {
        german: 'Annex XVII',
        danish: 'LOUS',
      };
      return translator[this.appSettings.orgProdListLawOtherCountry] || this.getTranslation('I00.00014460', 'REACH');
    },
    getCasNumber(product) {
      return product.substances.map(f => f.casNumber + '/' + f.egnumber);
    },
    getCasName(product) {
      return product.substances.map(f => f.casName + " / " + this.getReachText() + ": " + f.additionalData1);
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
        default: {
          additionalData2: this.getTranslation('I00.00010910', 'PRIO'),
          additionalData3: this.getTranslation('I00.00011630', 'Water framework directive'),
        }
      };
      return (translator[this.appSettings.orgProdListLawOtherCountry] || {})[prop] || translator['default'][prop];
    },
    createProdId(prod) {
      return { id: prod.prodID, id_mdbID: prod.prodID_mdbID };
    },
    getDangerSymbols,
    isLocalID,
  }
};
</script>