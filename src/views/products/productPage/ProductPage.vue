<template>
	<MainLoader v-if="!protectionSymbols && !risksCount" />
	<div v-else>
		<div class="row align-items-center">
			<div class="col">
				<h4 class="d-flex flex-row align-items-center">
					<span class="statusBox mr-2" :class="statusClass" v-if="statusClass && !appSettings.hideTrafficLight"></span>
					<span>{{ product.name || (productFromRoot || {}).name }}</span>
					<span class="tooltipInfo big icons icon-info plainIcn ml-1" v-tooltip="getTranslation('I00.00054350', 'Original product name') + ': ' + (productFromRoot || {}).name" v-if="(productFromRoot || {}).name"></span>
				</h4>
			</div>
			<div class="col-auto ml-auto">
				<PictogramsEditor :product="product" :protectionSymbols="protectionSymbols" @saved="productSaved" />
			</div>
		</div>
		<div class="row">
			<div class="col-xl-5 col-12 mb-xl-0 mb-4">
				<BasicProductInformationBoxEditor :product="product" :productFromRoot="productFromRoot" :loaderSS="ssLoader" @saved="productSaved" @showBaseAndActivitySafetySheet="showBaseAndActivitySafetySheet" />
				<ModalDialog additional-class="w-40" v-if="showSafetySheetsModal" :withFooter="true" :title="getTranslation('I00.00027690', 'Please choose what you\'d like to see safety sheet for')" @close="showSafetySheetsModal = false">
					<SafetySheetModalDialogList :data="risks" :product="product" @cancel="showSafetySheetsModal = false" />
				</ModalDialog>
				<ProductTypesEditor :product="product" />
				<SynonymsBoxEditor :product="product" @saved="productSaved" />
				<ClassificationBoxEditor :product="product" />
			</div>
			<div class="col-xl-7 col-12">
				<div class="card mt-4" v-if="!this.appSettings.hideProductPageLists && !this.appSettings.distributorMode">
					<Accordion :text="getTranslation('I00.00005540', 'Restriction and prohibition lists')" v-model="listsOpened">
						<RestrictionAndProhibitionListsEditor :product="product" ref="restrictionAndProhibitionListsEditor" />
					</Accordion>
				</div>
				<div class="card mt-4" v-if="!this.appSettings.hideSubstances">
					<Accordion :text="getTranslation('I00.00054110', 'Product composition')" v-model="compositionBoxOpened">
						<SmallLoader @mounted="getSubstances" v-if="!substances" />
						<CompositionTableEditor :substances="substances" :product="product" @getSubstances="getSubstances()" v-else />
					</Accordion>
				</div>
				<div class="card mt-4">
					<Accordion :text="getTranslation('I00.00025640', 'Activities')" v-model="risksOpened">
						<SmallLoader @mounted="getRisks" v-if="!risks" />
						<DataTable :tableData="risks" noHeader noSearch noFooter v-else>
							<template #head>
								<tr>
									<th>{{ getTranslation('I00.00025650', 'Activity name') }}</th>
									<th>{{ getTranslation('I00.00002980', 'Description') }}</th>
									<th class="prioCell">{{ getTranslation('I00.00021720', 'Risk level') }}</th>
									<th>{{ getTranslation('I00.00002940', 'Department') }}</th>
									<th class="text-center">{{ getTranslation('I00.00000170', 'Safety sheet') }}</th>
								</tr>
							</template>
							<template #body="{ item }">
								<tr>
									<td class="bold">
										<router-link class="secondaryTxt" :to="{ name: 'readOnlyRisk', params: { riskId: item.id, component: 'summary' } }">{{ item.activity.name }}</router-link>
									</td>
									<td>
										<router-link :to="{ name: 'readOnlyRisk', params: { riskId: item.id, component: 'summary' } }">{{ item.handlingDescription }}</router-link>
									</td>
									<td class="prioCell">
										<div class="tooltipPrio">
											<p :class="'raLvl' + item.totalRisk">{{ item.totalRisk }}</p>
										</div>
									</td>
									<td>
										<HoverElement>
											{{ item.activity.department.name }}
											<template #hover>
												{{ findNodeNamePath(item.activity.department.orgID) }}
											</template>
										</HoverElement>
									</td>
									<td class="text-center">
										<router-link :to="{ name: 'activity', params: { id: item.id, component: 'safety_sheet' } }"><span v-tooltip="getTranslation('I00.00000170', 'Safety sheet')" class="icons icon-safetysheet plainIcn mediumIcn"></span></router-link>
									</td>
								</tr>
							</template>
						</DataTable>
					</Accordion>
				</div>
				<DocumentsBoxEditor :orgId="this.sideTree.getSelectedDepartment().orgID" :product="product" :risks="risks" :risksCount="risksCount" @get-risks="getRisks" @exposure-scenario-changed="$refs.exposureScenarioEditor.getCompliance()" />
				<div class="card mt-4" v-if="this.appSettings.organisationSpecificFields">
					<Accordion :text="getTranslation('I00.00028730', 'Own fields')" v-model="ownFieldsOpened">
						<OwnFieldsBoxEditor :product="product" ref="ownFieldsEditor" />
					</Accordion>
				</div>
				<ExposureScenarioEditor :product="product" ref="exposureScenarioEditor" v-if="this.appSettings.enableExposureScenarioOnProductPage" />
			</div>
		</div>
	</div>
</template>
<script>
import axios from '../../../axiosOld-DONOTUSE';
import { errorDebug, camelCaseObj, isLocalID } from '../../../libraries/common';
import { findNodeNamePath } from '../../../libraries/tree';
import BasicProductInformationBoxEditor from '../../../components/products/productPage/BasicProductInformationBoxEditor';
import ProductTypesEditor from '../../../components/products/productPage/ProductTypesEditor';
import SynonymsBoxEditor from '../../../components/products/productPage/SynonymsBoxEditor';
import DocumentsBoxEditor from '../../../components/products/productPage/DocumentsBoxEditor';
import Accordion from '../../../components/common/accordion/Accordion';
import HoverElement from '../../../components/common/others/HoverElement';
import ExposureScenarioEditor from '../../../components/products/productPage/ExposureScenarioEditor';
import CompositionTableEditor from '../../../components/common/composition/CompositionTableEditor';
import PictogramsEditor from '../../../components/products/productPage/PictogramsEditor';
import RestrictionAndProhibitionListsEditor from '../../../components/products/productPage/RestrictionAndProhibitionListsEditor';
import OwnFieldsBoxEditor from '../../../components/products/productPage/OwnFieldsBoxEditor';
import ClassificationBoxEditor from '../../../components/products/productPage/ClassificationBoxEditor';
import SafetySheetModalDialogList from '../productPage/SafetySheetModalDialogList'

export default {
  name: 'ProductPage',
  components: {
    BasicProductInformationBoxEditor,
    ProductTypesEditor,
    SynonymsBoxEditor,
    DocumentsBoxEditor,
    Accordion,
    HoverElement,
    ExposureScenarioEditor,
    CompositionTableEditor,
    PictogramsEditor,
    RestrictionAndProhibitionListsEditor,
    OwnFieldsBoxEditor,
    ClassificationBoxEditor,
    SafetySheetModalDialogList
  },
  props: ['id'],
  data() {
    return {
      product: null,
      productFromRoot: null,
      statusClass: null,
      protectionSymbols: null,
      risksOpened: false,
      listsOpened: false,
      ownFieldsOpened: false,
      risks: null,
      restrictionLists: null,
      departmentOwnFields: null,
      hasSunsetDate: false,
      risksCount: null,
      compositionBoxOpened: false,
      substances: null,
      showSafetySheetsModal: false,
      loaderSS: false
    }
  },
  methods: {
    nodeSelected() {
      this.protectionSymbols = null;
      this.departmentOwnFields = null;
      this.loaderSS = false;
      this.risks = null;
      (!this.product ? this.getProductData() : new Promise(resolve => resolve()))
        .then(() => this.getCountRisks())
        .then(() => this.getProtectionSymbolsAndTrafficLight())
    },
    getProductData() {
      return axios.cancelAll()
        .postWithCancelToken('/ProductPage/GetProduct', { productId: this.id })
        .then(response => {
          this.product = camelCaseObj(JSON.parse(response.data.product));
          this.productFromRoot = camelCaseObj(response.data.productFromRoot);
          if (!isLocalID(this.product.id))
            this.productFromRoot.ufiFromRoot = (response.data || {}).ufiFromRoot;
        })
        .catch(errorDebug);
    },
    getProtectionSymbolsAndTrafficLight() {
      return axios.postWithCancelToken('/ProductPage/GetProtectionSymbolsAndTrafficLight', { productId: this.id })
        .then(response => {
          var data = camelCaseObj(response.data);
          this.statusClass = data.statusClass;
          this.protectionSymbols = data.protectionSymbols;
        })
        .catch(errorDebug);
    },
    getOwnFieldsLists() {
      return axios.postWithCancelToken('/ProductPage/GetOwnFieldsLists', { productId: this.id })
        .then(response => {
          var data = camelCaseObj(response.data);
          this.departmentOwnFields = data;
        })
        .catch(errorDebug);
    },
    getRisks() {
      axios.postWithCancelToken('/Departments/LastSignedRisksForProduct', { prodId: this.id, orgid: this.sideTree.getSelectedDepartment().orgID, withGeneralRA: true })
        .then(response => this.risks = camelCaseObj(response.data))
        .catch(errorDebug);
    },
    getCountRisks() {
      axios.postWithCancelToken('/Departments/LastSignedRisksForProduct', { prodId: this.id, orgid: this.sideTree.getSelectedDepartment().orgID, withGeneralRA: true, count: true })
        .then(response => this.risksCount = camelCaseObj(response.data))
        .catch(errorDebug);
    },
    getSubstances() {
      return axios.postWithCancelToken('/ProductPage/GetSubstances', { productId: this.product.id })
        .then(response => this.substances = camelCaseObj(response.data))
        .catch(errorDebug);
    },
    productSaved(event) {
      this.product = { ...this.product, ...event }
    },
    isLocalID: isLocalID,
    findNodeNamePath,
    showBaseAndActivitySafetySheet() {
      this.loaderSS = true;
      if (!this.risks) {
        axios.postWithCancelToken('/Departments/LastSignedRisksForProduct', { prodId: this.id, orgid: this.sideTree.getSelectedDepartment().orgID, withGeneralRA: true })
          .then(response => {
            this.risks = camelCaseObj(response.data);
            if (this.risks && this.risks.length > 0) {
              this.showSafetySheetsModal = true;
            }
            else
              this.$router.push({ name: 'product', params: { id: this.$route.params.id, component: 'safety_sheet' } });
          })
          .catch(errorDebug);
      }
      else if (this.risks && this.risks.length > 0) {
        this.showSafetySheetsModal = true;
      }
      else {
        this.$router.push({ name: 'product', params: { id: this.$route.params.id, component: 'safety_sheet' } });
      }
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisProductPage'] = this;
    if (this.sideTree.getSelectedDepartment()) {
      this.nodeSelected();
    }
  },
  computed: {
    ssLoader() {
      return this.loaderSS && !this.risks;
    }
  },
  beforeDestroy() {
    axios.cancelAll();
  }
};
</script>