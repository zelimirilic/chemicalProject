<template>
	<DataTable :tableData="cloneData || currentData" :orgId="orgId" :perPage="perPage" :title="title" :selectFilterProps="['pictograms', 'sdsdocLanguage', 'usageAmount', 'trafficLightStatusName']" @filteredTableData="setFilteredData" :selectFilterValues="filteredDataValues" :excelTitle="excelTitle" @update:per-page="$emit('update:per-page', $event)" :hiddenColumns="appSettings.useReportsAdditionalColumns && hiddenColumns" @hide-columns="$emit('hide-columns', $event)" :edit="cloneData != null" @[eventEdit]="showEdit" @cancel="cloneData = null" @save="save" showHeadersWhenEmpty>
		<template #head>
			<tr>
				<Th class="IconColumn skipForSorting skipColumn ignoreInExportToExcel" name="icon"></Th>
				<Th class="prodNo" prop="artNum" name="artNum" sort export :placeholder="getTranslation('I00.00002880', 'Prod. No.')">{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="prodName" prop="name" name="name" sort export :placeholder="getTranslation('I00.00004270', 'Name')">{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th v-if="isPerDepartments" :prop="(f) => getOrganisationName(f)" name="departmentPath" sort defaultSort="desc" :placeholder="getTranslation('I00.00002940', 'Department')" :export="(f) => getOrganisationPathValues(f)">{{ getTranslation('I00.00002940', 'Department') }}</Th>
				<Th class="supplier" prop="supplier" name="supplier" sort export :placeholder="getTranslation('I00.00004110', 'Supplier')">{{ getTranslation('I00.00004110', 'Supplier') }}</Th>
				<Th class="prodNo" prop="un" name="un" sort export :placeholder="getTranslation('I00.00015630', 'UN')">{{ getTranslation('I00.00015630', 'UN') }}</Th>
				<Th class="wp-110" prop="packagingGroup" name="packagingGroup" sort export :placeholder="getTranslation('I00.00015640', 'Packaging Group')">{{ getTranslation('I00.00015640', 'Packaging Group') }}</Th>
				<Th class="wp-110" prop="adrclass" name="adrclass" sort export :placeholder="getTranslation('I00.00015650', 'ADR Class')">{{ getTranslation('I00.00015650', 'ADR Class') }}</Th>
				<Th class="IconColumn" prop="trafficLightStatusName" name="trafficLightStatusName" sort :export="trafficLightStatusName" v-if="!appSettings.hideTrafficLight" :placeholder="getTranslation('I00.00049950', 'Trafic lights')">{{ getTranslation('I00.00049950', 'Trafic lights') }}</Th>
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
				<td v-if="isPerDepartments">
					<span :title="product.item.departmentInfo.departmentPath">{{ product.item.departmentInfo.tableName }}</span>
				</td>
				<td class="supplier">
					<a :href="product.item.linkToSupplier">
						<span>{{ product.item.supplier }}</span>
					</a>
				</td>
				<td class="prodNo">
					{{ product.item.un }}
				</td>
				<td class="wp-110 text-center">
					{{ product.item.packagingGroup }}
				</td>
				<td class="wp-110 text-center">
					{{ product.item.adrclass }}
				</td>
				<td class="IconColumn" v-if="!appSettings.hideTrafficLight">
					<span class="trafficLight middled" :class="product.item.trafficLightStatusClass" :title="product.item.trafficLightStatusName"></span>
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
import DataTable from '../../common/dataTable/DataTable_v3';
import { parseSelectedColumns, getProp, columnsTranslator, saveReportData, getOrganisationPathValues, getOrganisationName } from '../../../libraries/reports_v3';
import AdditionalCell from '../components/AdditionalCell_v3';
import Th from '../../common/dataTable/Th_v3';
import { deepClone, hashCode } from '../../../libraries/common_v3';

export default {
  components: {
    AdditionalCell,
    DataTable,
    Th
  },
  props: ['data', 'title', 'excelTitle', 'selectedColumns', 'hiddenColumns', 'canEdit', 'perPage', 'orgId'],
  data() {
    return {
      currentData: this.data.map(f => ({ ...f, hashCode: () => hashCode(f) })),
      cloneData: null,
      filteredDataValues: null,
      isPerDepartments: this.data.find(x => x.departmentInfo)
    }
  },
  methods: {
    columnsTranslator: columnsTranslator,
    getProp: getProp,
    deepClone,
    save: saveReportData,
    getOrganisationPathValues: getOrganisationPathValues,
    getOrganisationName: getOrganisationName,
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
    trafficLightStatusName(item) {
      return item.trafficLightStatusName;
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
