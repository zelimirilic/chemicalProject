<template>
	<div>
		<Reports @tabChanged="tabChanged" :prodData="prodData" :perPage.sync="perPage" :hiddenColumns="hiddenColumns" @hide-columns="hiddenColumns = $event" @is-selected="$emit('is-selected', $event)" withOutSummarise>
			<template v-slot="data">
				<PrintSafetySheetList :data="data.item.products" :showCustomFieldName="data.showCustomFieldName" :orgId="data.item.orgId" :title="data.item.departmentNodes ? data.item.departmentNodes.tableName : ''" :selectedColumns="selectedColumns" :hiddenColumns="hiddenColumns" :excelTitle="data.excelTitle" @hide-columns="hiddenColumns = $event" @is-selected="getSelected($event)" @openAdvancedFilter="openAdvancedFilter($event)" :key="data.item.index" :canEdit="canEdit" :perPage="perPage" />
			</template>
		</Reports>
		<ModalDialog additional-class="wp-562" :title="getTranslation('I00.00057500', 'Advanced filter')" :withFooter="true" @close="showAdvancedFilter = false" v-if="showAdvancedFilter">
			<AdvancedFilter :items="advancedFilterColumns" @cancel="showAdvancedFilter = false" />
		</ModalDialog>
	</div>
</template>

<script>
import axios from '../../../axios';
import { errorDebug } from '../../../libraries/common_v3';
import Reports from '../../../components/reports/Reports_v3';
import PrintSafetySheetList from '../../../components/reports/print/PrintSafetySheetList_v3';
import { parseProducts } from '../../../libraries/reports_v3';
import ModalDialog from '../../../components/common/modal/ModalDialog_v3';
import AdvancedFilter from '../../../components/reports/components/advancedFilter/AdvancedFilter_v3';

export default {
	name: 'PrintSafetySheetReport',
	components: {
		Reports,
		PrintSafetySheetList,
		ModalDialog,
		AdvancedFilter
	},
	data() {
		return {
			prodData: null,
			selectedColumns: [],
			usages: [],
			storages: [],
			hiddenColumns: [],
			pageStyle: null,
			perPage: 15,
			advancedFilterColumns: [],
			showAdvancedFilter: false,
			selectedItems: []
		};
	},
	methods: {
		getSelectedDepartmentList() {
			this.prodData = null;
			var node = window.SideTree.GetSelectedNode();
			return axios
				.cancelAll()
				.postWithCancelToken('/OrgProdListBatchPrintSafetySheet/GetDepartments', { pagestyle: this.pageStyle, selectedColumns: this.selectedColumns, orgid: node.KeyID, org_mdbid: node.KeyID_mdbID })
				.then(response => {
					if (response) {
						this.prodData = parseProducts(response, this.sideTree.getAllData());
					}
				})
				.catch(errorDebug);
		},
		tabChanged(event) {
			this.pageStyle = event;
			this.getSelectedDepartmentList();
		},
		columnsChanged(event) {
			this.selectedColumns = event;
			var node = window.SideTree.GetSelectedNode();
			if (node && this.pageStyle) {
				this.getSelectedDepartmentList();
			}
		},
		openAdvancedFilter(event) {
			this.advancedFilterColumns = event.map(f => f.placeholder).filter(f => f !== undefined);
			this.showAdvancedFilter = true;
		},
		getSelected(event) {
			this.selectedItems = event;
			this.$emit('is-selected', event);
		}
	},
	computed: {
		canEdit() {
			return this.pageStyle === 'singlenode' && (this.selectedColumns || []).filter(f => f.ownField == true).any();
		}
	},
	beforeDestroy() {
		axios.cancelAll();
	}
};
</script>
