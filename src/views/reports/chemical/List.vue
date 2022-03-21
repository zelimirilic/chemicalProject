<template>
	<Reports @tabChanged="tabChanged" :prodData="prodData" :selectedColumns="selectedColumns" @fillFilters="fillFilters" :hiddenColumns="hiddenColumns" :filterChangedValue="filterChangedValue" @columnsChanged="columnsChanged" @hide-columns="hiddenColumns = $event" @addProduct="showAddProductModal = true">
		<template v-slot="data">
			<SmallLoader v-if="loadingProduct" />
			<ChemicalList v-if="renderComponent" :orgId="data.item.orgId" :customFilters="customFilters" :data="data.item.products" :loadingProduct="loadingProduct" :title="data.item.departmentNodes ? (customReportName || getTranslation('I00.00047720', 'Chemical list')) + ' - ' + data.item.departmentNodes.tableName : ''" :excelTitle="data.excelTitle" :customFieldsTitles="customFieldsTitles" :selectedColumns="selectedColumns" :canEdit="canEdit" :perPage.sync="perPage" :hiddenColumns="hiddenColumns" @filter-status="filterChanged" @hide-columns="hiddenColumns = $event" :key="data.item.index" @showRiskAssessments="showRiskAssessments" />
		</template>
		<template #otherSlot>
			<ModalDialog v-if="showRAModal" :title="getTranslation('I00.00005520', 'Additional information')" additional-class="w-80" @close="showRAModal = false">
				<SmallLoader v-if="!risksData" />
				<RiskAssesmentModalDialogList :data="risksData" v-else />
			</ModalDialog>
			<ModalDialog v-if="showAddProductModal" :title="getTranslation('I00.00049020', 'Add to inventory')" :withFooter="true" additional-class="w-80" @close="showAddProductModal = false">
				<InventoryAdd @productPicked="addProduct" @cancel="showAddProductModal = false" :withFooter="true" :addedProductsIds="getAddedProductIds()" withConsumption withProductType :validations="validations" :okButtonText="getTranslation('I00.00049030', 'Add & save')" />
			</ModalDialog>
		</template>
	</Reports>
</template>

<script>
import axios from '../../../axios';
import { errorDebug, idsAreEqual, ticker, camelCaseObj } from '../../../libraries/common';
import Reports from '../../../components/reports/Reports';
import ChemicalList from '../../../components/reports/chemical/ChemicalList';
import RiskAssesmentModalDialogList from '../../../components/reports/chemical/RiskAssesmentModalDialogList';
import InventoryAdd from '../../../components/inventory/InventoryAdd';
import { parseProducts, beforeReportRouteLeave } from '../../../libraries/reports';
import { convertProductForSave, inventoryValidators } from '../../../libraries/inventory';

export default {
  name: 'Chemical',
  components: {
    Reports,
    ChemicalList,
    RiskAssesmentModalDialogList,
    InventoryAdd
  },
  data() {
    return {
      prodData: null,
      risksData: null,
      selectedColumns: [],
      hiddenColumns: [],
      customFilters: [],
      customFieldsTitles: null,
      showRAModal: false,
      showAddProductModal: false,
      pageStyle: null,
      perPage: 20,
      renderComponent: true,
      loadingProduct: false,
      filterChangedValue: false
    };
  },
  methods: {
    getSelectedDepartmentList() {
      this.prodData = null;
      this.customFieldsTitles = null;
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
        .postWithCancelToken('/OrgProdListChemical/GetDepartments', { pagestyle: this.pageStyle, selectedColumns: this.selectedColumns, orgId: orgID })
        .then(response => {
          if (response) {
            this.prodData = parseProducts(response, this.sideTree.getAllData());
            this.customFieldsTitles = response.data.customFieldsTitles;
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
    getAddedProductIds() {
      return this.prodData && this.prodData[0] ? this.prodData[0].products.map(x => ({ id: x.id, id_mdbID: x.id_mdbID, clvid: x.clvid == "" ? 0 : x.clvid })) : [];
    },
    columnsChanged(event) {
      this.selectedColumns = event;
      if (this.sideTree.getSelectedDepartment() && this.pageStyle) {
        this.getSelectedDepartmentList();
      }
    },
    fillFilters(event) {
      this.customFilters = event;
    },
    filterChanged(event) {
      this.filterChangedValue = event;
    },
    showRiskAssessments(event) {
      this.showRAModal = true;
      this.risksData = null;
      return axios
        .post('/OrgProdListChemical/GetAllRisksData', { risksNumber: event.risksNumbers })
        .then(response => {
          this.risksData = camelCaseObj(response.data);
        })
        .catch(errorDebug);
    },
    addProduct(product) {
      var selectedNode = this.sideTree.getSelectedDepartment();
      var saveData = {
        ArchiveItems: [convertProductForSave(product)],
        OrgID: selectedNode.orgID.id,
        OrgID_mdbID: selectedNode.orgID.id_mdbID,
        OrgPathForSave: selectedNode.nodePath,
        Year: new Date().getFullYear(),
      }
      saveData.ArchiveItems.map(x => x.productTypes = x.productTypes.map(g => ({ item: g.id, deleted: g.deleted })));

      var removeTicker = ticker.addInfoMessage(this.getTranslation('I00.00024390', 'Saving...'));
      axios.post('/Inventory/Save', { list: saveData })
        .then(() => {
          removeTicker();
          if (!product.endDate) {
            this.addProductToList({
              productId: product.id,
              orgId: selectedNode.orgID,
              pageStyle: this.pageStyle,
              selectedColumns: this.selectedColumns,
            });
          }
        })
        .then(() => { this.showAddProductModal = false; this.loadingProduct = true })
        .catch(error => {
          removeTicker();
          errorDebug(error);
        });
    },
    addProductToList(product) {
      return axios.post('/OrgProdListChemical/GetJsonForSavedInventory', product)
        .then(response => {
          this.loadingProduct = false;
          var product = camelCaseObj(JSON.parse(response.data.groupedProductsJson)).first().products.first();
          if (this.prodData.length) {
            this.prodData.find(f => f.orgId === response.data.orgId).products.push(product);
          } else {
            this.prodData = [{
              products: [product],
              departmentNodes: { tableName: this.sideTree.getSelectedDepartment().name },
              department: this.sideTree.getSelectedNode(),
            }];
          }
          this.forceRerender();
        });
    },
    forceRerender() {
      this.renderComponent = false;
      this.$nextTick(() => {
        this.renderComponent = true;
      });
    }
  },
  computed: {
    validations() {
      return selectedProduct => [
        {
          fnc: () => !this.prodData.length || this.prodData[0].products.all(f => !idsAreEqual(f.id, selectedProduct.id)),
          message: () => this.getTranslation('I00.00012100', 'Product is already in inventory')
        },
        inventoryValidators.isSet(selectedProduct),
        inventoryValidators.isNumber(selectedProduct),
      ];
    },
    canEdit() {
      return this.pageStyle === 'singlenode' && (this.selectedColumns || []).filter((f) => f.ownField == true).any();
    },
    customReport() {
      if (this.$route.query.id)
        return this.$store.getters.state.customReports.find(f => f.id == this.$route.query.id);
      return null;
    },
    customReportName() {
      return this.$route.query.id ? (this.$store.getters.state.customReports.find(f => f.id == (this.$route.query || {}).id) || {}).filterName : this.getTranslation('I00.00047720', 'Chemical list');
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisChemicalListPage'] = this;
    this.getTranslation('I00.00012100', 'Product is already in inventory');
    this.getTranslation('I00.00010050', 'You must check at least one checkbox.');
    this.getTranslation('I00.00049020', 'Add to inventory');
    this.getTranslation('I00.00024390', 'Saving...');
    this.getTranslation('I00.00012130', 'All');
  },
  beforeDestroy() {
    axios.cancelAll();
    ticker.clearMessages();
  },
  beforeRouteUpdate: beforeReportRouteLeave,
  beforeRouteLeave: beforeReportRouteLeave
};
</script>