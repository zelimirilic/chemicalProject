<template>
	<DataTable :tableData="cloneData || currentData" :orgId="orgId" :perPage="perPage" :title="title" :excelTitle="excelTitle" @update:per-page="$emit('update:per-page', $event)" :hiddenColumns="appSettings.useReportsAdditionalColumns && hiddenColumns" @hide-columns="$emit('hide-columns', $event)" :edit="cloneData != null" @[eventEdit]="showEdit" @cancel="cloneData = null" @save="save" showHeadersWhenEmpty @openAdvancedFilter="$emit('openAdvancedFilter', $event)" @sortedData="setSortedData($event)">
		<template #head>
			<tr>
				<Th class="IgnoreInExportToExcel sorting_disabled first IconColumn HideOnPrint"><CheckBoxGroup :value="areAllSelected" @input="selectAll" alwaysOn /></Th>
				<Th class="firstPrint prodName width45" prop="name" name="name" sort export :placeholder="getTranslation('I00.00003860', 'Local Name')">{{ getTranslation('I00.00003860', 'Local Name') }}</Th>
				<Th class="prodName width45" prop="riskSource" name="riskSource" sort export :placeholder="getTranslation('I00.00021930', 'Risk source')">{{ getTranslation('I00.00021930', 'Risk source') }}</Th>
				<Th class="dateCol noWrap special" prop="publishedDate" name="publishedDate" sort :export="f => parseDate(f.publishedDate)" :placeholder="getTranslation('I00.00016300', 'Published Date')">{{ getTranslation('I00.00016300', 'Published Date') }}</Th>
				<Th v-if="isPerDepartments" :prop="f => getOrganisationName(f)" name="departmentPath" sort defaultSort="desc" :placeholder="getTranslation('I00.00002940', 'Department')" :export="f => getOrganisationPathValues(f)">{{ getTranslation('I00.00002940', 'Department') }}</Th>
				<Th :class="columnsTranslator(column.type).class" :prop="getColumnName(column)" :name="getColumnName(column)" :placeholder="getTranslation(column.columnPhrase, column.columnPhrase)" :sort="columnsTranslator(column.type).sort(getColumnName(column))" :export="exportAdditionalColumn(column.type, getColumnName(column))" :key="column.columnPhraseId" v-for="column in parsedSelectedColumns" v-show="!column.addedManually">
					{{ getTranslation(column.columnPhrase, column.columnPhrase) }}
				</Th>
			</tr>
		</template>
		<template #body="product">
			<tr>
				<td class="first IconColumn HideOnPrint"><CheckBoxGroup :value="selects.indexOf(product.item) !== -1" @input="setCheckBox(product.item, $event)" alwaysOn /></td>
				<td class="firstPrint prodName width45">
					<a :href="product.item.linkToISafe">{{ product.item.name }}</a>
				</td>
				<td class="prodName width45">
					<span>{{ product.item.riskSource }}</span>
				</td>
				<td class="dateCol noWrap special">
					{{ parseDate(product.item.publishedDate) || '-' }}
				</td>
				<td v-if="isPerDepartments">
					<span :title="product.item.departmentInfo.departmentPath">{{ product.item.departmentInfo.tableName }}</span>
				</td>
				<AdditionalCell :type="column.type" :departmentValue="product.item.additionalData[getColumnName(column, '_DepartmentOwnFields')]" v-model="product.item.additionalData[getColumnName(column)]" :edit="cloneData && column.ownField" v-for="column in parsedSelectedColumns" :key="column.columnPhraseId" v-show="!column.addedManually" />
			</tr>
		</template>
	</DataTable>
</template>

<script>
import DataTable from '../../common/dataTable/DataTable_v3';
import Th from '../../common/dataTable/Th_v3';
import { parseDate } from '../../../libraries/date_v3';
import AdditionalCell from '../components/AdditionalCell_v3';
import { columnsTranslator, parseSelectedColumns, getDangerSymbols, getProp, saveReportData, getOrganisationPathValues, getOrganisationName } from '../../../libraries/reports_v3';
import CheckBoxGroup from '../../common/form/checkBox/CheckBoxGroup_v3';
import { deepClone, hashCode } from '../../../libraries/common_v3';

export default {
	components: {
		AdditionalCell,
		DataTable,
		Th,
		CheckBoxGroup
	},
	props: ['data', 'title', 'excelTitle', 'selectedColumns', 'hiddenColumns', 'canEdit', 'perPage', 'orgId'],
	data() {
		return {
			currentData: this.data.map(f => ({ ...f, hashCode: () => hashCode(f) })),
			cloneData: null,
			sortedData: null,
			isPerDepartments: this.data.find(x => x.departmentInfo),
			selects: []
		};
	},
	methods: {
		columnsTranslator: columnsTranslator,
		deepClone,
		parseDate,
		getProp: getProp,
		getDangerSymbols: getDangerSymbols,
		save: saveReportData,
		getOrganisationPathValues: getOrganisationPathValues,
		getOrganisationName: getOrganisationName,
		showEdit() {
			this.cloneData = deepClone(this.currentData).map((f, ind) => ({ ...f, originalData: () => this.currentData[ind] }));
		},
		getColumnName(column, sufixName) {
			var text = column.ownField ? 'ownField_' + (column.fieldId == null ? column.id : column.fieldId) + (sufixName != null ? sufixName : '') : this.getProp(this.columnsTranslator(column.type).prop(column.name), column.name);
			return text;
		},
		exportAdditionalColumn(type, name) {
			return this.columnsTranslator(type).export(name);
		},
		selectAll() {
			if (!this.areAllSelected) {
				this.selects = this.sortedData.map(f => f);
				this.sortedData.all(f => (f.selected = true));
			} else {
				this.sortedData.all(f => (f.selected = false));
				this.selects = [];
			}
		},
		setCheckBox(item, event) {
			this.sortedData.find(f => f.riskID == item.riskID).selected = event;
			item.selected = event;
			this.selects.toggle(item, event);
		},
		setSortedData(event) {
			this.sortedData = event;
			this.selects = (this.sortedData || []).filter(f => f.selected);
		}
	},
	computed: {
		parsedSelectedColumns() {
			return parseSelectedColumns(this.selectedColumns);
		},
		eventEdit() {
			return this.canEdit ? 'edit' : null;
		},
		areAllSelected() {
			this.$emit('is-selected', this.selects);
			return this.selects.length !== 0 && this.selects.length === this.sortedData.length;
		}
	}
};
</script>
