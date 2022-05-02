<template>
	<DataTable :tableData="cloneData || currentData" :orgId="orgId" :title="title" :excelTitle="excelTitle" :hiddenColumns="appSettings.useReportsAdditionalColumns && hiddenColumns" @hide-columns="$emit('hide-columns', $event)" :edit="cloneData != null" @[eventEdit]="showEdit" @cancel="cloneData = null" showHeadersWhenEmpty :perPage="perPage">
		<template #head>
			<tr>
				<Th class="IconColumn skipForSorting skipColumn ignoreInExportToExcel" name="icon"></Th>
				<Th class="prodNo" prop="artNum" name="artNum" sort export :placeholder="getTranslation('I00.00002880', 'Prod. No.')">{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="prodName" prop="name" name="name" sort export defaultSort :placeholder="getTranslation('I00.00004270', 'Name')">{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="width15 noWrap" prop="msdsDate" name="msdsDate" sort export :placeholder="getTranslation('I00.00008620', 'Date')">{{ getTranslation('I00.00008620', 'Date') }}</Th>
				<Th class="IconColumn skipForSorting skipColumn ignoreInExportToExcel" name="msdslinks" :export="onlyTitleForExcel('msdslinks')">{{ getTranslation('I00.00005280', 'SDS') }}</Th>
				<Th class="IconColumn skipForSorting skipColumn ignoreInExportToExcel" name="additionalMSDSLinks" :export="onlyTitleForExcel('additionalMSDSLinks')">{{ getTranslation('I00.00025490', 'Additional SDS') }}</Th>
				<Th class="IconColumn skipForSorting skipColumn ignoreInExportToExcel" v-if="appSettings.showSafetySheetOnOrgProdListLinks" name="safetySheetLinks" :export="onlyTitleForExcel('safetySheetLinks')">{{ getTranslation('I00.00004780', 'Safety Sheet') }}</Th>
				<Th class="wp-110" name="msdslinks" v-show="false" :export="onlyLinksForExcel('msdslinks')">{{ getTranslation('I00.00005280', 'SDS') }}</Th>
				<Th class="wp-110" name="additionalMSDSLinks" v-show="false" :export="onlyLinksForExcel('additionalMSDSLinks')">{{ getTranslation('I00.00025490', 'Additional SDS') }}</Th>
				<Th class="wp-110" v-show="false" name="safetySheetLinks" v-if="appSettings.showSafetySheetOnOrgProdListLinks" :export="onlyLinksForExcel('safetySheetLinks')">{{ getTranslation('I00.00004780', 'Safety Sheet') }}</Th>
				<Th :class="columnsTranslator(column.type).class" :prop="columnsTranslator(column.type).prop(column.name)" :sort="columnsTranslator(column.type).sort(column.name)" :export="columnsTranslator(column.type).export(column.name)" :key="column.columnPhraseId" v-for="column in parsedSelectedColumns" v-show="!column.addedManually">
					{{ getTranslation(column.columnPhrase, column.columnPhrase) }}
				</Th>
			</tr>
		</template>
		<template #body="product">
			<tr>
				<td class="IconColumn hideOnPrint">
					<div class="iconSizeSmall" :class="product.item.icon" :title="product.item.iconTitle">
						<img :src="appSettings.imageFolder + product.item.iconLink" alt="" class="iconSizeSmall" />
					</div>
				</td>
				<td class="prodNo">
					<a :href="product.item.linkToISafe">{{ product.item.artNum }}</a>
				</td>
				<td class="prodName">
					<a :href="product.item.linkToISafe">{{ product.item.name }}</a>
				</td>
				<td class="width15">
					<span>{{ product.item.msdsDate }}</span>
				</td>
				<td class="LinkCell wrap">
					<SdsSymbols :dat="product.item.msdslinks" />
				</td>
				<td class="LinkCell wrap">
					<SdsSymbols :dat="product.item.additionalMSDSLinks" />
				</td>
				<td class="LinkCell wrap" v-if="appSettings.showSafetySheetOnOrgProdListLinks">
					<SdsSymbols :dat="product.item.safetySheetLinks" />
				</td>
				<AdditionalCell :type="column.type" :departmentValue="product.item.additionalData[getColumnName(column, '_DepartmentOwnFields')]" v-model="product.item.additionalData[getColumnName(column)]" :edit="cloneData && column.ownField" v-for="column in parsedSelectedColumns" :key="column.columnPhraseId" v-show="!column.addedManually" />
			</tr>
		</template>
	</DataTable>
</template>

<script>
import DataTable from '../../common/dataTable/DataTable_v3';
import Th from '../../common/dataTable/Th_v3';
import AdditionalCell from '../components/AdditionalCell';
import { columnsTranslator, parseSelectedColumns } from '../../../libraries/reports_v3';
import { deepClone, hashCode, isNullOrEmpty } from '../../../libraries/common_v3';
import SdsSymbols from '../../../components/products/SdsSymbols_v3';
import { imagesToExcelString } from '../../../libraries/exportToExcel_v3';

export default {
	components: {
		AdditionalCell,
		DataTable,
		Th,
		SdsSymbols
	},
	props: ['data', 'showCustomFieldName', 'title', 'excelTitle', 'customFieldsTitles', 'selectedColumns', 'hiddenColumns', 'canEdit', 'perPage', 'orgId'],
	data() {
		return {
			currentData: this.data.map(f => ({ ...f, hashCode: () => hashCode(f) })),
			cloneData: null
		};
	},
	methods: {
		columnsTranslator: columnsTranslator,
		deepClone,
		imagesToExcelString: imagesToExcelString,
		showEdit() {
			this.cloneData = deepClone(this.currentData).map((f, ind) => ({ ...f, originalData: () => this.currentData[ind] }));
		},
		safetySheetLinks() {},
		getColumnName(column, sufixName) {
			var text = (column.ownField ? 'ownField_' : '') + (column.fieldId == null ? column.id : column.fieldId) + (sufixName != null ? sufixName : '');
			return text;
		},
		getValueUnits: prop => product => (product[prop] || []).map(f => f.value + '' + (f.unit || '')).join('\n'),
		iconAndLinksForExcel: prop => product => {
			var result = (product[prop] || []).map(g => ({ Image: '../~master/new_style_images/flags/' + (isNullOrEmpty(g.countryLanguageID) ? 'language_' + g.languageCode : 'flag' + g.countryLanguageID.split('-').last()) + '.png', Link: ('https://' + window.location.hostname + window.location.pathname + g.url).replace('~master/application.aspx../', '') }));
			return imagesToExcelString(result);
		},
		onlyLinksForExcel: prop => product => {
			return (product[prop] || []).map(g => ('https://' + window.location.hostname + window.location.pathname + g.url).replace('~master/application.aspx../', '')).join('\r\n');
		},
		onlyTitleForExcel: prop => product => {
			return (product[prop] || []).map(g => g.flagTitle).join('\r\n');
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
