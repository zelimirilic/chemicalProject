<template>
	<Reports @tabChanged="tabChanged" :prodData="prodData" :selectedColumns="selectedColumns" @fillFilters="fillFilters" :hiddenColumns="hiddenColumns" :filterChangedValue="filterChangedValue" @columnsChanged="columnsChanged" @hide-columns="hiddenColumns = $event">
		<template v-slot="data">
			<AdrList :data="data.item.products" :orgId="data.item.orgId" :title="data.item.departmentNodes ? (customReportName || 'ADR') + ' - ' + data.item.departmentNodes.tableName : ''" :customFilters="customFilters" :selectedColumns="selectedColumns" :hiddenColumns="hiddenColumns" :excelTitle="data.excelTitle" @filter-status="filterChanged" @hide-columns="hiddenColumns = $event" :key="data.item.index" :canEdit="canEdit" :perPage.sync="perPage" />
		</template>
	</Reports>
</template>

<script>
import axios from '../../../axios';
import { errorDebug, idsAreEqual } from '../../../libraries/common';
import Reports from '../../../components/reports/Reports';
import AdrList from '../../../components/reports/adr/AdrList';
import { parseProducts, beforeReportRouteLeave } from '../../../libraries/reports';

export default {
  name: 'Adr',
  components: {
    Reports,
    AdrList,
  },
  data() {
    return {
      prodData: null,
      selectedColumns: [],
      hiddenColumns: [],
      customFilters: [],
      pageStyle: null,
      perPage: 20,
      filterChangedValue: false
    };
  },
  methods: {
    getSelectedDepartmentList() {
      this.prodData = null;
      var selectedNode = this.sideTree.getSelectedDepartment();
      this.$store.state.subSearches = [];
      var customReports = this.$store.getters.state.customReports;
      var orgID = selectedNode.orgID;
      if (this.$route.query.id) {
        orgID = (((customReports.find(f => f.id == (this.$route.query || {}).id) || {}).department || {}).orgID
          || ((customReports.find(f => f.id == (this.$route.query || {}).id) || {}).department || {}).item.orgID);
        var nod = this.sideTree.getAllData().find(f => idsAreEqual(f.item.orgID, orgID));
        this.$store.getters.treeStateClick(nod);
      }
      return axios
        .cancelAll()
        .postWithCancelToken('/OrgProdListADR/GetDepartments', { pagestyle: this.pageStyle, selectedColumns: this.selectedColumns, orgID: orgID.id, orgID_mdbID: orgID.id_mdbID })
        .then(response => {
          this.prodData = response ? parseProducts(response, this.sideTree.getAllData()) : null;
          this.filterChangedValue = false;
          var filters = [];
          var report = (customReports.find(f => f.id == (this.$route.query || {}).id) || {})
          if (report.filterObject)
            report.filterObject.filterQuery.forEach((f) => {
              filters.push({ name: f.name, text: f.text, orgId: f.orgId });
            });

          if (this.customFilters.length == 0)
            this.customFilters = filters;

          if (!this.$route.query.id) {
            this.customFilters = [];
          }

        })
        .catch(errorDebug);
    },
    fillFilters(event) {
      this.customFilters = event;
    },
    filterChanged(event) {
      this.filterChangedValue = event;
    },
    tabChanged(event) {
      this.pageStyle = event;
      if (this.sideTree.getSelectedDepartment()) {
        this.getSelectedDepartmentList();
      }
    },
    columnsChanged(event) {
      this.selectedColumns = event;
      if (this.sideTree.getSelectedDepartment() && this.pageStyle) {
        this.getSelectedDepartmentList();
      }
    }
  },
  computed: {
    canEdit() {
      return this.pageStyle === 'singlenode' && (this.selectedColumns || []).filter((f) => f.ownField == true).any();
    },
    customReport() {
      if (this.$route.query.id)
        return this.$store.getters.state.customReports.find(f => f.id == this.$route.query.id);
      return null;
    },
    customReportName() {
      return this.$route.query.id ? (this.$store.getters.state.customReports.find(f => f.id == (this.$route.query || {}).id) || {}).filterName : 'ADR';
    },
  },
  mounted() {
    this.getTranslation('I00.00012130', 'All');
  },
  beforeDestroy() {
    axios.cancelAll();
  },
  beforeRouteUpdate: beforeReportRouteLeave,
  beforeRouteLeave: beforeReportRouteLeave
};
</script>