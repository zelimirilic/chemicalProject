<template>
	<DataTable :tableData="cloneData || currentData" :orgId="orgId" :title="title" :excelTitle="excelTitle" :hiddenColumns="appSettings.useReportsAdditionalColumns && hiddenColumns" @hide-columns="$emit('hide-columns', $event)" :edit="cloneData != null" @[eventEdit]="showEdit" @cancel="cloneData = null" showHeadersWhenEmpty :perPage="perPage">
		<template #head>
			<tr>
				<Th class="IconColumn skipForSorting skipColumn ignoreInExportToExcel" name="icon"></Th>
				<Th class="prodNo" prop="artNum" name="artNum" sort export :placeholder="getTranslation('I00.00002880', 'Prod. No.')">{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="prodName" prop="name" name="name" sort export defaultSort :placeholder="getTranslation('I00.00004270', 'Name')">{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="supplier" prop="supplier" name="supplier" sort export :placeholder="getTranslation('I00.00004110', 'Supplier')">{{ getTranslation('I00.00004110', 'Supplier') }}</Th>
				<Th class="wp-100" :prop="'listValues' + (ind + 1)" :name="'listValues' + (ind + 1)" v-for="(arr, ind) in customersLists" :key="ind + arr.indrow" sort export :placeholder="arr.listName">{{ arr.listName }}</Th>
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
					<a :href="product.item.linkToISafe">{{ product.item.artNum }}</a>
				</td>
				<td class="prodName">
					<a :href="product.item.linkToISafe">{{ product.item.name }}</a>
				</td>
				<td class="supplier">
					<a :href="product.item.linkToSupplier">
						<span>{{ product.item.supplier }}</span>
					</a>
				</td>
				<td class="wp-110" v-for="(arr, ind) in customersLists" :key="ind">
					{{ product.item['listValues' + (ind + 1)] }}
				</td>
				<AdditionalCell :type="column.type" :departmentValue="product.item.additionalData[getColumnName(column, '_DepartmentOwnFields')]" v-model="product.item.additionalData[getColumnName(column)]" :edit="cloneData && column.ownField" v-for="column in parsedSelectedColumns" :key="column.columnPhraseId" v-show="!column.addedManually" />
			</tr>
		</template>
	</DataTable>
</template>

<script>

import DataTable from '../../common/dataTable/DataTable_v3'
import Th from '../../common/dataTable/Th_v3';
import AdditionalCell from '../components/AdditionalCell';
import { columnsTranslator, parseSelectedColumns } from '../../../libraries/reports_v3';
import { deepClone, hashCode, isNullOrEmpty } from '../../../libraries/common_v3';

export default {
  components: {
    DataTable,
    Th,
    AdditionalCell
  },
  props: ['data', 'title', 'excelTitle', 'selectedColumns', 'hiddenColumns', 'canEdit', 'perPage', 'customersLists', 'orgId'],
  data() {
    return {
      currentData: this.data.map(f => ({ ...f, hashCode: () => hashCode(f) })),
      cloneData: null
    }
  },
  methods: {
    columnsTranslator: columnsTranslator,
    deepClone,
    isNullOrEmpty,
    showEdit() {
      this.cloneData = deepClone(this.currentData).map((f, ind) => ({ ...f, originalData: () => this.currentData[ind] }));
    },
    getColumnName(column, sufixName) {
      var text = (column.ownField ? "ownField_" : "") + (column.fieldId == null ? column.id : column.fieldId) + (sufixName != null ? sufixName : "");
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