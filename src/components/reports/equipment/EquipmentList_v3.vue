<template>
	<DataTable :tableData="cloneData || currentData" :orgId="orgId" :title="title" :orgProtectionSymbols="orgProtectionSymbols" :excelTitle="excelTitle" :hiddenColumns="appSettings.useReportsAdditionalColumns && hiddenColumns" @hide-columns="$emit('hide-columns', $event)" :edit="cloneData != null" @[eventEdit]="showEdit" @cancel="cloneData = null" showHeadersWhenEmpty :perPage="perPage" showProtectionSymbols>
		<template #head>
			<tr>
				<Th class="IconColumn skipForSorting skipColumn ignoreInExportToExcel" name="icon"></Th>
				<Th class="prodNo" prop="artNo" name="artNo" sort export :placeholder="getTranslation('I00.00002880', 'Prod. No.')">{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="width40" prop="name" name="name" sort export defaultSort :placeholder="getTranslation('I00.00004270', 'Name')">{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="consume" :prop="getValueUnits('amounts')" :sort="getValues('amounts')" :export="getValues('amounts')" :placeholder="getTranslation('I00.00005480', 'Annual consumption')">{{ getTranslation('I00.00005480', 'Annual consumption') }}</Th>
				<Th :export="getUnits('amounts')" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="protectionSymbol" :export="imageResult" name="protectionSymbols" v-show="true">{{ getTranslation('I00.00007340', 'Protection') }}</Th>
				<Th class="IconColumn hideOnPrint" name="sds">{{ getTranslation('I00.00005280', 'SDS') }}</Th>
				<Th :class="columnsTranslator(column.type).class" :prop="columnsTranslator(column.type).prop(column.name)" :sort="columnsTranslator(column.type).sort(column.name)" :export="columnsTranslator(column.type).export(column.name)" :key="column.columnPhraseId" v-for="column in parsedSelectedColumns" v-show="!column.addedManually">
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
					<a :href="product.item.linkToISafe">{{ product.item.artNo }}</a>
				</td>
				<td class="width40">
					<a :href="product.item.linkToISafe">{{ product.item.name }}</a>
				</td>
				<td class="consume">
					<p v-for="(arr, ind) in product.item.amounts" :key="ind">
						<span class="consume">{{ arr.value }}</span>
						<span class="noWrap">{{ arr.unit }}</span>
					</p>
				</td>
				<td class="protectionSymbol">
					<ProtectionSymbols :dat="product.item.protectionSymbols" />
				</td>
				<td class="IconColumn hideOnPrint">
					<a class="msdsIcon middled" :href="product.item.linkToSDS"></a>
				</td>
				<AdditionalCell :type="column.type" :departmentValue="product.item.additionalData[getColumnName(column, '_DepartmentOwnFields')]" v-model="product.item.additionalData[getColumnName(column)]" :edit="cloneData && column.ownField" v-for="column in parsedSelectedColumns" :key="column.columnPhraseId" v-show="!column.addedManually" />
			</tr>
		</template>
	</DataTable>
</template>

<script>

import ProtectionSymbols from '../../../components/products/ProtectionSymbols_V3';
import DataTable from '../../common/dataTable/DataTable_v3'
import Th from '../../common/dataTable/Th_v3';
import AdditionalCell from '../components/AdditionalCell';
import { imagesToExcelString } from '../../../libraries/exportToExcel_v3';
import { columnsTranslator, parseSelectedColumns } from '../../../libraries/reports_v3';
import { deepClone, hashCode } from '../../../libraries/common_v3';

export default {
  components: {
    AdditionalCell,
    DataTable,
    Th,
    ProtectionSymbols
  },
  props: ['data', 'showCustomFieldName', 'title', 'excelTitle', 'customFieldsTitles', 'selectedColumns', 'hiddenColumns', 'canEdit', 'perPage', 'orgProtectionSymbols', 'orgId'],
  data() {
    return {
      currentData: this.data.map(f => ({ ...f, hashCode: () => hashCode(f) })),
      cloneData: null
    }
  },
  methods: {
    columnsTranslator: columnsTranslator,
    deepClone,
    imagesToExcelString: imagesToExcelString,
    showEdit() {
      this.cloneData = deepClone(this.currentData).map((f, ind) => ({ ...f, originalData: () => this.currentData[ind] }));
    },
    getValueUnits: (prop) => (product) => (product[prop] || []).map((f) => (f.value + '') + (f.unit || '')).join('\n'),
    getValues: prop => product => product[prop].map(f => f.value).join('\n'),
    getUnits: prop => product => product[prop].map(f => f.unit).join('\n'),
    getColumnName(column, sufixName) {
      var text = (column.ownField ? "ownField_" : "") + (column.fieldId == null ? column.id : column.fieldId) + (sufixName != null ? sufixName : "");
      return text
    },
    imageResult(product) {
      var result = product.protectionSymbols.map(g => ({ Image: (g.symbolCode.length > 0 ? "../~master/new_style_images/Symbols/" + g.symbolCode + '.png' : '') }));
      return imagesToExcelString(result);
    },
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