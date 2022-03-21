<template>
	<DataTable :tableData="cloneData || currentData" :orgId="orgId" :perPage="perPage" :title="title" :excelTitle="excelTitle" :hiddenColumns="appSettings.useReportsAdditionalColumns && hiddenColumns" @hide-columns="$emit('hide-columns', $event)" :edit="cloneData != null" @[eventEdit]="showEdit" @cancel="cloneData = null" showHeadersWhenEmpty>
		<template #head>
			<tr>
				<Th class="prodNo" prop="artNo" name="artNo" sort export :placeholder="getTranslation('I00.00015350', 'ArtNoHeader')">{{ getTranslation('I00.00015350', 'ArtNoHeader') }}</Th>
				<Th class="prodName width35" prop="name" name="name" sort export defaultSort :placeholder="getTranslation('I00.00006920', 'Name')">{{ getTranslation('I00.00006920', 'Name') }}</Th>
				<Th class="" prop="departmentName" name="departmentName" sort export :placeholder="getTranslation('I00.00026380', 'Department')">{{ getTranslation('I00.00026380', 'Department') }}</Th>
				<Th class="widthPx150" prop="status" name="status" sort export :placeholder="getTranslation('I00.00047910', 'Exposure scenario has been handled')">{{ getTranslation('I00.00047910', 'Exposure scenario has been handled') }}</Th>
				<Th class="widthPx300" prop="complianceNote" name="complianceNote" sort export :placeholder="getTranslation('I00.00020550', 'Comment')">{{ getTranslation('I00.00020550', 'Comment') }}</Th>
				<Th class="widthPx80 noWrap special" prop="uploadDate" name="uploadDate" sort :export="(f) => parseDate(f.uploadDate)" :placeholder="getTranslation('I00.00022630', 'Upload date')">{{ getTranslation('I00.00022630', 'Upload date') }}</Th>
				<Th class="widthPx80 noWrap special" prop="createdDate" name="createdDate" sort :export="(f) => parseDate(f.createdDate)" :placeholder="getTranslation('I00.00039030', 'Created on')">{{ getTranslation('I00.00039030', 'Created on') }}</Th>
				<Th class="widthPx80 noWrap special" prop="completedDate" name="completedDate" sort :export="(f) => parseDate(f.completedDate)" :placeholder="getTranslation('I00.00050620', 'Signed date')">{{ getTranslation('I00.00050620', 'Signed date') }}</Th>
				<Th class="widthPx150" prop="completedBy" name="completedBy" sort export :placeholder="getTranslation('I00.00012370', 'Signed by')">{{ getTranslation('I00.00012370', 'Signed by') }}</Th>
				<Th class="wrap" :class="columnsTranslator(column.type).class" :prop="getColumnName(column)" :name="getColumnName(column)" :sort="columnsTranslator(column.type).sort(column.name)" :export="exportAdditionalColumn(column.type, getColumnName(column))" :key="column.columnPhraseId" v-for="column in parsedSelectedColumns" v-show="!column.addedManually">{{ getTranslation(column.columnPhrase, column.columnPhrase) }}</Th>
			</tr>
		</template>
		<template #body="product">
			<tr>
				<td class="prodNo">
					<a :href="product.item.linkToCompliance">{{ product.item.artNo }}</a>
				</td>
				<td class="prodName width35">
					<a :href="product.item.linkToCompliance">{{ product.item.name }}</a>
				</td>
				<td class="">
					<a :href="product.item.linkToCompliance">{{ product.item.departmentName }}</a>
				</td>
				<td class="widthPx150">
					<a :href="product.item.linkToCompliance">{{ product.item.status }}</a>
				</td>
				<td class="widthPx300">
					<a :href="product.item.linkToCompliance">{{ product.item.complianceNote }}</a>
				</td>
				<td class="widthPx80 noWrap special">
					{{ parseDate(product.item.uploadDate) || '-' }}
				</td>
				<td class="widthPx80 noWrap special">
					{{ parseDate(product.item.createdDate) || '-' }}
				</td>
				<td class="widthPx80 noWrap special">
					{{ parseDate(product.item.completedDate) || '-' }}
				</td>
				<td class="widthPx150">
					{{ product.item.completedBy }}
				</td>
				<AdditionalCell class="wrap" :type="column.type" :departmentValue="product.item.additionalData[getColumnName(column, '_DepartmentOwnFields')]" v-model="product.item.additionalData[getColumnName(column)]" :edit="cloneData && column.ownField" v-for="column in parsedSelectedColumns" :key="column.columnPhraseId" v-show="!column.addedManually" />
			</tr>
		</template>
	</DataTable>
</template>

<script>
import DataTable from '../../common/dataTable/DataTable_v3'
import { parseDate } from '../../../libraries/date_v3';
import { parseSelectedColumns, getProp, columnsTranslator } from '../../../libraries/reports_v3';
import AdditionalCell from '../components/AdditionalCell';
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
      cloneData: null
    }
  },
  methods: {
    columnsTranslator: columnsTranslator,
    getProp: getProp,
    deepClone,
    parseDate,
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