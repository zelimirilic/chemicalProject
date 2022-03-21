<template>
	<DataTable :tableData="cloneData || currentData" :orgId="orgId" :perPage="perPage" :title="title" :selectFilterProps="['pictograms', 'sdsdocLanguage', 'usageAmount']" @filteredTableData="setFilteredData" :selectFilterValues="filteredDataValues" :excelTitle="excelTitle" @update:per-page="$emit('update:per-page', $event)" :hiddenColumns="appSettings.useReportsAdditionalColumns && hiddenColumns" @hide-columns="$emit('hide-columns', $event)" :edit="cloneData != null" @[eventEdit]="showEdit" @cancel="cloneData = null" @save="save" showHeadersWhenEmpty>
		<template #head>
			<tr>
				<Th class="IconColumn skipForSorting skipColumn ignoreInExportToExcel" name="icon"></Th>
				<Th class="prodNo" prop="artNum" name="artNum" sort export :placeholder="getTranslation('I00.00002880', 'Prod. No.')">{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="prodName" prop="name" name="name" sort export defaultSort :placeholder="getTranslation('I00.00004270', 'Name')">{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="supplier" prop="supplier" name="supplier" sort export :placeholder="getTranslation('I00.00004110', 'Supplier')">{{ getTranslation('I00.00004110', 'Supplier') }}</Th>
				<Th class="consume" :prop="getValueUnits('consumption')" :sort="getValues('consumption')" :export="getValues('consumption')" :placeholder="getTranslation('I00.00005480', 'Annual consumption')">{{ getTranslation('I00.00005480', 'Annual consumption') }}</Th>
				<Th :export="getUnits('consumption')" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="consume" :prop="getValueUnits('storage')" name="storage" :sort="getValues('storage')" :export="getValues('storage')" :placeholder="getTranslation('I00.00009610', 'Storage')">{{ getTranslation('I00.00009610', 'Storage') }}</Th>
				<Th :export="getUnits('storage')" name="storage" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="prodNo" prop="ufiCode" name="ufiCode" sort export :placeholder="getTranslation('I00.00050690', 'Ufi Code')">{{ getTranslation('I00.00050690', 'Ufi Code') }}</Th>
				<Th class="prodName" prop="name" name="name" v-if="showCustomFieldName" sort export defaultSort :placeholder="getTranslation('I00.00004270', 'Name')">{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="IconColumn HideOnPrint" name="sds">{{ getTranslation('I00.00005280', 'SDS') }}</Th>
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
				<td class="supplier">
					{{ product.item.supplier }}
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
				<td class="prodNo">
					{{ product.item.ufiCode }}
				</td>
				<td v-if="showCustomFieldName">
					<span>{{ product.item.customFieldName }}</span>
				</td>
				<td class="iconCol hideOnPrint">
					<a class="msdsIcon" :href="product.item.linkToSDS"></a>
				</td>
				<AdditionalCell class="wrap" :type="column.type" :departmentValue="product.item.additionalData[getColumnName(column, '_DepartmentOwnFields')]" v-model="product.item.additionalData[getColumnName(column)]" :edit="cloneData && column.ownField" v-for="column in parsedSelectedColumns" :key="column.columnPhraseId" v-show="!column.addedManually" />
			</tr>
		</template>
	</DataTable>
</template>

<script>
import DataTable from '../../common/dataTable/DataTable_v3'
import { genericDangerSymbolsResult } from '../../../libraries/exportToExcel_v3';
import { getDangerSymbols, parseSelectedColumns, getProp, columnsTranslator, saveReportData } from '../../../libraries/reports_v3';
import AdditionalCell from '../components/AdditionalCell_v3';
import Th from '../../common/dataTable/Th_v3';
import { deepClone, hashCode } from '../../../libraries/common_v3';

export default {
  components: {
    AdditionalCell,
    DataTable,
    Th
  },
  props: ['data', 'showCustomFieldName', 'title', 'excelTitle', 'selectedColumns', 'hiddenColumns', 'canEdit', 'perPage', 'orgId'],
  data() {
    return {
      currentData: this.data.map(f => ({ ...f, hashCode: () => hashCode(f) })),
      cloneData: null,
      filteredDataValues: null,
    }
  },
  methods: {
    columnsTranslator: columnsTranslator,
    getProp: getProp,
    getValueUnits: (prop) => (product) => (product[prop] || []).map((f) => (f.value + '') + (f.unit || '')).join('\n'),
    getValues: prop => product => product[prop].map(f => f.value).join('\n'),
    getUnits: prop => product => product[prop].map(f => f.unit).join('\n'),
    getDangerSymbols: getDangerSymbols,
    deepClone,
    save: saveReportData,
    imageResult(product) {
      return genericDangerSymbolsResult(["vattenfallDangerSymbols", "oldLawNotVattenfallDangerSymbols", "newLawDangerSymbols"], this.getDangerSymbols(product));
    },
    exportAdditionalColumn(type, name) {
      return this.columnsTranslator(type).export(name)
    },
    showEdit() {
      this.cloneData = deepClone(this.currentData).map((f, ind) => ({ ...f, originalData: () => this.currentData[ind] }));
    },
    getColumnName(column, sufixName) {
      var text = column.ownField ? "ownField_" + (column.fieldId == null ? column.id : column.fieldId) + (sufixName != null ? sufixName : "") : this.getProp(this.columnsTranslator(column.type).prop(column.name), column.name);
      return text
    },
    setFilteredData(items) {
      var allSymbols = this.appSettings.allSymbols;
      this.filteredDataValues = items ? {
        sdsdocLanguage: [...new Set([""].pushMany(items.filter(x => x.additionalData && x.additionalData.sdsdocLanguage).map(x => x.additionalData && x.additionalData.sdsdocLanguage)))].sort(),
        pictograms: [...new Set([""].pushMany(items.filter(o => o.additionalData && o.additionalData.pictograms).mapMany(o => o.additionalData.pictograms.map(x => x.value.toLowerCase())).map(f => (allSymbols.find(x => x.possibleNames.any(y => y == f)) || {}).descriptionTranslation)))].sort(),
        usageAmount: [...new Set([""].pushMany(items.filter(o => o.additionalData && o.additionalData.usageAmount).mapMany(o => o.additionalData.usageAmount.map(x => x.value.split('.').first() + x.unit))))].sort()
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