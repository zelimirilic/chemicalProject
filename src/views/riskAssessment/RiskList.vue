<template>
	<MainLoader v-if="!departmentRaData || isGettingGeneralRaData || isGettingDepartmentRaData" />
	<TabsWithMenu v-else class="card pageWrapper" :value="selectedIndex" :tabs="tabs" @input="tabChanged">
		<SmallLoader v-if="isGettingArchiveRaData || isGettingProductsWithoutRisk" />
		<template #menu v-if="writeRights">
			<router-link :to="{ name: 'riskNew', params: { component: 'handling' } }" class="icons icon-plus" v-tooltip="getTranslation('I00.00014710', 'New')"></router-link>
		</template>
		<div>
			<keep-alive>
				<Accordion class="smallBox" :text="appSettings.riskEvaluation ? getTranslation('I00.00024030', 'Product list with RE') : getTranslation('I00.00020760', 'Product list with RA')" v-if="selectedIndex === 0" v-model="generalRiskOpened">
					<GeneralRiskAssessment :data="generalRiskData" @getLastSignedRiskForProduct="getLastSignedRiskForProduct" :perPage.sync="perPageGeneral" ref="generalRA" />
				</Accordion>
			</keep-alive>
			<keep-alive>
				<Accordion class="smallBox" :text="appSettings.riskEvaluation ? getTranslation('I00.00024020', 'ProdWithReOnSpecDep') : getTranslation('I00.00021710', 'ProdWithRaOnSpecDep')" v-if="selectedIndex === 0" v-model="departmentSpecificRiskOpened">
					<DepartmentRiskAssessment :data="departmentRaData" @archiveRisks="archiveRisks" @getLastSignedRiskForProduct="getLastSignedRiskForProduct" :isArchiveEnabled="isArchiveEnabled" :selectedIndex="selectedIndex" :perPage.sync="perPageDepartments" @checked="departmentRaChecked" ref="departmentRA" />
				</Accordion>
			</keep-alive>
			<keep-alive>
				<ProductWithoutRiskAssessment :data="productsWithoutRisks" :title="appSettings.riskEvaluation ? getTranslation('I00.00024010', 'Product list without RE') : getTranslation('I00.00020770', 'Product list without RA')" :writeRights="writeRights" :perPage.sync="perPageProducts" ref="products" v-if="selectedIndex === 1" />
			</keep-alive>
			<keep-alive>
				<DepartmentRiskAssessment :data="archiveRaData" @restoreRisks="restoreRisks" :isRestoreEnabled="isRestoreEnabled" :selectedIndex="selectedIndex" :title="getTranslation('I00.00012390', 'Archived risk assesment')" :perPage.sync="perPageArchive" withArchivedDate @checked="archiveRaChecked" ref="archiveRA" v-if="selectedIndex === 2" />
			</keep-alive>
		</div>
		<ModalDialog :title="getTranslation('I00.00029010', 'List of Risk evaluation revisions')" @close="showRiskHistory = false" additional-class="w-80" v-show="showRiskHistory">
			<ListOfSignedRa :risks="lastSignedRisks" />
		</ModalDialog>
	</TabsWithMenu>
</template>

<script>
import axios from '../../axios';
import { errorDebug, ticker, camelCaseObj } from '../../libraries/common';
import { parseDate } from '../../libraries/date';
import TabsWithMenu from '../../components/common/tabs/TabsWithMenu';
import GeneralRiskAssessment from '../../components/riskAssessment/GeneralRiskAssessment';
import DepartmentRiskAssessment from '../../components/riskAssessment/DepartmentRiskAssessment';
import ProductWithoutRiskAssessment from '../../components/riskAssessment/ProductWithoutRiskAssessment';
import Accordion from '../../components/common/accordion/Accordion';
import ListOfSignedRa from '../../components/riskAssessment/risk/components/ListOfSignedRa';

export default {
  name: 'RiskList',
  components: {
    TabsWithMenu,
    GeneralRiskAssessment,
    DepartmentRiskAssessment,
    ProductWithoutRiskAssessment,
    Accordion,
    ListOfSignedRa
  },
  data() {
    return {
      generalRaData: null,
      isGettingGeneralRaData: false,
      departmentRaData: null,
      isGettingDepartmentRaData: false,
      prodData: null,
      archiveRaData: null,
      isGettingArchiveRaData: false,
      settings: { getRiskEvaluation: () => false },
      isArchiveEnabled: false,
      isRestoreEnabled: false,
      tabLinks: ['risks', 'products', 'archive'],
      perPageGeneral: 20,
      perPageDepartments: 20,
      perPageProducts: 20,
      perPageArchive: 20,
      generalRiskOpened: false,
      departmentSpecificRiskOpened: true,
      selectFilterValues: [],
      lastSignedRisks: null,
      showRiskHistory: false
    };
  },
  methods: {
    getGeneralRiskData(selectedNode) {
      this.isGettingGeneralRaData = true;
      return axios.postWithCancelToken('/RiskAssessmentList/GetGeneralRiskAndProducts', { orgID: selectedNode.orgID.id, orgID_mdbID: selectedNode.orgID.id_mdbID, isChemsoftNg: true })
        .then((response) => {
          this.isGettingGeneralRaData = false;
          this.generalRaData = camelCaseObj(response.data.generalRisks);
          this.prodData = camelCaseObj(response.data.products);
        })
        .then(() => {
          if (this.$refs.generalRA)
            this.$refs.generalRA.resetData();

          if (this.$refs.products)
            this.$refs.products.resetData();
        })
        .catch((response) => {
          this.isGettingGeneralRaData = false;
          return errorDebug(response)
        });
    },
    getDepartmentRiskData(selectedNode) {
      this.isGettingDepartmentRaData = true;
      return axios.postWithCancelToken('/RiskAssessmentList/GetDepartmentRisks', { orgID: selectedNode.orgID.id, orgID_mdbID: selectedNode.orgID.id_mdbID, isChemsoftNg: true })
        .then((response) => {
          this.isGettingDepartmentRaData = false;
          this.departmentRaData = response.data;
        })
        .then(() => {
          if (this.$refs.depratmentRA)
            this.$refs.depratmentRA.resetData();
        })
        .catch((response) => {
          this.isGettingDepartmentRaData = false;
          return errorDebug(response)
        });
    },
    getArchiveRiskData(selectedNode) {
      this.isGettingArchiveRaData = true;
      return axios.postWithCancelToken('/RiskAssessmentList/ArchivedData', { orgID: selectedNode.orgID.id, orgID_mdbID: selectedNode.orgID.id_mdbID, isChemsoftNg: true })
        .then((response) => {
          this.isGettingArchiveRaData = false;
          this.archiveRaData = response.data;
        })
        .then(() => {
          if (this.$refs.archiveRA)
            this.$refs.archiveRA.resetData();
        })
        .catch((response) => {
          this.isGettingArchiveRaData = false;
          return errorDebug(response)
        });
    },
    nodeSelected() {
      this.generalRaData = null;
      this.departmentRaData = null;
      this.prodData = null;

      this.tabChanged(this.selectedIndex);
    },
    tabChanged(event) {
      ticker.clearMessages();
      if (this.tabLinks[event] !== this.$route.params.tab)
        this.$router.replace({ name: this.$route.name, params: { tab: this.tabLinks[event] } });

      var selectedNode = this.sideTree.getSelectedDepartment();
      if (selectedNode) {
        if (event === 0 || event == 1) {
          if (!this.departmentRaData && !this.isGettingDepartmentRaData)
            this.getDepartmentRiskData(selectedNode)
              .then(() => {
                if (!this.generalRaData && !this.isGettingGeneralRaData)
                  this.getGeneralRiskData(selectedNode);
              });
          else if (!this.generalRaData && !this.isGettingGeneralRaData)
            this.getGeneralRiskData(selectedNode);
        } else if (event === 2) {
          if (!this.archiveRaData && !this.isGettingArchiveRaData)
            this.getArchiveRiskData(selectedNode);
        }
      }
    },
    departmentRaChecked(event) {
      this.isArchiveEnabled = event.length > 0;
    },
    archiveRaChecked(event) {
      this.isRestoreEnabled = event.length > 0;
    },
    archiveRisks() {
      var data = this.$refs.departmentRA.checkedData;
      axios.post('/RiskAssessmentList/ArchiveRAs', { ra_ids: data.map(f => f.raId) })
        .then(() => {
          data.forEach(f => this.departmentRaData.remove(f));

          if (this.archiveRaData) {
            data.forEach(f => f.archivedDate = parseDate(new Date));
            this.archiveRaData.pushMany(data);
          }

          this.isArchiveEnabled = false;
          this.$refs.departmentRA.checkedData = [];
        })
        .catch(errorDebug);
    },
    restoreRisks() {
      var data = this.$refs.archiveRA.checkedData;

      axios.post('/RiskAssessmentList/RestoreRAs', { ra_ids: data.map(f => f.raId) })
        .then(() => {
          data.forEach(f => this.archiveRaData.remove(f));

          if (this.departmentRaData) {
            data.forEach(function (f) {
              f.archivedDate = '-';
            });
            this.departmentRaData.pushMany(data);
          }
          this.isRestoreEnabled = false;
          this.$refs.archiveRA.checkedData = [];
        })
        .catch(errorDebug);
    },
    getLastSignedRiskForProduct(parameters) {
      if (parameters.publishedDate !== '-') {
        this.showRiskHistory = true;
        axios.postWithCancelToken('/RiskAssessmentComplete/GetLastSignedRisks', { riskId: parameters.raId })
          .then(response => {
            this.lastSignedRisks = camelCaseObj(response.data);
          })
          .catch(errorDebug);
      }
    }
  },
  computed: {
    productsWithoutRisks() {
      if (this.prodData == null || this.generalRaData == null || this.departmentRaData == null) return null;
      var usedProdIds = {};
      this.generalRaData.concat(this.departmentRaData)
        .forEach(function (f) {
          f.productIds.forEach(function (g) { usedProdIds[g] = true });
        });
      return this.prodData.filter(function (f) {
        return !usedProdIds[f.id];
      });
    },
    isGettingProductsWithoutRisk() {
      return (this.prodData == null || this.generalRaData == null || this.departmentRaData == null);
    },
    productsWithoutDepartmentRisks() {
      if (this.prodData == null || this.departmentRaData == null) return null;

      var usedProdIds = this.departmentRaData
        .reduce((acc, f) => {
          f.productIds.forEach((g) => { acc[g] = true });
          return acc;
        }, {});

      return this.prodData.filter((f) => !usedProdIds[f.id]);
    },
    generalRiskData() {
      if (this.generalRaData === null || this.departmentRaData == null) return null;
      var prodIds = this.productsWithoutDepartmentRisks.reduce((acc, f) => {
        acc[f.id] = true;
        return acc;
      }, {});

      return this.generalRaData.filter((f) => f.productIds.any((g) => prodIds[g]));
    },
    tabs() {
      return [
        this.getTranslation('I00.00006160', 'Risk assessments'),
        this.getTranslation(this.appSettings.riskEvaluation ? 'I00.00024010' : 'I00.00020770', 'Products without risk'),
        this.getTranslation('I00.00034140', 'Archived')
      ];
    },
    selectedIndex() {
      return Math.max(this.tabLinks.indexOf(this.$route.params.tab), 0);
    },
    writeRights() {
      return this.hasWriteRights() && this.appSettings.permissions.riskAssessment.full;
    },
  },
  mounted() {
    if (this.sideTree.getSelectedDepartment()) {
      this.nodeSelected();
    }
    if (process.env.NODE_ENV === 'development') window['thisRiskListPage'] = this;
    this.getTranslation('I00.00012130', 'All');
  },
  beforeDestroy() {
    axios.cancelAll();
    ticker.clearMessages();
  }
}
</script>