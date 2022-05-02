<template>
	<SmallLoader v-if="isSaving" />
	<DataTable :tableData="cloneData || currentData" :orgId="orgId" :title="title" :selectFilterProps="['pictograms', 'sdsdocLanguage', 'usageAmount']" @filteredTableData="setFilteredData" @filterChanged="$emit('filter-status', $event)" :selectFilterValues="filteredDataValues" :customFilters="customFilters" :excelTitle="excelTitle" :hiddenColumns="appSettings.useReportsAdditionalColumns && hiddenColumns" @hide-columns="$emit('hide-columns', $event)" :edit="cloneData != null" @[eventEdit]="showEdit" @cancel="cloneData = null" @save="save" showHeadersWhenEmpty :perPage="perPage" @update:per-page="$emit('update:per-page', $event)" v-else>
		<template #head>
			<tr>
				<Th class="prodNo" prop="artNum" name="artNum" sort export>{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="prodName" prop="name" name="name" sort export>{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th v-if="isPerDepartments" :prop="(f)=> getOrganisationName(f)" name="departmentPath" sort :export="(f)=> getOrganisationPathValues(f)" defaultSort="desc">{{ getTranslation('I00.00002940', 'Department') }}</Th>
				<Th class="supplier" prop="supplier" name="supplier" sort export>{{ getTranslation('I00.00004110', 'Supplier') }}</Th>
				<Th class="prodNo" prop="un" name="un" sort export>{{ getTranslation('I00.00015630', 'UN') }}</Th>
				<Th class="wp-110" prop="packagingGroup" name="packagingGroup" sort export>{{ getTranslation('I00.00015640', 'Packaging Group') }}</Th>
				<Th class="wp-110" prop="adrclass" name="adrclass" sort export>{{ getTranslation('I00.00015650', 'ADR Class') }}</Th>
				<Th class="iconCol hideOnPrint" name="sds">{{ getTranslation('I00.00005280', 'SDS') }}</Th>
				<Th class="wrap" :class="columnsTranslator(column.type).class" :prop="getColumnName(column)" :name="getColumnName(column)" :sort="columnsTranslator(column.type).sort(getColumnName(column))" :export="exportAdditionalColumn(column.type, getColumnName(column))" :key="column.columnPhraseId" v-for="column in parsedSelectedColumns" v-show="!column.addedManually">
					{{ getTranslation(column.columnPhrase, column.columnPhrase) }}
				</Th>
			</tr>
		</template>
		<template #body="product">
			<tr>
				<td class="prodNo bold">
					<p v-if="isLocalID(product.item)" class="mb-1">&nbsp;</p>
					<p class="mb-0">
						<router-link :to="`/product/${product.item.id}_${product.item.id_mdbID}`">
							<span>{{ product.item.artNum }}</span>
						</router-link>
					</p>
				</td>
				<td class="prodName bold">
					<p v-if="isLocalID(product.item)" class="tag mb-1">{{ getTranslation('I00.00050300', 'Own product') }}</p>
					<p class="mb-0">
						<router-link :to="`/product/${product.item.id}_${product.item.id_mdbID}`">{{ product.item.name }}</router-link>
					</p>
				</td>
				<td v-if="isPerDepartments">
					<span :title="product.item.departmentInfo.departmentPath">{{ product.item.departmentInfo.tableName }}</span>
				</td>
				<td class="supplier">
					<span>{{ product.item.supplier }}</span>
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
				<td class="iconCol hideOnPrint">
					<A @click="getSds(product.item)"><span class="icon-sds"></span></A>
				</td>
				<AdditionalCell class="wrap" :type="column.type" :departmentValue="product.item.additionalData[getColumnName(column, '_DepartmentOwnFields')]" v-model="product.item.additionalData[getColumnName(column)]" :edit="cloneData && column.ownField" v-for="column in parsedSelectedColumns" :key="column.columnPhraseId" v-show="!column.addedManually" />
			</tr>
		</template>
	</DataTable>
</template>

<script>
import AdditionalCell from '../components/AdditionalCell';
	import { columnsTranslator, parseSelectedColumns, getSds, saveReportData, getProp, getOrganisationPathValues, getOrganisationName } from '../../../libraries/reports';
import { idToSlashedString, isLocalID, deepClone, hashCode } from '../../../libraries/common';

export default {
  components: {
    AdditionalCell,
  },
  props: ['data', 'title', 'excelTitle', 'customFieldsTitles', 'selectedColumns', 'hiddenColumns', 'canEdit', 'perPage', 'customFilters', 'orgId'],
  data() {
    return {
      currentData: this.data.map(f => ({ ...f, hashCode: () => hashCode(f) })),
      cloneData: null,
      isSaving: false,
		filteredDataValues: null,
		isPerDepartments: this.data.find(x => x.departmentInfo),
    }
  },
  methods: {
    columnsTranslator: columnsTranslator,
    getProp: getProp,
    idToSlashedString: idToSlashedString,
    getSds: getSds,
    isLocalID: isLocalID,
    deepClone,
    save: saveReportData,
    getOrganisationPathValues: getOrganisationPathValues,
    getOrganisationName: getOrganisationName,
    showEdit() {
      this.cloneData = deepClone(this.currentData).map((f, ind) => ({ ...f, originalData: () => this.currentData[ind] }));
    },
    getColumnName(column, sufixName) {
      var text = column.ownField ? "ownField_" + (column.fieldId == null ? column.id : column.fieldId) + (sufixName != null ? sufixName : "") : this.getProp(this.columnsTranslator(column.type).prop(column.name), column.name);
      return text
    },
    exportAdditionalColumn(type, name) {
      return this.columnsTranslator(type).export(name)
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
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisAdrList'] = this;
  }
};
</script>
