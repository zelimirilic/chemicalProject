<template>
	<div class="scrollWrap pb-4">
		<div class="row px-4 pt-20 align-items-start">
			<div class="col-12 pb-20">
				<InputGroup v-model="risk.activity.name" :placeholder="getTranslation('I00.00049430', 'Activity name')" :text="getTranslation('I00.00049430', 'Activity name')" required />
			</div>
			<HalfBox class="pb-xl-0 pb-20">
				<label>{{ getTranslation('I00.00013050', 'Products') }}</label>
				<div class="specialType input-group" withReadOnlyMode>
					<Select :items="listedProducts" prop="name" :value="listedProducts[0]" @input="productSelected" />
					<div class="input-group-append" v-tooltip="getTranslation('I00.00013100', 'Add')" @click="showAddProductModal = true"><span class="input-group-text icons icon-plus"></span></div>
				</div>
				<div class="mxhp-142 mt-3 scrollBar">
					<div class="statements d-flex align-items-center" v-for="(item, index) in risk.activity.activityItems" :key="index">
						<div class="col-2">{{ item.artNo }}</div>
						<div class="col-8">{{ item.name }}</div>
						<div class="col-2 text-right"><span class="icons icon-delete plainIcn xsmallIcn p-2" @click="removeProduct(item.prodID)" v-tooltip.left="getTranslation('I00.00039230', 'Delete')" withReadOnlyMode></span></div>
					</div>
				</div>
			</HalfBox>
			<HalfBox>
				<label>{{ getTranslation('I00.00021930', 'Risk source') }}</label>
				<div class="specialType input-group" withReadOnlyMode>
					<input class="form-control" :placeholder="getTranslation('I00.00021780', 'Additional sources of risk')" :text="getTranslation('I00.00021780', 'Additional sources of risk')" size="30" v-model="additionalRisk" @keyup.enter="addRiskSource" />
					<div class="input-group-append" v-tooltip="getTranslation('I00.00013100', 'Add')" @click="addRiskSource"><span class="input-group-text icons icon-plus"></span></div>
				</div>
				<div class="mxhp-142 mt-3 scrollBar">
					<div class="statements d-flex align-items-center" v-for="(source, index) in risk.additionalRiskSource" :key="index">
						<div class="col">{{ source }}</div>
						<div class="col-auto"><span class="icons icon-delete plainIcn xsmallIcn p-2" @click="risk.additionalRiskSource.removeAt(index)" v-tooltip.left="getTranslation('I00.00039230', 'Delete')" withReadOnlyMode></span></div>
					</div>
				</div>
			</HalfBox>
		</div>
		<CardBox class="mt-5" additionalClass="lightGrayBg borderT" :text="getTranslation('I00.00014690', 'Handling')">
			<div class="row px-4 align-items-start">
				<HalfBox class="pb-20">
					<SelectGroup class="mt-4 mb-0" :text="getTranslation('I00.00019140', 'Process category')" :disabledItems="handlingProcessCategories" :items="options.procList" :prop="procText" :value="options.procList[0]" @input="procSelected" />
					<div class="mxhp-142 mt-3 scrollBar">
						<div class="statements d-flex align-items-center" v-for="(proc, ind) in handlingProcessCategories" :key="ind">
							<div class="col">{{ procText(proc) }}</div>
							<div class="col-auto"><span class="icons icon-delete plainIcn xsmallIcn p-2" @click="risk.handlingProcessCategory.removeAt(ind)" v-tooltip.left="getTranslation('I00.00039230', 'Delete')" withReadOnlyMode></span></div>
						</div>
					</div>
					<SelectGroup class="mt-4 mb-0" :text="getTranslation('I00.00027860', 'Ventilation label')" :items="options.operationEnvironmentTypeList" prop="text" :value="selectedProp('operationEnvironmentType', 'operationEnvironmentTypeList')" @input="propSelected('operationEnvironmentType', $event)" />
				</HalfBox>
				<HalfBox class="pb-20">
					<SelectGroup class="mt-xl-4 mb-0" :text="getTranslation('I00.00027850', 'HandlingTypeLabel')" :items="options.handlingTypeList" prop="text" :value="selectedProp('handlingType', 'handlingTypeList')" @input="propSelected('handlingType', $event)" />
					<CheckBoxGroup class="mt-4" v-model="risk.handlingWaste">{{ getTranslation('I00.00025360', 'Produces waste of chemical product') }}</CheckBoxGroup>
					<CheckBoxGroup class="mt-3" v-model="risk.handlingCauseFire" @input="causeFireChanged">{{ getTranslation('I00.00019150', 'Can cause fire') }}</CheckBoxGroup>
					<div class="subGroup mt-2" v-show="risk.handlingCauseFire">
						<CheckBoxGroup :subGroup="true" v-model="risk.handlingCauseExplosiveAtmosphere">{{ getTranslation('I00.00019160', 'HandlingCauseExplosiveAtmosphereLabel') }}</CheckBoxGroup>
						<CheckBoxGroup :subGroup="true" v-model="risk.handlingWorkOnNonEmptyContainer">{{ getTranslation('I00.00022060', 'HandlingWorkOnNonEmptyContainerLabel') }}</CheckBoxGroup>
					</div>
					<CheckBoxGroup class="mt-3" v-model="risk.handlingPreviousAccidentOrIncident">{{ getTranslation('I00.00019170', 'Incidents and/or accidents have occurred') }}</CheckBoxGroup>
				</HalfBox>
				<div class="col-12">
					<TextAreaGroup :text="getTranslation('I00.00002980', 'HandlingDescriptionLabel')" v-model="risk.handlingDescription" required></TextAreaGroup>
				</div>
			</div>
		</CardBox>
		<div class="doubleBox row no-gutters">
			<HalfBox class="mt-5 mb-xl-0 mb-3" :text="getTranslation('I00.00013690', 'Exposure')">
				<div class="row px-4">
					<div class="col-xl-4 col-6">
						<SelectGroup class="mt-4" :items="options.exposedFrequencyList" :text="getTranslation('I00.00020990', 'Frequency')" prop="text" :value="selectedProp('exposedFrequency', 'exposedFrequencyList')" @input="propSelected('exposedFrequency', $event)" />
					</div>
					<div class="col-xl-4 col-6">
						<SelectGroup class="mt-4" :items="options.exposedDurationList" :text="getTranslation('I00.00021000', 'Duration')" prop="text" :value="selectedProp('exposedDuration', 'exposedDurationList')" @input="propSelected('exposedDuration', $event)" />
					</div>
					<div class="col-xl-4 col-6">
						<InputGroup class="mt-4" :text="getTranslation('I00.00014590', 'ExposedNumberOfPeopleLabel')" v-model="risk.exposedNumberOfPeople" />
					</div>
					<div class="col-12">
						<CheckBoxGroup class="mt-4" v-model="risk.exposedMoreThenTwoMonthsPerYear">{{ getTranslation('I00.00019180', 'ExposedMoreThenTwoMonthsPerYearLabel') }}</CheckBoxGroup>
					</div>
				</div>
			</HalfBox>
			<HalfBox class="mt-5 mb-xl-0 mb-3" :text="getTranslation('I00.00018800', 'Quantity of hazardous product')">
				<div class="row px-4">
					<div class="col-6">
						<SelectGroup class="mt-4" :items="options.amountsUsageStorageList" prop="text" :text="getTranslation('I00.00026280', 'Consumption')" :value="selectedProp('amountsUsage', 'amountsUsageStorageList')" @input="propSelected('amountsUsage', $event)" />
					</div>
					<div class="col-6">
						<SelectGroup class="mt-4" :items="options.amountsUsageStorageList" prop="text" :text="getTranslation('I00.00009610', 'Storage')" :value="selectedProp('amountsStorage', 'amountsUsageStorageList')" @input="propSelected('amountsStorage', $event)" />
					</div>
				</div>
			</HalfBox>
		</div>
		<CardBox class="mt-5" additionalClass="lightGrayBg borderT" :text="getTranslation('I00.00018820', 'Product attributes')">
			<div class="row px-4 align-items-start">
				<HalfBox class="pb-xl-0 pb-20">
					<SelectGroup class="mt-4" :text="getTranslation('I00.00016920', 'Physical state')" :items="options.operationFormList" :disabledItems="productAttributesForms" prop="text" :value="options.operationFormList[0]" @input="operationSelected" />
					<Badge class="mx-2 mb-2" v-for="(item, ind) in productAttributesForms" :key="ind" @delete="risk.productAttributesForm.removeAt(ind)">{{ item.text }}</Badge>
					<CheckBoxGroup class="mt-4" v-model="risk.productAttributesSpecialAtributes">{{ getTranslation('I00.00019300', 'Special product properties') }}</CheckBoxGroup>
					<div class="subGroup mt-2" v-if="risk.productAttributesSpecialAtributes">
						<CheckBoxGroup :subGroup="true" v-for="attr in options.allProductAttributes" v-model="risk[attr.prop.camelCase()]" :key="attr.prop.camelCase()">{{ attr.text }}</CheckBoxGroup>
						<div class="subGroupInner d-flex align-items-center mr-0">
							<CheckBoxGroup v-model="risk.productAttributesOther">{{ getTranslation('I00.00021700', 'Other') }}</CheckBoxGroup>
							<InputGroup class="ml-3" v-model="risk.productAttributesOtherText" :validations="[maxLength(200)]"></InputGroup>
						</div>
					</div>
				</HalfBox>
				<HalfBox>
					<div class="mt-4 pb-3">
						<h6 class="px-3 py-2 lightGrayBg">{{ getTranslation('I00.00014470', 'Classification') }}</h6>
						<div class="px-2">
							<img class="img-fluid iconPx48 mx-2 mt-3" v-for="(symbol, index) in common.getGhsClpSymbols(risk.activity.activityItems)" :key="index" :src="getPictogram(symbol)" alt="" :title="getPictogramTitle(symbol)" />
						</div>
						<div class="px-3 pt-2">
							<p class="pt-2" v-for="(code, ind) in common.getRCodesClassification(risk)" :key="ind">{{ code }}</p>
						</div>
					</div>
				</HalfBox>
			</div>
		</CardBox>
		<div class="doubleBox row no-gutters">
			<HalfBox class="mt-5" :text="getTranslation('I00.00011680', 'Participants')">
				<TextAreaGroup class="mt-4 px-4" v-model="risk.contributingPersonal"></TextAreaGroup>
			</HalfBox>
			<HalfBox class="mt-5" :text="getTranslation('I00.00018850', 'Obligations and restrictions')">
				<div class="px-4">
					<CheckBoxGroup class="mt-4" v-model="risk.obligationsAndRestrictionsWorkPermit">{{ getTranslation('I00.00019500', 'ObligationsAndRestrictionsWorkPermitLabel') }}</CheckBoxGroup>
					<CheckBoxGroup class="mt-3" v-model="risk.obligationsAndRestrictionsAirExposureMeasurement">{{ getTranslation('I00.00019510', 'ObligationsAndRestrictionsAirExposureMeasurementLabel') }}</CheckBoxGroup>
					<CheckBoxGroup class="mt-3" v-model="risk.obligationsAndRestrictionsInstructionToTheReceiversOfHazardousWaste">{{ getTranslation('I00.00019520', 'ObligationsAndRestrictionsInstructionToTheReceiversOfHazardousWasteLabel') }}</CheckBoxGroup>
					<CheckBoxGroup class="mt-3" v-model="risk.obligationsAndRestrictionsInstructionRegisterOfUsers">{{ getTranslation('I00.00019530', 'ObligationsAndRestrictionsInstructionRegisterOfUsersLabel') }}</CheckBoxGroup>
					<CheckBoxGroup class="mt-3" v-model="risk.obligationsAndRestrictionsEvacuationPlan">{{ getTranslation('I00.00026130', 'LabelObligationsAndRestrictionsEvacuationPlan') }}</CheckBoxGroup>
					<CheckBoxGroup class="mt-3" v-model="risk.obligationsAndRestrictionsPermissionFromTheWorkEnvironment">{{ getTranslation('I00.00019550', 'ObligationsAndRestrictionsPermissionFromTheWorkEnvironmentLabel') }}</CheckBoxGroup>
					<CheckBoxGroup class="mt-3" v-model="risk.obligationsAndRestrictionsSubstitution">{{ getTranslation('I00.00012140', 'ObligationsAndRestrictionsSubstitutionLabel') }}</CheckBoxGroup>
					<CheckBoxGroup class="mt-3" v-model="risk.obligationsAndRestrictionsStorageRestriction">{{ getTranslation('I00.00025970', 'ObligationsAndRestrictionsStorageRestrictionLabel') }}</CheckBoxGroup>
				</div>
			</HalfBox>
		</div>
		<CardBox class="mt-5" additionalClass="lightGrayBg borderT" :text="getTranslation('I00.00019100', 'InternalNotes')">
			<TextAreaGroup class="mt-4 mb-0 px-4" v-model="risk.handlingInstructions.internalNotes"></TextAreaGroup>
		</CardBox>
		<ModalDialog additional-class="w-80" :withFooter="true" :title="getTranslation('I00.00007080', 'Search product')" @close="showAddProductModal = false" v-show="showAddProductModal">
			<InventoryAddSimple @productPicked="addProductToList" @productRemoved="removeProduct" @cancel="showAddProductModal = false" :addedProductsIds="getAddedProductIds()" :isVisible="showAddProductModal" :selectMultipleProducts="true" withConsumption withProductType :validations="validations" />
		</ModalDialog>
	</div>
</template>

<script>
import axios from '../../../axios';
import { idsAreEqual, errorDebug, isNullOrEmpty, camelCaseObj } from '../../../libraries/common';
import InventoryAddSimple from '../../../components/inventory/InventoryAddSimple';
import { getPictogram, getPictogramTitle } from '../../../libraries/product';
import { validators } from '../../../libraries/forms';
import Badge from '../../common/badge/Badge';

export default {
  components: {
    InventoryAddSimple,
    Badge
  },
  data() {
    return {
      value: null,
      products: null,
      additionalRisk: '',
      orgId: null,
      showAddProductModal: false,
      $modelValidators: [],
    };
  },
  props: ['risk', 'options', 'common'],

  methods: {
    maxLength: validators.maxLength,
    addRiskSource() {
      if (!this.additionalRisk.isNullOrEmpty()) {
        this.risk.additionalRiskSource.push(this.additionalRisk);
      }
    },
    getPictogram: getPictogram,
    getPictogramTitle: getPictogramTitle,
    getAddedProductIds() {
      return this.risk ? this.risk.activity.activityItems.map(x => x.prodID) : []
    },
    removeProduct(productId) {
      var actProd = this.risk.activity.activityItems.find(x => idsAreEqual(x.prodID, productId));
      this.risk.activity.activityItems.remove(actProd);
      if (this.risk.exposureScenarios)
        this.risk.exposureScenarios = this.risk.exposureScenarios
          .filter(f => this.risk.activity.activityItems.any(g => idsAreEqual(f.productVariant.id, g.prodID)));
    },
    addProductToList(product) {
      var actProd = { ...product, id: undefined, prodID: product.id, showPictogram: [], productClassificationCode: { dangerSymbols: [], rcodes: [] }, substances: [] };
      this.risk.activity.activityItems.push(actProd);
      return axios.post('/RiskAssessmentComplete/GetProductForRisk', { productId: actProd.prodID, isCustomerProduct: actProd.isCustomerProduct })
        .then(response => {
          if (!isNullOrEmpty(response.data)) {
            var product = camelCaseObj(response.data);

            var ind = this.risk.activity.activityItems.indexOf(actProd);
            if (ind > -1) {
              this.risk.activity.activityItems = [
                ...this.risk.activity.activityItems.takeFromTo(0, ind - 1),
                product,
                ...this.risk.activity.activityItems.takeFromTo(ind + 1, this.risk.activity.activityItems.length)
              ];
            }

            if (!this.products.any(f => idsAreEqual(f.prodID, product.prodID)))
              this.products.push(product);
          }
        })
        .catch(errorDebug);
    },
    nodeSelected(event) {
      if (!this._inactive) {
        this.products = [];
        this.getAllProducts(event.orgID.id, event.orgID.id_mdbID);
      }
    },
    getAllProducts(id, id_mdbID) {
      return axios.post('/RiskAssessmentComplete/GetAvailableProducts', { orgID: id, orgID_mdbID: id_mdbID })
        .then(response => {
          var data = camelCaseObj(response.data);
          this.products = [
            ...data,
            ...this.risk.activity.activityItems.filter(f => !data.any(g => idsAreEqual(f.prodID, g.prodID)))
          ];

          if (this.$route.query.product !== undefined) {
            this.risk.activity.activityItems.forEach((item, ind) => {
              var product = this.products.find(f => idsAreEqual(f.prodID, item.prodID));
              this.risk.activity.activityItems[ind] = { ...product };
            });
          }
        })
        .catch(errorDebug);
    },
    productSelected(prod) {
      if (prod.prodID)
        this.risk.activity.activityItems.push({ ...prod });
    },
    procSelected(proc) {
      this.risk.handlingProcessCategory.push(proc.value);
    },
    operationSelected(proc) {
      this.risk.productAttributesForm.push(proc.value);
    },
    procText(proc) {
      if (proc.value) return proc.value + ' - ' + proc.text;
      return proc.text;
    },
    propText(prop) {
      if (prop.value) return prop.text;
      return prop.text;
    },
    selectedProp(riskProp, optionListType) {
      if (this.risk[riskProp])
        return this.options[optionListType]
          .find(f => f.value === this.risk[riskProp]);
      return this.options[optionListType].first();
    },
    propSelected(prop, item) {
      this.$set(this.risk, prop, item.value);
    },
    getLists(riskList, optionList) {
      return riskList.map(f => optionList.find(g => g.value === f));
    },
    causeFireChanged(value) {
      if (!value) {
        this.risk.handlingCauseExplosiveAtmosphere = false;
        this.risk.handlingWorkOnNonEmptyContainer = false;
      }
    },
    /**
     *Deals with fields that, if not valid, saving of risk is not possible
     */
    isValidForSave() {
      if (this.risk.productAttributesOtherText && this.risk.productAttributesOtherText.length > 200) return false;
      //... add conditions here
      return true;
    }
  },
  computed: {
    validations() {
      return selectedProduct => [
        {
          fnc: () => !this.risk.activity.activityItems.length || this.risk.activity.activityItems.all(f => !idsAreEqual(f.prodID, selectedProduct.id)),
          message: () => this.getTranslation('I00.00022000', 'This product is already chosen.Please try another one.')
        },
      ];
    },
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    listedProducts() {
      return [{ name: this.getTranslation('I00.00006640', 'Pick from list') + '...' }]
        .pushMany(
          (this.products || []).filter(prod => {
            return !this.risk.activity.activityItems.any(sel => {
              return idsAreEqual(prod.prodID, sel.prodID);
            });
          }).sortBy(f => f.name)
        );
    },
    productAttributesForms() {
      return this.getLists(this.risk.productAttributesForm, this.options.operationFormList);
    },
    handlingProcessCategories() {
      return this.getLists(this.risk.handlingProcessCategory, this.options.procList);
    }
  },
  translationsLoaded() {
    if (process.env.NODE_ENV === 'development') window['thisHandling'] = this;
    this.getTranslation('I00.00022000', 'This product is already chosen.Please try another one.');

    if (this.sideTree.getSelectedDepartment()) {
      this.nodeSelected(this.sideTree.getSelectedDepartment());
    }
  },
  activated() {
    if (this.sideTree.getSelectedDepartment() && !this.products) {
      this.nodeSelected(this.sideTree.getSelectedDepartment());
    }
  },
};
</script>