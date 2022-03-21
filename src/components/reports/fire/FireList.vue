<template>
	<SmallLoader v-if="isSaving" />
	<DataTable :tableData="cloneData || currentData" :orgId="orgId" :selectFilterProps="['pictograms', 'sdsdocLanguage', 'usageAmount']" @filteredTableData="setFilteredData" @filterChanged="$emit('filter-status', $event)" :selectFilterValues="filteredDataValues" :customFilters="customFilters" :perPage="perPage" @update:per-page="$emit('update:per-page', $event)" :title="title" :excelTitle="excelTitle" :hiddenColumns="appSettings.useReportsAdditionalColumns && hiddenColumns" @hide-columns="$emit('hide-columns', $event)" :edit="cloneData != null" @[eventEdit]="showEdit" @cancel="cloneData = null" @save="save" showHeadersWhenEmpty v-else>
		<template #head>
			<tr>
				<Th class="prodNo" prop="artNum" name="artNum" sort export>{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="prodName" prop="name" name="name" sort export defaultSort>{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="consume" :prop="getValueUnits('storage')" name="storage" :sort="getValues('storage')" :export="getValues('storage')">{{ getTranslation('I00.00009610', 'Storage') }}</Th>
				<Th :prop="getUnits('storage')" name="storage" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="prodNo" prop="flamepoint" name="flamepoint" sort export>{{ getTranslation('I00.00033020', 'Flame point class') }}(°C)</Th>
				<Th prop="form" name="form" sort export>{{ getTranslation('I00.00016920', 'Form') }}</Th>
				<Th class="symbols" prop="faroKlass" name="faroKlass" sort export :excelTitle="getTranslation('I00.00014470', 'Clasification')">{{ getTranslation('I00.00014470', 'Clasification') + ' / ' + getTranslation('I00.00006610', 'Danger symbols') }}</Th>
				<Th :export="imageResult" name="faroKlass" v-show="false">{{ getTranslation('I00.00006610', 'Danger symbols') }}</Th>
				<Th class="wp-110" prop="rcodes" name="rcodes" sort export>{{ getTranslation('I00.00025440', 'Haz statements / R-codes') }}</Th>
				<Th class="wp-110" prop="scodes" name="scodes" sort export>{{ getTranslation('I00.00025450', 'Pre statements / S-codes') }}</Th>
				<Th class="IconColumn HideOnPrint" name="sds">{{ getTranslation('I00.00005280', 'SDS') }}</Th>
				<Th class="wrap" :class="columnsTranslator(column.type).class" :prop="getColumnName(column)" :name="getColumnName(column)" :sort="columnsTranslator(column.type).sort(column.name)" :export="exportAdditionalColumn(column.type, getColumnName(column))" :key="column.columnPhraseId" v-for="column in parsedSelectedColumns" v-show="!column.addedManually">{{ getTranslation(column.columnPhrase, column.columnPhrase) }}</Th>
			</tr>
		</template>
		<template #body="product">
			<tr>
				<td class="prodNo">
					<p v-if="isLocalID(product.item)" class="mb-1">&nbsp;</p>
					<p class="mb-0">
						<router-link :to="`/product/${product.item.id}_${product.item.id_mdbID}`">
							<span>{{ product.item.artNum }}</span>
						</router-link>
					</p>
				</td>
				<td class="prodName">
					<p v-if="isLocalID(product.item)" class="tag mb-1">{{ getTranslation('I00.00050300', 'Own product') }}</p>
					<p class="mb-0">
						<router-link :to="`/product/${product.item.id}_${product.item.id_mdbID}`">{{ product.item.name }}</router-link>
					</p>
				</td>
				<td class="consume">
					<p v-for="(arr, ind) in product.item.storage" :key="ind">
						<span class="consume">{{ arr.value }}</span>
						<span class="noWrap">{{ arr.unit }}</span>
					</p>
				</td>
				<td class="prodNo">
					<p>
						<span>{{ product.item.sign }}</span>
						<span>{{ product.item.flamepoint }}</span>
					</p>
				</td>
				<td>
					{{ product.item.form }}
				</td>
				<td class="symbols">
					<div class="symbolClass">{{ product.item.faroKlass }}</div>
					<DangerSymbols :dat="getDangerSymbols(product.item)" />
				</td>
				<td class="wp-110">
					{{ product.item.rcodes }}
				</td>
				<td class="wp-110">
					{{ product.item.scodes }}
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
import { genericDangerSymbolsResult } from '../../../libraries/exportToExcel';
import { getDangerSymbols, parseSelectedColumns, saveReportData, getProp } from '../../../libraries/reports';
import AdditionalCell from '../components/AdditionalCell';
import DangerSymbols from '../../../components/riskAssessment/DangerSymbols';
import { columnsTranslator, getSds } from '../../../libraries/reports';
import { idToSlashedString, isLocalID, deepClone, hashCode } from '../../../libraries/common';

export default {
  components: {
    AdditionalCell,
    DangerSymbols,
  },
  props: ['data', 'subSearches', 'title', 'excelTitle', 'customFieldsTitles', 'selectedColumns', 'hiddenColumns', 'canEdit', 'perPage', 'customFilters', 'orgId'],
  data() {
    return {
      currentData: this.data.map(f => ({ ...f, hashCode: () => hashCode(f) })),
      cloneData: null,
      isSaving: false,
      filteredDataValues: null,
    }
  },
  methods: {
    columnsTranslator: columnsTranslator,
    getProp: getProp,
    getValueUnits: (prop) => (product) => product[prop].map((f) => (f.value + '') + (f.unit || '')).join('\n'),
    getValues: prop => product => product[prop].map(f => f.value).join('\n'),
    getUnits: prop => product => product[prop].map(f => f.unit).join('\n'),
    getDangerSymbols: getDangerSymbols,
    idToSlashedString: idToSlashedString,
    getSds: getSds,
    deepClone,
    imageResult(product) {
      return genericDangerSymbolsResult(["vattenfallDangerSymbols", "oldLawNotVattenfallDangerSymbols", "newLawDangerSymbols"], this.getDangerSymbols(product));
    },
    exportAdditionalColumn(type, name) {
      return this.columnsTranslator(type).export(name)
    },
    isLocalID: isLocalID,
    save: saveReportData,
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
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisFireList'] = this;
  }
};
</script>