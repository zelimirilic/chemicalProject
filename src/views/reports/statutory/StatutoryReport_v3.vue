<template>
	<Reports @tabChanged="tabChanged" :prodData="prodData">
		<template #filterSlot>
			<div class="filterSpecial form-inline borderB px-4 py-3" :class="{ disabled: !prodData }">
				<SelectGroup class="form-inline" v-if="appSettings.orgProdListLawPossibilityToSelectActiveYear" :items="yearOptions" v-model="activeYear" @input="departmentExistsInSelectedYear" :text="getTranslation('I00.00022850', 'Summarize')" />
				<CheckBoxGroup class="ml-3" v-if="appSettings.orgProdListLawPossibilityToShowAllProducts" v-model="showAll" @input="departmentExistsInSelectedYear" :text="getTranslation('I00.00033240', 'IncludeNotClassifiedProducts')" />
			</div>
		</template>
		<template v-slot="data">
			<StatutoryList :data="data.item.products" :orgId="data.item.orgId" :title="data.item.departmentNodes ? data.item.departmentNodes.tableName : ''" :excelTitle="data.excelTitle" :key="data.item.index" :perPage.sync="perPage" />
		</template>
	</Reports>
</template>

<script>
import axios from '../../../axios';
import { errorDebug } from '../../../libraries/common_v3';
import Reports from '../../../components/reports/Reports_v3';
import StatutoryList from '../../../components/reports/statutory/StatutoryList_v3';
import { parseProducts } from '../../../libraries/reports_v3';
import SelectGroup from '../../../components/common/form/select/SelectGroup_v3.vue'
import CheckBoxGroup from '../../../components/common/form/checkBox/CheckBoxGroup_v3.vue'

export default {
  name: 'StatutoryReport',
  components: {
    Reports,
    StatutoryList,
    SelectGroup,
    CheckBoxGroup
  },
  data() {
    return {
      prodData: null,
      activeYear: new Date().getFullYear(),
      showAll: false,
      yearOptions: [],
      pageStyle: null,
      perPage: 10,
    };
  },
  methods: {
    departmentExistsInSelectedYear() {
      var selectedNode = window.SideTree.GetSelectedNode();
      return axios
        .cancelAll()
        .postWithCancelToken('/InventoryArchive/DepartmentExistsInSelectedYear', { selected_year: this.activeYear, org_id: selectedNode.KeyID, org_mdbid: selectedNode.KeyID_mdbID })
        .then(response => {
          if (response.data.is_exist == 'true') {
            this.getSelectedDepartmentList();
          } else
            window.Ticker.AddInfoMessage(this.getTranslation('I00.00027400', 'No data information'))
        })
        .catch(errorDebug);
    },
    getSelectedDepartmentList() {
      this.prodData = null;
      var selectedNode = window.SideTree.GetSelectedNode();
      return axios
        .cancelAll()
        .postWithCancelToken('/OrgProdListLaw/GetDepartments', { pagestyle: this.pageStyle, selectedColumns: [], orgID: selectedNode.KeyID, orgID_mdbID: selectedNode.KeyID_mdbID, active_year: this.activeYear, show_all: this.showAll })
        .then(response => {
          if (response) {
            this.prodData = parseProducts(response, this.sideTree.getAllData());
            this.yearOptions = response.data.yearOptions;
          }
        })
        .catch(errorDebug);
    },
    tabChanged(event) {
      this.pageStyle = event;
      this.getSelectedDepartmentList();
    }
  },
  beforeDestroy() {
    axios.cancelAll();
  }
};
</script>