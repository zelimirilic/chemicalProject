<template>
	<Reports @tabChanged="tabChanged" :prodData="prodData" :selectedColumns="selectedColumns" :perPage.sync="perPage" :hiddenColumns="hiddenColumns" @columnsChanged="columnsChanged" @hide-columns="hiddenColumns = $event">
		<template v-slot="data">
			<FireList :data="data.item.products" :orgId="data.item.orgId" :title="data.item.departmentNodes ? data.item.departmentNodes.tableName : ''" :selectedColumns="selectedColumns" :hiddenColumns="hiddenColumns" :excelTitle="data.excelTitle" @hide-columns="hiddenColumns = $event" :key="data.item.index" :canEdit="canEdit" :perPage="perPage" />
		</template>
	</Reports>
</template>

<script>
import axios from '../../../axios';
import { errorDebug } from '../../../libraries/common_v3';
import Reports from '../../../components/reports/Reports_v3';
import FireList from '../../../components/reports/fire/FireList_v3';
import { parseProducts } from '../../../libraries/reports_v3';

export default {
  name: 'FireReport',
  components: {
    Reports,
    FireList,
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
    };
  },
  methods: {
    getSelectedDepartmentList() {
      this.prodData = null;
      var node = window.SideTree.GetSelectedNode();
      return axios
        .cancelAll()
        .postWithCancelToken('/OrgProdListFire/GetDepartments', { pagestyle: this.pageStyle, selectedColumns: this.selectedColumns, orgid: node.KeyID, org_mdbid: node.KeyID_mdbID })
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
    }
  },
  computed: {
    canEdit() {
      return this.pageStyle === 'singlenode' && (this.selectedColumns || []).filter((f) => f.ownField == true).any();
    }
  },
  beforeDestroy() {
    axios.cancelAll();
  }
};
</script>