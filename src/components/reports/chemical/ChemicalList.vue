<template>
	<SmallLoader v-if="isSaving" />
	<DataTable :tableData="cloneData || currentData" :orgId="orgId" :selectFilterProps="['appStatus', 'riskStatus', 'pictograms', 'sdsdocLanguage', 'usageAmount']" @filteredTableData="setFilteredData" @filterChanged="$emit('filter-status', $event)" :selectFilterValues="filteredDataValues" :customFilters="customFilters" :perPage="perPage" @update:per-page="$emit('update:per-page', $event)" :title="title" :excelTitle="excelTitle" :hiddenColumns="appSettings.useReportsAdditionalColumns && hiddenColumns" @hide-columns="$emit('hide-columns', $event)" :edit="cloneData != null" @[eventEdit]="showEdit" @cancel="cloneData = null" @save="save" showHeadersWhenEmpty v-else>
		<template #head>
			<tr>
				<Th class="iconCol hideOnPrint" prop="appStatus" sort="appStatus" name="appStatus" export v-if="appSettings.adaptableInventoryRequest">{{ getTranslation('I00.00046590', 'Status') }}</Th>
				<Th class="iconCol hideOnPrint" prop="riskStatus" name="icon" export>{{ getTranslation('I00.00006090', 'Risk assessment') }}</Th>
				<Th class="prodNo" prop="artNum" name="artNum" sort export>{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="prodName" prop="name" name="name" sort export defaultSort>{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="consume" :prop="getValueUnits('usage')" name="usage" :sort="getValues('usage')" export>{{ getTranslation('I00.00012480', 'Annual consumption') }}</Th>
				<Th :export="getUnits('usage')" name="usage" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="supplier" prop="supplier" name="supplier" sort export>{{ getTranslation('I00.00004110', 'Supplier') }}</Th>
				<Th class="consume" :prop="getValueUnits('storage')" name="storage" :sort="getValues('storage')" export>{{ getTranslation('I00.00009610', 'Storage') }}</Th>
				<Th :export="getUnits('storage')" name="storage" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th prop="lists" name="lists" sort export>{{ getTranslation('I00.00004130', 'Lists') }}</Th>
				<Th class="splitForExcel" prop="faroKlass" name="faroKlass" sort export="rcodes" :excelTitle="getTranslation('I00.00014470', 'Clasification')">{{ getTranslation('I00.00006610', 'Danger symbols') + ' ' + getTranslation('I00.00014470', 'Clasification') }}</Th>
				<Th class="symbols" :export="imageResult" name="faroKlass" v-show="false">{{ getTranslation('I00.00006610', 'Danger symbols') }}</Th>
				<Th class="wp-110" prop="rcodes" name="rcodes" sort export>{{ getTranslation('I00.00025440', 'R Codes') }}</Th>
				<Th class="wp-110" prop="scodes" name="scodes" sort export>{{ getTranslation('I00.00025450', 'S Codes') }}</Th>
				<Th class="smallDate" prop="sdsDate" name="sdsDate" sort export>{{ getTranslation('I00.00018150', 'SDS Date') }}</Th>
				<Th class="statusCell" prop="status" name="status" v-if="appSettings.orgProdListCompleteForRegister" sort export>{{ getTranslation('I00.00018160', 'Status') }}</Th>
				<Th class="smallDate" prop="controlDate" name="controlDate" v-if="appSettings.orgProdListCompleteForRegister" sort export>{{ getTranslation('I00.00018140', 'SDS Checked') }}</Th>
				<Th class="iconCol hideOnPrint" name="sds">{{ getTranslation('I00.00005280', 'SDS') }}</Th>
				<Th class="wrap" :class="columnsTranslator(column.type).class" :prop="getColumnName(column)" :name="getColumnName(column)" :sort="columnsTranslator(column.type).sort(column.name)" :export="exportAdditionalColumn(column.type, getColumnName(column))" :key="column.columnPhraseId" v-for="column in parsedSelectedColumns" v-show="!column.addedManually">{{ getTranslation(column.columnPhrase, column.columnPhrase) }}</Th>
			</tr>
		</template>
		<template #body="product">
			<tr>
				<td v-if="appSettings.adaptableInventoryRequest" class="iconCol hideOnPrint">
					<div v-if="product.item.prodAppStatus.length > 0">
						<span class="m-1 status" :class="product.item.prodAppStatus[0].class" :title="product.item.appStatus">{{ product.item.appStatus }}</span>
						<div v-if="product.item.prodAppStatus.length > 1" class="w-100 text-center prodApp icons icon-details mt-2"></div>
					</div>
					<div v-else>
						<span class="m-1 status NotStarted" :title="product.item.appStatus">{{ product.item.appStatus }}</span>
					</div>
				</td>
				<td class="iconCol hideOnPrint">
					<div v-if="product.item.risks.length > 0">
						<router-link :to="`/chemicals/risk_assessment/risk/${product.item.risks[0].riskId}/summary`">
							<span class="m-1 status" :class="product.item.risks[0].class" :title="product.item.riskStatus">{{ product.item.riskStatus }}</span>
						</router-link>
						<div v-if="product.item.hasMoreThanOnceRisk" class="w-100 text-center risks icons icon-details mt-2" @click="$emit('showRiskAssessments', product.item)"></div>
					</div>
				</td>
				<td class="prodNo">
					<p v-if="isLocalID(product.item)" class="mb-1">&nbsp;</p>
					<p class="mb-0">
						<router-link :to="`/product/${idToSlashedString(product.item)}`">
							<span>{{ product.item.artNum }}</span>
						</router-link>
					</p>
				</td>
				<td class="prodName">
					<p v-if="isLocalID(product.item)" class="tag mb-1">{{ getTranslation('I00.00050300', 'Own product') }}</p>
					<p class="mb-0">
						<router-link :to="`/product/${idToSlashedString(product.item)}`">{{ product.item.name }}</router-link>
					</p>
				</td>
				<td class="consume">
					<p class="row no-gutters" v-for="(arr, ind) in product.item.usage" :key="ind">
						<span class="col-xl-8 col-6 pr-1 text-right">{{ arr.value }}</span>
						<span class="col-xl-4 col-6 noWrap">{{ arr.unit }}</span>
					</p>
				</td>
				<td class="supplier">
					<A @click="goToSupplier(product.item)">{{ product.item.supplier }}</A>
				</td>
				<td class="consume">
					<p class="row no-gutters" v-for="(arr, ind) in product.item.storage" :key="ind">
						<span class="col-xl-8 col-6 pr-1 text-right">{{ arr.value }}</span>
						<span class="col-xl-4 col-6 noWrap">{{ arr.unit }}</span>
					</p>
				</td>
				<td>
					<div v-tooltip="product.item.lists">
						<template v-if="product.item.lists.includes(',')">
							{{ product.item.lists.substr(0, product.item.lists.indexOf(',') + 1) + '...' }}
						</template>
						<template v-else>{{ product.item.lists }}</template>
					</div>
				</td>
				<td class="symbols">
					<DangerSymbols :dat="getDangerSymbols(product.item)" />
					{{ product.item.faroKlass }}
				</td>
				<td class="wp-110">
					{{ product.item.rcodes }}
				</td>
				<td class="wp-110">
					{{ product.item.scodes }}
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
import DangerSymbols from '../../../components/riskAssessment/DangerSymbols';
import { genericDangerSymbolsResult } from '../../../libraries/exportToExcel';
import { getDangerSymbols, parseSelectedColumns, columnsTranslator, saveReportData, getProp } from '../../../libraries/reports';
import { idToSlashedString, isLocalID, ticker, deepClone, hashCode } from '../../../libraries/common';
import { getSds } from '../../../libraries/reports';

export default {
  components: {
    AdditionalCell,
    DangerSymbols,
  },
  props: ['data', 'title', 'excelTitle', 'customFieldsTitles', 'selectedColumns', 'hiddenColumns', 'canEdit', 'perPage', 'customFilters', 'orgId'],
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
    goToSupplier() { ticker.addWarningMessage("This link is not implemented yet"); },
    getDangerSymbols: getDangerSymbols,
    idToSlashedString: idToSlashedString,
    getSds: getSds,
    deepClone,
    imageResult(product) {
      return genericDangerSymbolsResult(['vattenfallDangerSymbols', 'oldLawNotVattenfallDangerSymbols', 'newLawDangerSymbols'], this.getDangerSymbols(product));
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
    goToRoute(route) {
      this.$router.push(route);
    },
    setFilteredData(items) {
      var allSymbols = this.appSettings.allSymbols;
      this.filteredDataValues = items ? {
        appStatus: [...new Set([""].pushMany(items.map(x => x.appStatus)))].sort(),
        riskStatus: [...new Set([""].pushMany(items.map(x => x.riskStatus)))].sort(),
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
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisChemicalList'] = this;
  },
};
</script>
