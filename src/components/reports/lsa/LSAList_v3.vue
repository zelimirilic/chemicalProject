<template>
	<DataTable :tableData="cloneData || currentData" :orgId="orgId" :perPage="perPage" :title="title" :selectFilterValues="filteredDataValues" :excelTitle="excelTitle" @update:per-page="$emit('update:per-page', $event)" :hiddenColumns="appSettings.useReportsAdditionalColumns && hiddenColumns" @hide-columns="$emit('hide-columns', $event)" :edit="cloneData != null" @[eventEdit]="showEdit" @cancel="cloneData = null" @save="save" showHeadersWhenEmpty @openAdvancedFilter="$emit('openAdvancedFilter', $event)">
		<template #head>
			<tr>
				<Th class="IconColumn skipForSorting skipColumn ignoreInExportToExcel" name="icon"></Th>
				<Th class="prodNo" prop="artNum" name="artNum" sort export :placeholder="getTranslation('I00.00002880', 'Prod. No.')">{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="prodName" prop="name" name="name" sort export :placeholder="getTranslation('I00.00004270', 'Name')">{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th v-if="isPerDepartments" :prop="f => getOrganisationName(f)" name="departmentPath" sort defaultSort="desc" :placeholder="getTranslation('I00.00002940', 'Department')" :export="f => getOrganisationPathValues(f)">{{ getTranslation('I00.00002940', 'Department') }}</Th>
				<Th class="supplier" prop="supplier" name="supplier" sort export :placeholder="getTranslation('I00.00004110', 'Supplier')">{{ getTranslation('I00.00004110', 'Supplier') }}</Th>
				<Th class="width10" prop="lgk" name="lgk" sort export :placeholder="getTranslation('I00.00046550', 'Storage class')">{{ getTranslation('I00.00046550', 'Storage class') }}</Th>
				<Th class="width10" prop="sev" name="sev" sort export :placeholder="getTranslation('I00.00046560', 'Seveso Category')">{{ getTranslation('I00.00046560', 'Seveso Category') }}</Th>
				<Th class="width10" prop="avv" name="avv" sort export :placeholder="getTranslation('I00.00025900', 'Waste code')">{{ getTranslation('I00.00025900', 'Waste code') }}</Th>
				<Th class="IconColumn hideOnPrint" name="sds">{{ getTranslation('I00.00005280', 'SDS') }}</Th>
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
					<span>{{ product.item.supplier }}</span>
				</td>
				<td class="width10">
					<span>{{ product.item.lgk }}</span>
				</td>
				<td class="width10">
					<span>{{ product.item.sev }}</span>
				</td>
				<td class="width10">
					<span>{{ product.item.avv }}</span>
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
import DataTable from '../../common/dataTable/DataTable_v3';
import Th from '../../common/dataTable/Th_v3';
import AdditionalCell from '../components/AdditionalCell_v3';
import { columnsTranslator, parseSelectedColumns, getProp, saveReportData, getOrganisationPathValues, getOrganisationName } from '../../../libraries/reports_v3';
import { deepClone, hashCode } from '../../../libraries/common_v3';

export default {
	components: {
		AdditionalCell,
		DataTable,
		Th
	},
	props: ['data', 'showCustomFieldName', 'title', 'excelTitle', 'customFieldsTitles', 'selectedColumns', 'hiddenColumns', 'canEdit', 'perPage', 'orgId'],
	data() {
		return {
			currentData: this.data.map(f => ({ ...f, hashCode: () => hashCode(f) })),
			cloneData: null,
			filteredDataValues: null,
			isPerDepartments: this.data.find(x => x.departmentInfo)
		};
	},
	methods: {
		columnsTranslator: columnsTranslator,
		deepClone,
		getProp: getProp,
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
