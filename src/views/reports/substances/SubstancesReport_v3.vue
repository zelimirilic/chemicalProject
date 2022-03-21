<template>
	<Reports @tabChanged="tabChanged" :prodData="prodData">
		<template v-slot="data">
			<SubstancesList :data="data.item.products" :orgId="data.item.orgId" :title="data.item.departmentNodes ? data.item.departmentNodes.tableName : ''" :excelTitle="data.excelTitle" :key="data.item.index" :perPage.sync="perPage" />
		</template>
	</Reports>
</template>

<script>
import axios from '../../../axios';
import { errorDebug } from '../../../libraries/common_v3';
import Reports from '../../../components/reports/Reports_v3';
import SubstancesList from '../../../components/reports/substances/SubstancesList_v3';
import { parseProducts } from '../../../libraries/reports_v3';

export default {
  name: 'SubstancesReport',
  components: {
    Reports,
    SubstancesList
  },
  data() {
    return {
      prodData: null,
      pageStyle: null,
      perPage: 15,
    };
  },
  methods: {
    getSelectedDepartmentList() {
      this.prodData = null;
      var selectedNode = window.SideTree.GetSelectedNode();
      return axios
        .cancelAll()
        .postWithCancelToken('/OrgProdListSubstances/GetDepartments', { pagestyle: this.pageStyle, orgid: selectedNode.KeyID, org_mdbid: selectedNode.KeyID_mdbID })
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
    }
  },
  beforeDestroy() {
    axios.cancelAll();
  }
};
</script>