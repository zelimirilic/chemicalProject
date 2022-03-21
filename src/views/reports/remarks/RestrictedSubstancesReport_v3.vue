<template>
	<Reports @tabChanged="tabChanged" :prodData="prodData" :perPage.sync="perPage">
		<template v-slot="data">
			<RestrictedSubstancesList :data="data.item.products" :orgId="data.item.orgId" :title="data.item.departmentNodes ? data.item.departmentNodes.tableName : ''" :excelTitle="data.excelTitle" :key="data.item.index" :perPage="perPage" />
		</template>
	</Reports>
</template>

<script>
import axios from '../../../axios';
import { errorDebug } from '../../../libraries/common_v3';
import Reports from '../../../components/reports/Reports_v3';
import RestrictedSubstancesList from '../../../components/reports/remarks/RestrictedSubstancesList_v3';
import { parseProducts } from '../../../libraries/reports_v3';

export default {
  name: 'RestrictedSubstancesReport',
  components: {
    Reports,
    RestrictedSubstancesList,
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
      var node = window.SideTree.GetSelectedNode();
      return axios
        .cancelAll()
        .postWithCancelToken('/OrgProdListListLimit/GetDepartments', { pagestyle: this.pageStyle, orgid: node.KeyID, org_mdbid: node.KeyID_mdbID })
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
  },
  beforeDestroy() {
    axios.cancelAll();
  }
};
</script>