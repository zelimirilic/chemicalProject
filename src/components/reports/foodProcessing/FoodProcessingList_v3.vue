<template>
	<DataTable :tableData="cloneData || currentData" :orgId="orgId" :customFilters="customFilters" :perPage="perPage" :title="title" :excelTitle="excelTitle" :hiddenColumns="appSettings.useReportsAdditionalColumns && hiddenColumns" @hide-columns="$emit('hide-columns', $event)" :edit="cloneData != null" @[eventEdit]="showEdit" @cancel="cloneData = null" showHeadersWhenEmpty>
		<template #head>
			<tr>
				<Th class="IconColumn skipForSorting skipColumn ignoreInExportToExcel" name="icon"></Th>
				<Th class="prodNo" prop="artNum" name="artNum" sort export :placeholder="getTranslation('I00.00002880', 'Prod. No.')">{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="prodName" prop="name" name="name" sort export defaultSort :placeholder="getTranslation('I00.00004270', 'Name')">{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="dangerSymbol" sort>{{ getTranslation('I00.00006610', 'Danger symbols') }}</Th>
				<Th class="dangerSymbol" :export="imageResult" name="dangerSymbols" v-show="false">{{ getTranslation('I00.00006610', 'Danger symbols') }}</Th>
				<Th class="wp-110" prop="faroKlass" name="faroKlass" sort export="faroKlass" :excelTitle="getTranslation('I00.00014470', 'Clasification')" :placeholder="getTranslation('I00.00014470', 'Clasification')">{{ getTranslation('I00.00014470', 'Clasification') }}</Th>
				<Th class="wp-110" name="optionCode" sort>{{ getTranslation('I00.00049480', 'Food processing safety / Type of contact') }}</Th>
				<Th class="wp-110" :export="optionCodesForExcel" name="optionCode" v-show="false">{{ getSplitExcelTitle(getTranslation('I00.00049480', 'Food processing safety / Type of contact'), 0) }}</Th>
				<Th class="wp-110" :export="contactTypeForExcel" name="optionCode" v-show="false">{{ getSplitExcelTitle(getTranslation('I00.00049480', 'Food processing safety / Type of contact'), 1) }}</Th>
				<Th class="wp-110" prop="checked" name="checked" sort export :placeholder="getTranslation('I00.00017790', 'Checked')">{{ getTranslation('I00.00017790', 'Checked') }}</Th>
				<Th class="wrap" :class="columnsTranslator(column.type).class" :prop="getColumnName(column)" :name="getColumnName(column)" :sort="columnsTranslator(column.type).sort(column.name)" :export="exportAdditionalColumn(column.type, getColumnName(column))" :key="column.columnPhraseId" v-for="column in parsedSelectedColumns" v-show="!column.addedManually">{{ getTranslation(column.columnPhrase, column.columnPhrase) }}</Th>
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
				<td class="dangerSymbol">
					<DangerSymbols :dat="getDangerSymbols(product.item)" />
				</td>
				<td class="wp-110">
					{{ product.item.faroKlass }}
				</td>
				<td class="dangerSymbol">
					<FoodProcessingSymbols :dat="product.item.optionCodes" />
				</td>
				<td class="wp-110">
					{{ product.item.checked }}
				</td>
				<AdditionalCell class="wrap" :type="column.type" :departmentValue="product.item.additionalData[getColumnName(column, '_DepartmentOwnFields')]" v-model="product.item.additionalData[getColumnName(column)]" :edit="cloneData && column.ownField" v-for="column in parsedSelectedColumns" :key="column.columnPhraseId" v-show="!column.addedManually" />
			</tr>
		</template>
	</DataTable>
</template>

<script>
import DataTable from '../../common/dataTable/DataTable_v3'
import { genericDangerSymbolsResult, imagesToExcelString } from '../../../libraries/exportToExcel_v3';
import { getDangerSymbols, parseSelectedColumns, getProp, columnsTranslator } from '../../../libraries/reports_v3';
import AdditionalCell from '../components/AdditionalCell';
import DangerSymbols from '../../../components/riskAssessment/DangerSymbols';
import FoodProcessingSymbols from '../../../components/products/FoodProcessingSymbols_V3';
import Th from '../../common/dataTable/Th_v3';
import { deepClone, hashCode } from '../../../libraries/common_v3';

export default {
  components: {
    AdditionalCell,
    DangerSymbols,
    FoodProcessingSymbols,
    DataTable,
    Th
  },
  props: ['data', 'title', 'excelTitle', 'selectedColumns', 'hiddenColumns', 'canEdit', 'perPage', 'customFilters', 'orgId'],
  data() {
    return {
      currentData: this.data.map(f => ({ ...f, hashCode: () => hashCode(f) })),
      cloneData: null,
    }
  },
  methods: {
    columnsTranslator: columnsTranslator,
    getProp: getProp,
    getDangerSymbols: getDangerSymbols,
    imagesToExcelString: imagesToExcelString,
    deepClone,
    imageResult(product) {
      return genericDangerSymbolsResult(["vattenfallDangerSymbols", "oldLawNotVattenfallDangerSymbols", "newLawDangerSymbols"], this.getDangerSymbols(product));
    },
    getSplitExcelTitle(fullPhrase, splitPart) {
      return (fullPhrase ? fullPhrase.split('/')[splitPart].trim() : "");
    },
    optionCodesForExcel(product) {
      var result = product.optionCodesWithoutDirectIndirect.map(g => ({ Image: (g.length < 5 ? "../~master/new_style_images/Symbols/" + g + '.png' : '') }));
      return imagesToExcelString(result);
    },
    contactTypeForExcel(product) {
      return product.optionCodesWithoutDirectIndirect.filter(g => (g.length > 4 ? g : '')).join('\n');
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