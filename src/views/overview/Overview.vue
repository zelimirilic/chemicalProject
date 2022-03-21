<template v-cloak>
	<MainLoader v-if="loading" />
	<div v-else :class="{ disabled: loading }">
		<div class="card pageWrapper">
			<CardBox :text="getTranslation('I00.00009980', 'Status of documents')">
				<div class="row no-gutters p-4 baseBox">
					<div class="col-xl-2 col-4 pr-2">
						<Card class="card h-100 levelNotStarted" @click="openDocumentModal(documentStatus.waitingForCheck.key)" :status="documentStatus.waitingForCheck.value" :text="getTranslation('I00.00014530', 'Waiting for check/retrieval')"></Card>
					</div>
					<div class="col-xl-4 col-8 px-xl-2 pl-2">
						<div class="card flex-row h-100 levelWarning">
							<Card class="cardInner borderRight" @click="openDocumentRemarksModal(documentRemarksStatus.remarksAndQuestions.attribute)" :status="documentRemarksStatus.remarksAndQuestions.value !== undefined ? documentRemarksStatus.remarksAndQuestions.value : 0" :text="getTranslation('I00.00014540', 'Waiting customer')" v-if="!appSettings.overviewDisableDocumentAttributes"></Card>
							<Card class="cardInner" @click="openDocumentModal(documentStatus.waitingForAnswerFromPublisher.key)" :status="documentStatus.waitingForAnswerFromPublisher.value" :text="getTranslation('I00.00014550', 'Waiting for answer from publisher')"></Card>
						</div>
					</div>
					<div class="col-xl-4 col-8 mt-3 mt-xl-0 px-xl-2 pr-2">
						<div class="card flex-row h-100 levelInProgress">
							<Card class="cardInner borderRight" @click="openDocumentModal(documentStatus.onPaperOcrInProgress.key)" :status="documentStatus.onPaperOcrInProgress.value" :text="getTranslation('I00.00014560', 'On paper, OCR in progress')"></Card>
							<Card class="cardInner" @click="openDocumentModal(documentStatus.newOriginalAdded.key)" :status="documentStatus.newOriginalAdded.value" :text="getTranslation('I00.00014570', 'New original added, data entry in progress')"></Card>
						</div>
					</div>
					<div class="col-xl-2 col-4 mt-3 mt-xl-0 pl-2">
						<Card class="card h-100 levelDone" @click="openDocumentModal(documentStatus.completed.key)" :status="documentStatus.completed.value" :text="getTranslation('I00.00014580', 'Completed')"></Card>
					</div>
				</div>
			</CardBox>
		</div>
		<ModalDialog v-if="showDocumentStatusModal" :title="getTranslation('I00.00009980', 'Status of documents')" additional-class="w-80 widthTbl" @close="cancelDocumentsModal()">
			<SmallLoader v-if="!documentStatusModalData" />
			<StatusOfDocumentsModal v-else :data="documentStatusModalData.Documents" :title="documentStatusModalData.Status" :excelTitle="documentStatusModalData.Status" :perPage.sync="perPage" />
		</ModalDialog>
		<ModalDialog v-if="showDocumentRemarksModal" :title="getTranslation('I00.00009980', 'Status of documents')" additional-class="w-80 widthTbl customHeight" @close="cancelDocumentRemarksModal()">
			<SmallLoader v-if="!documentRemarksModalData" />
			<DocumentRemarksModal v-else :data="documentRemarksModalData" @saveCustomerAnswers="saveCustomerAnswers" :perPage.sync="perPage" />
		</ModalDialog>
		<div class="row card-deck mt-4">
			<div class="card pageWrapper">
				<CardBox v-if="appSettings.riskAssessment_v3" :text="getTranslation('I00.00006090', 'Risk assessment')">
					<div class="row no-gutters p-4 baseBox">
						<div class="col-xl-6 col-12">
							<div class="card flex-row h-100 levelUrgent">
								<Card v-if="riskAssessmentStatus.noOfRiskAssV3ToDo.value > 0" class="cardInner borderRight" :status="riskAssessmentStatus.noOfRiskAssV3ToDo.value" @click="!hasRAPermission ? null : openRiskAssessmentModal(riskAssessmentStatus.noOfRiskAssV3ToDo.key)" :text="getTranslation('I00.00028920', 'Risk assessment v3')"></Card>
								<Card class="cardInner" :status="riskAssessmentStatus.noOfRiskAssV3OldToDo.value" @click="!hasRAPermission ? null : openRiskAssessmentModal(riskAssessmentStatus.noOfRiskAssV3OldToDo.key)" :text="getTranslation('I00.00007570', 'Old RA v3')"></Card>
							</div>
						</div>
						<div v-if="riskAssessmentStatus.noOfRiskAssV3ToSignToDo.value > 0" class="col-xl-3 col-6 mt-xl-0 mt-3 pl-xl-3 pl-0 pr-xl-0 pr-2">
							<Card class="card h-100 levelWarning" :status="riskAssessmentStatus.noOfRiskAssV3ToSignToDo.value" @click="!hasSignRAPermission ? null : openRiskAssessmentModal(riskAssessmentStatus.noOfRiskAssV3ToSignToDo.key)" :text="this.appSettings.riskEvaluation ? getTranslation('I00.00030010', 'RA v3 to sign') : getTranslation('I00.00011720', 'RA v3 to sign')"></Card>
						</div>
						<div class="col-xl-3 col-6 mt-xl-0 mt-3 pl-xl-3 pl-2">
							<Card class="card h-100 levelDone" :status="riskAssessmentStatus.noOfCompletedRisk.value" @click="!hasRAPermission ? null : openRiskAssessmentModal(riskAssessmentStatus.noOfCompletedRisk.key)" :text="getTranslation('I00.00014700', 'Completed')"></Card>
						</div>
					</div>
				</CardBox>
				<CardBox additionalClass="borderT" v-if="appSettings.mainMenuButtonAdminInventory" :text="getTranslation('I00.00024750', 'Inventory')">
					<div class="row no-gutters p-4 baseBox">
						<div class="col-xl-6 col-0">
							<div class="card h-100 lightGrayBg"><div class="card-block">&nbsp;</div></div>
						</div>
						<div class="col-xl-3 col-6 pl-xl-3 pl-0 pr-xl-0 pr-2">
							<Card class="card h-100 levelWarning" @click="openInventoryModal(inventoryStatus.noOfInvItems.key)" :status="inventoryStatus.noOfInvItems.value" :text="getTranslation('I00.00049270', 'Number of Items')"></Card>
						</div>
						<div class="col-xl-3 col-6 pl-xl-3 pl-2">
							<Card class="card h-100 levelDone" @click="openInventoryModal(inventoryStatus.noOfInvProducts.key)" :status="inventoryStatus.noOfInvProducts.value" :text="getTranslation('I00.00007770', 'Number of products')"></Card>
						</div>
					</div>
				</CardBox>
			</div>

			<ModalDialog v-if="showRiskAssessmentStatusModal" :title="getTranslation('I00.00006090', 'Risk assessment')" additional-class="w-80 widthTbl" @close="cancelRiskModal()">
				<SmallLoader v-if="!riskAssessmentModalData" />
				<RiskAssessmentModal v-else :data="riskAssessmentModalData.departmentsListDataForChemsoft" :title="riskAssessmentModalData.modalTitle" :excelTitle="riskAssessmentModalData.modalTitle" :isRiskToDo="riskAssessmentModalData.riskToDo" :perPage.sync="perPage" />
			</ModalDialog>
			<ModalDialog v-if="showInventoryStatusModal" :title="getTranslation('I00.00024750', 'Inventory')" additional-class="w-80 widthTbl" @close="cancelInventoryModal()">
				<SmallLoader v-if="!inventoryModalData" />
				<InventoryModal v-else :data="inventoryModalData.inventoryListData" :sideTree="sideTree" :title="inventoryModalData.modalTitle" :excelTitle="inventoryModalData.modalTitle" :perPage.sync="perPage" />
			</ModalDialog>

			<div v-if="!appSettings.overviewDisableFiveLatestChangeProds" class="card pageWrapper">
				<CardBox :text="getTranslation('I00.00009040', 'Latest updated products')">
					<DataTable tableWrapClass="smallTbl" :tableData="latestUpdatedProdList" noSearch noHeader noFooter>
						<template v-slot:head>
							<tr>
								<Th class="prodNo" prop="ArtNo" sort>{{ getTranslation('I00.00015350', 'Prod No') }}</Th>
								<Th prop="Name" sort>{{ getTranslation('I00.00020000', 'Name') }}</Th>
								<Th v-if="appSettings.trackSectionChanged" prop="CurrentSections" sort>{{ getTranslation('I00.00026740', 'Track Section Changed') }}</Th>
								<Th class="wp-100" prop="ModifiedDate" sort>{{ getTranslation('I00.00016720', 'Changed') }}</Th>
							</tr>
						</template>
						<template v-slot:body="product">
							<tr>
								<td class="prodNo bold">
									<router-link :to="`/product/${idToSlashedString(product.item)}`">
										<span>{{ product.item.ArtNo }}</span>
									</router-link>
								</td>
								<td class="bold">
									<router-link class="relative" :to="`/product/${idToSlashedString(product.item)}`">
										{{ product.item.Name }}
										<span class="tooltipInfo icons icon-info plainIcn" v-if="product.item.Value !== null" v-tooltip="getTranslation('I00.00037700', 'Section') + ': ' + product.item.Value"></span>
									</router-link>
								</td>
								<td v-if="appSettings.trackSectionChanged">
									{{ product.item.CurrentSections }}
								</td>
								<td class="wp-100 noWrap">{{ parseDate(product.item.ModifiedDate) }}</td>
							</tr>
						</template>
					</DataTable>
				</CardBox>
			</div>
		</div>

		<div v-if="appSettings.riskAssessment_v3" class="card pageWrapper mt-4">
			<CardBox :text="getTranslation('I00.00005730', 'One-off measures')">
				<div class="p-3" v-if="measureList.length == 0">{{ getTranslation('I00.00044540', 'No one-off measures on this department.') }}</div>
				<DataTable :tableData="measureList" :perPage="5" noHeader v-else>
					<template v-slot:head>
						<tr>
							<Th class="prodName" prop="Name" sort export>{{ getTranslation('I00.00002940', 'DepartmenText') }}</Th>
							<Th prop="Task" sort export>{{ getTranslation('I00.00005730', 'OneOfMeasuresText') }}</Th>
							<Th :prop="(type) => getTranslation(type.MeasureType, 'Type')" sort export>{{ getTranslation('I00.00006930', 'TypeText') }}</Th>
							<Th prop="ResponsiblePerson" sort export>{{ getTranslation('I00.00005970', 'In charge') }}</Th>
							<Th class="wp-100" prop="Date" sort export>{{ getTranslation('I00.00008620', 'Date') }}</Th>
						</tr>
					</template>
					<template v-slot:body="measure">
						<tr>
							<td class="prodName">
								<span>{{ measure.item.Name }}</span>
							</td>
							<td>
								<A @click="getMeasures(measure.item.ID)">{{ measure.item.Task }}</A>
							</td>
							<td>{{ measure.item.MeasureType ? getTranslation(measure.item.MeasureType, 'TextOfMeasureType') : '' }}</td>
							<td>{{ measure.item.ResponsiblePerson }}</td>
							<td class="wp-100 noWrap">{{ parseDate(measure.item.Date) }}</td>
						</tr>
					</template>
				</DataTable>
			</CardBox>
		</div>
		<template>
			<ModalDialog additional-class="w-70" :title="getTranslation('I00.00005730', 'One-off measures')" @close="showMeasureListModal = false" v-if="showMeasureListModal">
				<DataTable tableWrapClass="borderTRBL" :tableData="selectedMeasures" :perPage="5" noHeader v-if="selectedMeasures">
					<template v-slot:head>
						<tr>
							<Th class="prodName" prop="Name" sort export>{{ getTranslation('I00.00002940', 'DepartmenText') }}</Th>
							<Th prop="Task" sort export>{{ getTranslation('I00.00005730', 'OneOfMeasuresText') }}</Th>
							<Th :prop="(type) => getTranslation(type.MeasureType, 'Type')" sort export>{{ getTranslation('I00.00006930', 'TypeText') }}</Th>
							<Th prop="ResponsiblePerson" sort export>{{ getTranslation('I00.00005970', 'In charge') }}</Th>
							<Th class="wp-100" prop="Date" sort export>{{ getTranslation('I00.00008620', 'Date') }}</Th>
							<Th class="wp-100">{{ getTranslation('I00.00030850', 'Complete') }}</Th>
						</tr>
					</template>
					<template v-slot:body="measure">
						<tr>
							<td class="prodName">
								<span>{{ measure.item.Name }}</span>
							</td>
							<td>
								<span>{{ measure.item.Task }}</span>
							</td>
							<td>{{ measure.item.MeasureType ? getTranslation(measure.item.MeasureType, 'TextOfMeasureType') : '' }}</td>
							<td>{{ measure.item.ResponsiblePerson }}</td>
							<td class="wp-100 noWrap">{{ parseDate(measure.item.Date) }}</td>
							<td class="wp-100 text-center"><span class="icons icon-edit" v-tooltip="getTranslation('I00.00006260', 'Edit')" @click="completeMeasure(measure.item)"></span></td>
						</tr>
					</template>
				</DataTable>
				<SmallLoader v-else />
			</ModalDialog>
		</template>
	</div>
</template>

<script>
import axios from '../../axiosOld-DONOTUSE';
import { errorDebug, idToSlashedString } from '../../libraries/common';
import Card from '../../components/overview/Card';
import { parseDate } from '../../libraries/date';
import StatusOfDocumentsModal from '../../components/overview/StatusOfDocumentsModal';
import DocumentRemarksModal from '../../components/overview/DocumentRemarksModal';
import RiskAssessmentModal from '../../components/overview/RiskAssessmentModal';
import InventoryModal from '../../components/overview/InventoryModal';

export default {
  components: {
    Card,
    StatusOfDocumentsModal,
    DocumentRemarksModal,
    RiskAssessmentModal,
    InventoryModal
  },
  data: function () {
    return {
      documentStatus: {
        waitingForCheck: { key: '1.QUEUED', value: 0, data: null },
        waitingForAdditionalInfromation: { key: '2.WAITING_CUSTOMER', value: 0, data: null },
        waitingForAnswerFromPublisher: { key: '2.WAITING_PUBLISHER', value: 0, data: null },
        onPaperOcrInProgress: { key: '3.QUEUED_FOR_SCANNING', value: 0, data: null },
        newOriginalAdded: { key: '4.READY_FOR_ENTRY', value: 0, data: null },
        completed: { key: '5.DONE', value: 0, data: null },
      },
      documentRemarksStatus: {
        remarksAndQuestions: { attribute: 'NOTE', value: 0, data: null },
      },
      riskAssessmentStatus: {
        noOfRiskAssV3ToDo: { key: 'RiskToDo', value: 0, data: null },
        noOfRiskAssV3OldToDo: { key: 'OldRiskAss', value: 0, data: null },
        noOfRiskAssV3ToSignToDo: { key: 'NeededToBeSignedRiskAss', value: 0, data: null },
        noOfCompletedRisk: { key: 'CompletedRiskAss', value: 0, data: null },
      },
      inventoryStatus: {
        noOfInvProducts: { key: 'NO_OF_INVENTORY_PRODUCTS', value: 0, data: null },
        noOfInvItems: { key: 'NO_OF_INVENTORY_ITEMS', value: 0, data: null }
      },
      latestUpdatedProdList: [],
      measureList: [],
      hasSignRAPermission: false,
      hasRAPermission: false,
      loading: true,
      showDocumentStatusModal: false,
      showDocumentRemarksModal: false,
      showRiskAssessmentStatusModal: false,
      showInventoryStatusModal: false,
      documentStatusModalData: null,
      documentRemarksModalData: null,
      riskAssessmentModalData: null,
      inventoryModalData: null,
      perPage: 20,
      showMeasureListModal: false,
      measureRiskId: null
    };
  },
  methods: {
    getOverviewData(showAll, selectedNode) {
      this.loading = true;
      return axios.cancelAll()
        .postWithCancelToken('/Overview/GetOverviewDataForChemsoft', { showAll: showAll, orgID: selectedNode.orgID.id, orgMdbId: selectedNode.orgID.id_mdbID })
        .then(response => {
          response.data = JSON.parse(response.data);
          var docStatus = response.data.DocStatusList.reduce((acc, f) => { acc[f.StatusID] = f.Amount; return acc; }, {});
          var remarksStatus = response.data.DocsList.reduce((acc, f) => { acc[f.AttributeId] = f.Amount; return acc; }, {});
          Object.values(this.documentStatus).forEach(f => f.value = docStatus[f.key]);
          Object.values(this.documentRemarksStatus).forEach(f => f.value = remarksStatus[f.attribute]);
          this.riskAssessmentStatus.noOfRiskAssV3ToDo.value = response.data.NoOfRiskAssV3ToDo;
          this.riskAssessmentStatus.noOfRiskAssV3OldToDo.value = response.data.NoOfRiskAssV3OldToDo;
          this.riskAssessmentStatus.noOfRiskAssV3ToSignToDo.value = response.data.NoOfRiskAssV3ToSignToDo;
          this.riskAssessmentStatus.noOfCompletedRisk.value = response.data.OverviewCompletedToDo.NoOfCompletedRisk;
          this.inventoryStatus.noOfInvProducts.value = response.data.NoOfInvProducts;
          this.inventoryStatus.noOfInvItems.value = response.data.NoOfInv;
          this.hasRAPermission = response.data.HasRAPermission;
          this.hasSignRAPermission = response.data.HasSignRAPermission;
          this.latestUpdatedProdList = response.data.LatestUpdatedProdList;
          this.measureList = response.data.MeasureList;
          this.loading = false;
        }).catch(errorDebug);
    },
    nodeSelected() {
      this.documentStatusModalData = null;
      this.documentRemarksModalData = null;
      this.riskAssessmentModalData = null;
      this.inventoryModalData = null;
      Object.values(this.documentStatus).forEach(f => f.data = null);
      Object.values(this.documentRemarksStatus).forEach(f => f.data = null);
      Object.values(this.riskAssessmentStatus).forEach(f => f.data = null);
      Object.values(this.inventoryStatus).forEach(f => f.data = null);
      this.getOverviewData(true, this.sideTree.getSelectedDepartment());
    },
    idToSlashedString: idToSlashedString,
    openDocumentModal(type) {
      this.showDocumentStatusModal = true;
      var selected = Object.values(this.documentStatus).find(f => f.key === type);
      if (selected.data)
        return this.documentStatusModalData = selected.data;

      var selectedNode = this.sideTree.getSelectedDepartment();
      return axios.postWithCancelToken('/OverviewDocumentStatus/ShowDocumentStatus', { orgId: selectedNode.orgID.id, orgID_mdbID: selectedNode.orgID.id_mdbID, statusId: type })
        .then(response => {
          selected.data = response.data;
          this.documentStatusModalData = selected.data
        })
        .catch(errorDebug);
    },
    openDocumentRemarksModal(attribute) {
      this.showDocumentRemarksModal = true;

      var selectedNode = this.sideTree.getSelectedDepartment();

      return axios.postWithCancelToken('/OverviewDocumentRemarks/ShowDocumentRemarks', { orgId: selectedNode.orgID.id, orgID_mdbID: selectedNode.orgID.id_mdbID, attribute: attribute, status: null })
        .then(response => {
          this.documentRemarksModalData = response.data;
        })
        .catch(errorDebug);
    },
    openRiskAssessmentModal(type) {
      this.showRiskAssessmentStatusModal = true;
      var selected = Object.values(this.riskAssessmentStatus).find(f => f.key === type);
      if (selected.data)
        return this.riskAssessmentModalData = selected.data;

      var selectedNode = this.sideTree.getSelectedDepartment();
      return axios.postWithCancelToken('/OverviewToDo/OverviewToDoForChemsoft', { orgId: selectedNode.orgID.id, orgID_mdbID: selectedNode.orgID.id_mdbID, type: type })
        .then(response => {
          selected.data = response.data;
          this.riskAssessmentModalData = selected.data;
        })
        .catch(errorDebug);
    },
    openInventoryModal(type) {
      this.showInventoryStatusModal = true;
      var selected = Object.values(this.inventoryStatus).find(f => f.key === type);
      if (selected.data)
        return this.inventoryModalData = selected.data;

      var selectedNode = this.sideTree.getSelectedDepartment();
      return axios.postWithCancelToken('/OverviewToDo/InventoriesProductsChemsoft', { orgId: selectedNode.orgID.id, orgID_mdbID: selectedNode.orgID.id_mdbID, type: type })
        .then(response => {
          selected.data = response.data;
          this.inventoryModalData = selected.data;
        })
        .catch(errorDebug);
    },
    saveCustomerAnswers(docRemarks) {
      axios.postWithCancelToken('/OverviewDocumentRemarks/SaveForChemsoft', { model: docRemarks })
        .then(response => {
          this.cancelDocumentRemarksModal();
          this.openDocumentRemarksModal(response.data.attribute)
        })
        .catch(errorDebug);
    },
    cancelDocumentsModal() {
      this.showDocumentStatusModal = false;
      this.showDocumentRemarksModal = false;
      this.documentStatusModalData = null;
    },
    cancelDocumentRemarksModal() {
      this.showDocumentRemarksModal = false;
      this.documentRemarksModalData = null;
    },
    cancelRiskModal() {
      this.showRiskAssessmentStatusModal = false;
      this.riskAssessmentModalData = null;
    },
    cancelInventoryModal() {
      this.showInventoryStatusModal = false;
      this.inventoryModalData = null;
    },
    createProdId(prod) {
      return { id: prod.ProdID, id_mdbID: prod.ProdID_mdbID };
    },
    completeMeasure(item) {
      this.confirm(this.getTranslation('I00.00030850', 'Complete'), this.getTranslation('I00.00056100', 'Are you sure you want to complete this measure?'))
        .then(() => axios.post('/ProductPage/SaveOneOffMeasures', { measureId: item.MeasureID, riskId: item.ID }))
        .then(response => {
          if (response.data.isSaved)
            this.measureList = this.measureList ? this.measureList.filter(x => x.MeasureID != item.MeasureID) : this.measureList;
        }).catch(this.errorDebug);
    },
    getMeasures(id) {
      this.showMeasureListModal = true;
      this.measureRiskId = id;
    },
    parseDate,
  },
  computed: {
    selectedMeasures() {
      return this.measureList ? this.measureList.filter(x => x.ID == this.measureRiskId) : null;
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisOverviewPage'] = this;
    if (this.sideTree.getSelectedDepartment()) {
      this.getOverviewData(true, this.sideTree.getSelectedDepartment());
    }

    this.getTranslation('I00.00030850', 'Complete');
    this.getTranslation('I00.00056100', 'Are you sure you want to complete this measure?');
    this.getTranslation('I00.00012130', 'All');
  },
  beforeDestroy() {
    axios.cancelAll();
  }
};
</script>