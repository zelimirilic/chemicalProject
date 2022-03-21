<template>
	<DataTable :tableData="cloneData || currentData" :orgId="orgId" :perPage="perPage" :title="title" :selectFilterProps="['pictograms', 'sdsdocLanguage', 'usageAmount', 'trafficLightStatusName']" @filteredTableData="setFilteredData" :selectFilterValues="filteredDataValues" :excelTitle="excelTitle" @update:per-page="$emit('update:per-page', $event)" :hiddenColumns="appSettings.useReportsAdditionalColumns && hiddenColumns" @hide-columns="$emit('hide-columns', $event)" :edit="cloneData != null" @[eventEdit]="showEdit" @cancel="cloneData = null" @save="save" showHeadersWhenEmpty>
		<template #head>
			<tr>
				<Th class="IconColumn skipForSorting skipColumn ignoreInExportToExcel" name="icon"></Th>
				<Th class="prodNo" prop="artNum" name="artNum" sort export :placeholder="getTranslation('I00.00002880', 'Prod. No.')">{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="prodName" prop="name" name="name" sort export defaultSort :placeholder="getTranslation('I00.00004270', 'Name')">{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="consume" :prop="getValueUnits('usage')" name="usage" :sort="getValues('usage')" :export="getValues('usage')" :placeholder="getTranslation('I00.00012480', 'Annual consumption')">{{ getTranslation('I00.00012480', 'Annual consumption') }}</Th>
				<Th :export="getUnits('usage')" name="usage" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="supplier" prop="supplier" name="supplier" sort export :placeholder="getTranslation('I00.00004110', 'Supplier')">{{ getTranslation('I00.00004110', 'Supplier') }}</Th>
				<Th class="consume" :prop="getValueUnits('storage')" name="storage" :sort="getValues('storage')" :export="getValues('storage')" :placeholder="getTranslation('I00.00009610', 'Storage')">{{ getTranslation('I00.00009610', 'Storage') }}</Th>
				<Th :export="getUnits('storage')" name="storage" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="wp-100" prop="lists" name="lists" sort export :placeholder="getTranslation('I00.00004130', 'Lists')">{{ getTranslation('I00.00004130', 'Lists') }}</Th>
				<Th class="dangerSymbol" sort>{{ getTranslation('I00.00006610', 'Danger symbols') }}</Th>
				<Th class="dangerSymbol" :export="imageResult" name="dangerSymbols" v-show="false">{{ getTranslation('I00.00006610', 'Danger symbols') }}</Th>
				<Th class="wp-110" prop="faroKlass" name="faroKlass" sort export="faroKlass" :excelTitle="getTranslation('I00.00014470', 'Clasification')" :placeholder="getTranslation('I00.00014470', 'Clasification')">{{ getTranslation('I00.00014470', 'Clasification') }}</Th>
				<Th class="wp-110" prop="rcodes" name="rcodes" sort export :placeholder="getTranslation('I00.00025440', 'R Codes')">{{ getTranslation('I00.00025440', 'R Codes') }}</Th>
				<Th class="wp-110" prop="scodes" name="scodes" sort export :placeholder="getTranslation('I00.00025450', 'S Codes')">{{ getTranslation('I00.00025450', 'S Codes') }}</Th>
				<Th class="wp-110" prop="medical" name="medical" v-if="appSettings.riskAssesmentMedicalProducts" sort export :placeholder="getTranslation('I00.00049040', 'Medical product')">{{ getTranslation('I00.00049040', 'Medical product') }}</Th>
				<Th class="wp-110" prop="customField1" name="customField1" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && !isNullOrEmpty(customFieldTitles['customFieldTitle1'])" sort export :placeholder="customFieldTitles['customFieldTitle1']">{{ customFieldTitles['customFieldTitle1'] }}</Th>
				<Th class="wp-110" prop="customField2" name="customField2" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && !isNullOrEmpty(customFieldTitles['customFieldTitle2'])" sort export :placeholder="customFieldTitles['customFieldTitle2']">{{ customFieldTitles['customFieldTitle2'] }}</Th>
				<Th class="wp-110" prop="customField3" name="customField3" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && !isNullOrEmpty(customFieldTitles['customFieldTitle3'])" sort export :placeholder="customFieldTitles['customFieldTitle3']">{{ customFieldTitles['customFieldTitle3'] }}</Th>
				<Th class="wp-110" prop="customField4" name="customField4" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && appSettings.enableExtendedCustomFields && !isNullOrEmpty(customFieldTitles['customFieldTitle4'])" sort export :placeholder="customFieldTitles['customFieldTitle4']">{{ customFieldTitles['customFieldTitle4'] }}</Th>
				<Th class="wp-110" prop="customField5" name="customField5" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && appSettings.enableExtendedCustomFields && !isNullOrEmpty(customFieldTitles['customFieldTitle5'])" sort export :placeholder="customFieldTitles['customFieldTitle5']">{{ customFieldTitles['customFieldTitle5'] }}</Th>
				<Th class="wp-110" prop="customField6" name="customField6" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && appSettings.enableExtendedCustomFields && !isNullOrEmpty(customFieldTitles['customFieldTitle6'])" sort export :placeholder="customFieldTitles['customFieldTitle6']">{{ customFieldTitles['customFieldTitle6'] }}</Th>
				<Th class="wp-110" prop="customField7" name="customField7" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && appSettings.enableExtendedCustomFields && !isNullOrEmpty(customFieldTitles['customFieldTitle7'])" sort export :placeholder="customFieldTitles['customFieldTitle7']">{{ customFieldTitles['customFieldTitle7'] }}</Th>
				<Th class="wp-110" prop="customField8" name="customField8" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && appSettings.enableExtendedCustomFields && !isNullOrEmpty(customFieldTitles['customFieldTitle8'])" sort export :placeholder="customFieldTitles['customFieldTitle8']">{{ customFieldTitles['customFieldTitle8'] }}</Th>
				<Th class="wp-110" prop="customField9" name="customField9" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && appSettings.enableExtendedCustomFields && !isNullOrEmpty(customFieldTitles['customFieldTitle9'])" sort export :placeholder="customFieldTitles['customFieldTitle9']">{{ customFieldTitles['customFieldTitle9'] }}</Th>
				<Th class="wp-110" prop="customField10" name="customField10" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && appSettings.enableExtendedCustomFields && !isNullOrEmpty(customFieldTitles['customFieldTitle10'])" sort export :placeholder="customFieldTitles['customFieldTitle10']">{{ customFieldTitles['customFieldTitle10'] }}</Th>
				<Th class="smallDate" prop="sdsDate" name="sdsDate" sort export :placeholder="getTranslation('I00.00018150', 'SDS Date')">{{ getTranslation('I00.00018150', 'SDS Date') }}</Th>
				<Th class="statusCell" prop="status" name="status" v-if="appSettings.orgProdListCompleteForRegister" sort export :placeholder="getTranslation('I00.00018160', 'Status')">{{ getTranslation('I00.00018160', 'Status') }}</Th>
				<Th class="smallDate" prop="controlDate" name="controlDate" v-if="appSettings.orgProdListCompleteForRegister" sort export :placeholder="getTranslation('I00.00018140', 'SDS Checked')">{{ getTranslation('I00.00018140', 'SDS Checked') }}</Th>
				<Th class="IconColumn" prop="trafficLightStatusName" name="trafficLightStatusName" sort :export="trafficLightStatusName" v-if="!appSettings.hideTrafficLight" :placeholder="getTranslation('I00.00049950', 'Trafic lights')">{{ getTranslation('I00.00049950', 'Trafic lights') }}</Th>
				<Th class="IconColumn hideOnPrint" name="sds" export>{{ getTranslation('I00.00005280', 'SDS') }}</Th>
				<Th :class="columnsTranslator(column.type).class" :prop="getColumnName(column)" :name="getColumnName(column)" :placeholder="getTranslation(column.columnPhrase, column.columnPhrase)" :sort="columnsTranslator(column.type).sort(getColumnName(column))" :export="exportAdditionalColumn(column.type, getColumnName(column))" :key="column.columnPhraseId" v-for="column in parsedSelectedColumns" v-show="!column.addedManually">
					{{ getTranslation(column.columnPhrase, column.columnPhrase) }}
				</Th>
			</tr>
		</template>
		<template #body="product">
			<tr>
				<td class="IconColumn hideOnPrint">
					<div class="xsBottomPadding" :class="product.item.icon" :title="product.item.iconTitle">
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
					<p class="row no-gutters" v-for="(arr, ind) in product.item.usage" :key="ind">
						<span class="col-xl-8 col-6 pr-1 text-right">{{ arr.value }}</span>
						<span class="col-xl-4 col-6 noWrap">{{ arr.unit }}</span>
					</p>
				</td>
				<td class="supplier">
					<a :href="product.item.linkToSupplier">
						<span>{{ product.item.supplier }}</span>
					</a>
				</td>
				<td class="consume">
					<p class="row no-gutters" v-for="(arr, ind) in product.item.storage" :key="ind">
						<span class="col-xl-8 col-6 pr-1 text-right">{{ arr.value }}</span>
						<span class="col-xl-4 col-6 noWrap">{{ arr.unit }}</span>
					</p>
				</td>
				<td class="wp-100">
					{{ product.item.lists }}
				</td>
				<td class="dangerSymbol">
					<DangerSymbols :dat="getDangerSymbols(product.item)" />
				</td>
				<td class="wp-110">
					{{ product.item.faroKlass }}
				</td>
				<td class="wp-110">
					{{ product.item.rcodes }}
				</td>
				<td class="wp-110">
					{{ product.item.scodes }}
				</td>
				<td class="statusCell" v-if="appSettings.riskAssesmentMedicalProducts">
					{{ product.item.medical }}
				</td>
				<td class="wp-110" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && !isNullOrEmpty(customFieldTitles['customFieldTitle1'])">
					{{ product.item.customField1 }}
				</td>
				<td class="wp-110" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && !isNullOrEmpty(customFieldTitles['customFieldTitle2'])">
					{{ product.item.customField2 }}
				</td>
				<td class="wp-110" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && !isNullOrEmpty(customFieldTitles['customFieldTitle3'])">
					{{ product.item.customField3 }}
				</td>
				<td class="wp-110" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && appSettings.enableExtendedCustomFields && !isNullOrEmpty(customFieldTitles['customFieldTitle4'])">
					{{ product.item.customField4 }}
				</td>
				<td class="wp-110" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && appSettings.enableExtendedCustomFields && !isNullOrEmpty(customFieldTitles['customFieldTitle5'])">
					{{ product.item.customField5 }}
				</td>
				<td class="wp-110" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && appSettings.enableExtendedCustomFields && !isNullOrEmpty(customFieldTitles['customFieldTitle6'])">
					{{ product.item.customField6 }}
				</td>
				<td class="wp-110" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && appSettings.enableExtendedCustomFields && !isNullOrEmpty(customFieldTitles['customFieldTitle7'])">
					{{ product.item.customField7 }}
				</td>
				<td class="wp-110" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && appSettings.enableExtendedCustomFields && !isNullOrEmpty(customFieldTitles['customFieldTitle8'])">
					{{ product.item.customField8 }}
				</td>
				<td class="wp-110" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && appSettings.enableExtendedCustomFields && !isNullOrEmpty(customFieldTitles['customFieldTitle9'])">
					{{ product.item.customField9 }}
				</td>
				<td class="wp-110" v-if="appSettings.showCustomFieldsOnOrgProdListComplete && appSettings.enableExtendedCustomFields && !isNullOrEmpty(customFieldTitles['customFieldTitle10'])">
					{{ product.item.customField10 }}
				</td>
				<td class="smallDate noWrap">
					{{ product.item.sdsDate }}
				</td>
				<td class="statusCell" v-if="appSettings.orgProdListCompleteForRegister">
					{{ product.item.status }}
				</td>
				<td class="smallDate noWrap" v-if="appSettings.orgProdListCompleteForRegister">
					{{ product.item.controlDate }}
				</td>
				<td class="IconColumn" v-if="!appSettings.hideTrafficLight">
					<span class="trafficLight middled" :class="product.item.trafficLightStatusClass" :title="product.item.trafficLightStatusName"></span>
				</td>
				<td class="IconColumn hideOnPrint">
					<a class="msdsIcon" :href="product.item.linkToSDS"></a>
				</td>
				<AdditionalCell :type="column.type" :departmentValue="product.item.additionalData[getColumnName(column, '_DepartmentOwnFields')]" v-model="product.item.additionalData[getColumnName(column)]" :edit="cloneData && column.ownField" v-for="column in parsedSelectedColumns" :key="column.columnPhraseId" v-show="!column.addedManually" />
			</tr>
		</template>
	</DataTable>
</template>

<script>

import DangerSymbols from '../../../components/riskAssessment/DangerSymbols';
import DataTable from '../../common/dataTable/DataTable_v3'
import Th from '../../common/dataTable/Th_v3';
import AdditionalCell from '../components/AdditionalCell_v3';
import { genericDangerSymbolsResult } from '../../../libraries/exportToExcel_v3';
import { columnsTranslator, parseSelectedColumns, getDangerSymbols, getProp, saveReportData } from '../../../libraries/reports_v3';
import { deepClone, hashCode, isNullOrEmpty } from '../../../libraries/common_v3';

export default {
  components: {
    AdditionalCell,
    DataTable,
    Th,
    DangerSymbols
  },
  props: ['data', 'title', 'excelTitle', 'customFieldTitles', 'selectedColumns', 'hiddenColumns', 'canEdit', 'perPage', 'orgId'],
  data() {
    return {
      currentData: this.data.map(f => ({ ...f, hashCode: () => hashCode(f) })),
      cloneData: null,
      filteredDataValues: null,
    }
  },
  methods: {
    columnsTranslator: columnsTranslator,
    deepClone,
    getProp: getProp,
    isNullOrEmpty,
    getDangerSymbols: getDangerSymbols,
    save: saveReportData,
    showEdit() {
      this.cloneData = deepClone(this.currentData).map((f, ind) => ({ ...f, originalData: () => this.currentData[ind] }));
    },
    getValueUnits: (prop) => (product) => (product[prop] || []).map((f) => (f.value + '') + (f.unit || '')).join('\n'),
    getValues: prop => product => product[prop].map(f => f.value).join('\n'),
    getUnits: prop => product => product[prop].map(f => f.unit).join('\n'),
    getColumnName(column, sufixName) {
      var text = column.ownField ? "ownField_" + (column.fieldId == null ? column.id : column.fieldId) + (sufixName != null ? sufixName : "") : this.getProp(this.columnsTranslator(column.type).prop(column.name), column.name);
      return text
    },
    exportAdditionalColumn(type, name) {
      return this.columnsTranslator(type).export(name)
    },
    trafficLightStatusName(item) {
      return item.trafficLightStatusName;
    },
    imageResult(product) {
      return genericDangerSymbolsResult(['vattenfallDangerSymbols', 'oldLawNotVattenfallDangerSymbols', 'newLawDangerSymbols'], this.getDangerSymbols(product));
    },
    setFilteredData(items) {
      var allSymbols = this.appSettings.allSymbols;
      this.filteredDataValues = items ? {
        sdsdocLanguage: [...new Set([""].pushMany(items.filter(x => x.additionalData && x.additionalData.sdsdocLanguage).map(x => x.additionalData && x.additionalData.sdsdocLanguage)))].sort(),
        pictograms: [...new Set([""].pushMany(items.filter(o => o.additionalData && o.additionalData.pictograms).mapMany(o => o.additionalData.pictograms.map(x => x.value.toLowerCase())).map(f => (allSymbols.find(x => x.possibleNames.any(y => y == f)) || {}).descriptionTranslation)))].sort(),
        usageAmount: [...new Set([""].pushMany(items.filter(o => o.additionalData && o.additionalData.usageAmount).mapMany(o => o.additionalData.usageAmount.map(x => x.value.split('.').first() + x.unit))))].sort(),
        trafficLightStatusName: [...new Set([""].pushMany(items.filter(o => o.trafficLightStatusName).map(o => o.trafficLightStatusName)))].sort()
      } : [];
    }
  },
  computed: {
    parsedSelectedColumns() {
      return parseSelectedColumns(this.selectedColumns);
    },
    eventEdit() {
      return this.canEdit ? 'edit' : null;
    }
  }
};
</script>