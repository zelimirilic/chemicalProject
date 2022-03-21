<template>
	<Reports @tabChanged="tabChanged" :prodData="prodData">
		<template #filterSlot>
			<div class="filterSpecial form-inline borderB px-4 py-12" :class="{ disabled: !prodData }">
				<SelectGroup class="form-inline" v-if="appSettings.orgProdListLawPossibilityToSelectActiveYear" :items="yearOptions" v-model="activeYear" @input="getSelectedDepartmentList" :text="getTranslation('I00.00022850', 'Summarize')" />
				<CheckBoxGroup class="ml-3" v-if="appSettings.orgProdListLawPossibilityToShowAllProducts" v-model="showAll" @input="getSelectedDepartmentList">{{ getTranslation('I00.00033240', 'IncludeNotClassifiedProducts') }}</CheckBoxGroup>
			</div>
		</template>
		<template v-slot="data">
			<ChemicalReportList :data="data.item.products" :title="data.item.departmentNodes ? 'Chemical Report List' + ' - ' + data.item.departmentNodes.tableName : ''" :excelTitle="data.excelTitle" :key="data.item.index" :perPage.sync="perPage" />
		</template>
	</Reports>
</template>

<script>
import axios from '../../../axios';
import { errorDebug } from '../../../libraries/common';
import Reports from '../../../components/reports/Reports';
import ChemicalReportList from '../../../components/reports/statutory/ChemicalReportList';
import { parseProducts } from '../../../libraries/reports';

export default {
  name: 'Statutory',
  components: {
    Reports,
    ChemicalReportList,
  },
  data() {
    return {
      prodData: null,
      activeYear: new Date().getFullYear(),
      showAll: false,
      yearOptions: [],
      pageStyle: null,
      perPage: 20,
    };
  },
  methods: {
    getSelectedDepartmentList() {
      this.prodData = null;
      var selectedNode = this.sideTree.getSelectedDepartment();
      return axios
        .cancelAll()
        .postWithCancelToken('/OrgProdListLaw/GetDepartments', { pagestyle: this.pageStyle, selectedColumns: [], orgID: selectedNode.orgID.id, orgID_mdbID: selectedNode.orgID.id_mdbID, active_year: this.activeYear, show_all: this.showAll, show_deleted: false })
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
      if (this.sideTree.getSelectedDepartment()) {
        this.getSelectedDepartmentList();
      }
    },
  },
  mounted() {
    this.getTranslation('I00.00012130', 'All');
  },
  beforeDestroy() {
    axios.cancelAll();
  }
};
</script>