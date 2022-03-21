<template>
	<div class="scrollWrap">
		<RiskDetail :risk="risk" showProductLink noEdit />
		<div class="row px-4 pt-3">
			<h6 class="col-3 mb-0">{{ getTranslation('I00.00002980', 'Description') }}:</h6>
			<div class="col-9">
				<div>{{ risk.handlingDescription || '-' }}</div>
			</div>
		</div>
		<div class="row px-4 pt-3">
			<h6 class="col-3 mb-0">{{ getTranslation('I00.00011680', 'Participants') }}:</h6>
			<div class="col-9">
				<div>{{ risk.contributingPersonal || '-' }}</div>
			</div>
		</div>
		<div class="row px-4 pt-3">
			<h6 class="col-3 mb-0">{{ getTranslation('I00.00021720', 'Risk level') }}:</h6>
			<div class="col-9">
				<div>{{ risk.totalRiskText || '-' }}</div>
			</div>
		</div>
		<div class="row px-4">
			<div :class="{ 'col-6': risk.signed }" v-if="risk.signed">
				<div class="row pt-3">
					<h6 class="col-3 mb-0">{{ getTranslation('I00.00012370', 'Signed by') }}:</h6>
					<div class="col-9">
						<div>{{ risk.signedBy || '-' }}</div>
					</div>
				</div>
				<div class="row pt-3">
					<h6 class="col-3 mb-0">{{ getTranslation('I00.00054660', 'Signed date') }}:</h6>
					<div class="col-9">
						<div>{{ parseDate(risk.signedDate) || '-' }}</div>
					</div>
				</div>
			</div>
			<div :class="{ 'col-6 pb-3 borderL': risk.signed, 'col-12': !risk.signed }">
				<div class="row align-items-center pt-3">
					<h6 class="col-3 mb-0">{{ getTranslation('I00.00019800', 'Next revision') }}:</h6>
					<div class="col-9">
						<div>{{ parseDate(risk.validUntil) || '-' }}</div>
					</div>
				</div>
				<div class="row pt-3">
					<h6 class="col-3 mb-0">{{ getTranslation('I00.00040390', 'Revision') }}:</h6>
					<div class="col-9">
						<div>{{ risk.version || '-' }}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="doubleBox row no-gutters">
			<HalfBox class="mt-5" :text="getTranslation('I00.00049740', 'Handling')">
				<template v-if="options && options.handlingTypeList && options.exposedFrequencyList && options.exposedDurationList && options.amountsUsageStorageList">
					<div class="row px-4 pt-3">
						<p class="col-4 mb-0">
							<b>{{ getTranslation('I00.00027850', 'Handling type') }}:</b>
						</p>
						<div class="col-8">{{ options.handlingTypeList.find((x) => x.value == risk.handlingType) ? options.handlingTypeList.find((x) => x.value == risk.handlingType).text : '-' }}</div>
					</div>
					<div class="row px-4 pt-3">
						<p class="col-4 mb-0">
							<b>{{ getTranslation('I00.00022070', 'Exposure frequency') }}:</b>
						</p>
						<div class="col-8">{{ options.exposedFrequencyList.find((x) => x.value == risk.exposedFrequency) ? options.exposedFrequencyList.find((x) => x.value == risk.exposedFrequency).text : '-' }}</div>
					</div>
					<div class="row px-4 pt-3">
						<p class="col-4 mb-0">
							<b>{{ getTranslation('I00.00022080', 'Exposure duration') }}:</b>
						</p>
						<div class="col-8">{{ options.exposedDurationList.find((x) => x.value == risk.exposedDuration) ? options.exposedDurationList.find((x) => x.value == risk.exposedDuration).text : '-' }}</div>
					</div>
					<div class="row px-4 pt-3">
						<p class="col-4 mb-0">
							<b>{{ getTranslation('I00.00014590', 'Number of people exposed') }}:</b>
						</p>
						<div class="col-8">{{ risk.exposedNumberOfPeople ? risk.exposedNumberOfPeople : '-' }}</div>
					</div>
					<div class="row px-4 pt-3">
						<p class="col-4 mb-0">
							<b>{{ getTranslation('I00.00026280', 'Consumption per use') }}:</b>
						</p>
						<div class="col-8">{{ options.amountsUsageStorageList.find((x) => x.value == risk.amountsUsage) ? options.amountsUsageStorageList.find((x) => x.value == risk.amountsUsage).text : '-' }}</div>
					</div>
					<div class="row px-4 pt-3">
						<p class="col-4 mb-0">
							<b>{{ getTranslation('I00.00009610', 'Storage') }}:</b>
						</p>
						<div class="col-8">{{ options.amountsUsageStorageList.find((x) => x.value == risk.amountsStorage) ? options.amountsUsageStorageList.find((x) => x.value == risk.amountsStorage).text : '-' }}</div>
					</div>
					<div class="d-flex px-4 pt-3">
						<div class="tag large" v-if="risk.handlingCauseFire">{{ getTranslation('I00.00049750', 'Fire') }}</div>
						<div class="tag large" v-if="risk.handlingCauseExplosiveAtmosphere">{{ getTranslation('I00.00019160', 'Can cause explosive atmosphere') }}</div>
					</div>
				</template>
				<SmallLoader v-else />
			</HalfBox>
			<HalfBox class="mt-5" :text="getTranslation('I00.00018820', 'Product attributes')">
				<div class="row px-4 pt-3">
					<p class="col-4 mb-0">
						<b>{{ getTranslation('I00.00016920', 'Physical state') }}:</b>
					</p>
					<div class="col-8" v-if="productAttributesForms.length == 0">{{ '-' }}</div>
					<div class="col-8" v-else>
						<div class="tag large" v-for="(element, index) in productAttributesForms" :key="index">{{ element.text }}</div>
					</div>
				</div>
				<div class="row px-4 pt-3">
					<p class="col-4 mb-0">
						<b>{{ getTranslation('I00.00019300', 'Special product properties') }}:</b>
					</p>
					<div class="col-8" v-if="risk.productAttributesSpecialAtributes && (specialproductAttributesProp.filter((f) => f.value).length > 0 || risk.productAttributesOther)">
						<div class="pb-1" v-for="attr in specialproductAttributesProp.filter((f) => f.value)" :key="attr.prop.camelCase()">{{ attr.text }}</div>
						<div class="pb-1" v-if="risk.productAttributesOther">{{ risk.productAttributesOtherText }}</div>
					</div>
					<div class="col-8" v-else>{{ '-' }}</div>
				</div>
			</HalfBox>
		</div>
		<div class="doubleBox row no-gutters">
			<HalfBox :text="getTranslation('I00.00050580', 'Pay attention to')">
				<template v-if="calculatedWarnings">
					<div class="px-4 pt-3" v-if="calculatedWarnings.length > 0">
						<div class="d-flex pt-2" v-for="(warning, ind) in calculatedWarnings" :key="ind">
							<span class="remarks icons icon-warning warnings"></span>
							<span class="remarksTxt">{{ getTranslation(warning.phraseId, 'Status') }}</span>
						</div>
					</div>
					<div v-else class="emptyTxt text-center p-4">
						<p class="icons icon-noitems plainIcn bigIcn m-0 p-0"></p>
						<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055680', 'No items found') }}</h4>
						<h6 class="mb-0">{{ getTranslation('I00.00055690', 'You don’t have any items here.') }}</h6>
					</div>
				</template>
				<SmallLoader v-else></SmallLoader>
			</HalfBox>
			<HalfBox :text="getTranslation('I00.00018850', 'Obligations and restrictions')">
				<div class="px-4 pt-3" v-if="obligationState.filter((x) => x.value).length > 0">
					<div class="d-flex pt-2" v-for="(item, ind) in obligationState.filter((f) => f.value)" :key="ind">
						<span v-if="item.value" class="remarks icons icon-warning warnings"></span>
						<span v-if="item.value" class="remarksTxt">{{ getTranslation(item.text, 'Status') }}</span>
					</div>
				</div>
				<div v-else class="emptyTxt text-center p-4">
					<p class="icons icon-noitems plainIcn bigIcn m-0 p-0"></p>
					<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055680', 'No items found') }}</h4>
					<h6 class="mb-0">{{ getTranslation('I00.00055690', 'You don’t have any items here.') }}</h6>
				</div>
			</HalfBox>
		</div>
		<div class="doubleBox row no-gutters">
			<HalfBox :text="getTranslation('I00.00050390', 'Safety instruction')">
				<div class="px-4 pt-3" v-if="common.getGhsClpSymbols(risk.activity.activityItems).length > 0 && !noProductSelected">
					<div :class="{ 'd-flex flex-row flex-wrap': risk.handlingInstructions.allPictograms, 'd-none': !risk.handlingInstructions.allPictograms }" v-show="risk.handlingInstructions.allPictograms">
						<img class="d-block img-fluid iconPx48 mx-3 mt-3" v-for="(symbol, index) in common.getGhsClpSymbols(risk.activity.activityItems)" :key="symbol + index" :src="getPictogram(symbol)" alt="" :title="getPictogramTitle(symbol)" />
					</div>
					<div :class="{ 'd-flex flex-row flex-wrap': !risk.handlingInstructions.allPictograms, 'd-none': risk.handlingInstructions.allPictograms }" v-show="!risk.handlingInstructions.allPictograms">
						<div class="text-center" v-for="(pick, ind) in common.getGhsClpSymbols(risk.activity.activityItems.filter((f) => f.showPictogram))" :key="pick + ind">
							<img class="d-block img-fluid iconPx48 mx-3 mt-3" :key="ind" :src="getPictogram(pick)" alt="" :title="getPictogramTitle(pick)" />
						</div>
					</div>
					<div class="pt-3" v-if="productSelected || defaultSelectedProduct">{{ getTranslation('I00.00025610', 'Choose SDS to base safety sheet on') }} {{ productSelected ? productSelected.name : defaultSelectedProduct ? defaultSelectedProduct.name : ' ' }}</div>
				</div>
				<div v-else class="emptyTxt text-center p-4">
					<p class="icons icon-noitems plainIcn bigIcn m-0 p-0"></p>
					<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055680', 'No items found') }}</h4>
					<h6 class="mb-0">{{ getTranslation('I00.00055690', 'You don’t have any items here.') }}</h6>
				</div>
			</HalfBox>
			<HalfBox :text="getTranslation('I00.00019670', 'Instructions to users')">
				<div class="row px-4 pt-3">
					<p class="col-4 mb-0">
						<b>{{ getTranslation('I00.00056280', 'General information') }}</b>
					</p>
					<div class="col-8">{{ risk.generalInformation || '-' }}</div>
				</div>
				<div class="row px-4 pt-3">
					<p class="col-4 mb-0">
						<b>{{ getTranslation('I00.00054600', 'Description of activity') }}</b>
					</p>
					<div class="col-8">{{ risk.handlingDescription || '-' }}</div>
				</div>
				<div class="row px-4 pt-3">
					<p class="col-4 mb-0">
						<b>{{ getTranslation('I00.00019690', 'Personal protection') }}</b>
					</p>
					<div class="col-8">{{ risk.handlingInstructions.personalProtectionEquipment || '-' }}</div>
				</div>
				<div class="row px-4 pt-3">
					<p class="col-4 mb-0">
						<b>{{ getTranslation('I00.00049730', 'PrecautionaryMeasuresLabel') }}</b>
					</p>
					<div class="col-8">{{ risk.handlingInstructions.precautionaryMeasures || '-' }}</div>
				</div>
				<div class="row px-4 pt-3">
					<p class="col-4 mb-0">
						<b>{{ getTranslation('I00.00054610', 'Safe handling and storage') }}</b>
					</p>
					<div class="col-8">{{ risk.handlingInstructions.handing || '-' }}</div>
				</div>
				<div class="row px-4 pt-3">
					<p class="col-4 mb-0">
						<b>{{ getTranslation('I00.00025580', 'First aid') }}</b>
					</p>
					<div class="col-8">{{ risk.handlingInstructions.firstAid || '-' }}</div>
				</div>
				<div class="row px-4 pt-3">
					<p class="col-4 mb-0">
						<b>{{ getTranslation('I00.00054620', 'Fire fighting measures') }}</b>
					</p>
					<div class="col-8">{{ risk.handlingInstructions.fire || '-' }}</div>
				</div>
				<div class="row px-4 pt-3">
					<p class="col-4 mb-0">
						<b>{{ getTranslation('I00.00054630', 'Accidental release measures') }}</b>
					</p>
					<div class="col-8">{{ risk.handlingInstructions.environment || '-' }}</div>
				</div>
				<div class="row px-4 pt-3">
					<p class="col-4 mb-0">
						<b>{{ getTranslation('I00.00054640', 'Disposal considerations') }}</b>
					</p>
					<div class="col-8">{{ risk.handlingInstructions.sanetizationAndWaste || '-' }}</div>
				</div>
			</HalfBox>
		</div>
		<CardBox class="mt-5 no-gutters" additionalClass="lightGrayBg borderT" :text="getTranslation('I00.00019620', 'SymbolsLabel')">
			<div class="twinBox row no-gutters">
				<div class="col-6">
					<Subtitle :text="getTranslation('I00.00020190', 'Mandatory')"></Subtitle>
					<SmallLoader v-if="!symbolsLoaded" />
					<template v-else>
						<div v-if="symbolsProtection.map(getSymbol).filter((x) => x.selected).length > 0" class="d-flex flex-row flex-wrap align-items-center p-3">
							<template v-for="symbol in symbolsProtection.map(getSymbol).filter((x) => x.selected)">
								<img class="d-block img-fluid iconPx48 m-3" :key="symbol.properName" :src="symbol.imageURL" alt="" :title="symbol.descriptionTranslation" />
							</template>
						</div>
						<div v-else class="emptyTxt text-center p-4">
							<p class="icons icon-noitems plainIcn bigIcn m-0 p-0"></p>
							<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055680', 'No items found') }}</h4>
							<h6 class="mb-3">{{ getTranslation('I00.00055690', 'You don’t have any items here.') }}</h6>
						</div>
					</template>
				</div>
				<div class="col-6">
					<Subtitle class="borderT" :text="getTranslation('I00.00020200', 'Prohibition')"></Subtitle>
					<SmallLoader v-if="!symbolsLoaded" />
					<template v-else>
						<div v-if="symbolsProhibition.map(getSymbol).filter((x) => x.selected).length > 0" class="d-flex flex-row flex-wrap align-items-center p-3">
							<template v-for="symbol in symbolsProhibition.map(getSymbol).filter((x) => x.selected)">
								<img class="d-block img-fluid iconPx48 m-3" :key="symbol.properName" :src="symbol.imageURL" alt="" :title="symbol.descriptionTranslation" />
							</template>
						</div>
						<div v-else class="emptyTxt text-center p-4">
							<p class="icons icon-noitems plainIcn bigIcn m-0 p-0"></p>
							<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055680', 'No items found') }}</h4>
							<h6 class="mb-3">{{ getTranslation('I00.00055690', 'You don’t have any items here.') }}</h6>
						</div>
					</template>
				</div>
				<div class="col-6">
					<Subtitle class="borderT" :text="getTranslation('I00.00018840', 'Warning')"></Subtitle>
					<SmallLoader v-if="!symbolsLoaded" />
					<template v-else>
						<div v-if="this.symbolsWarning.map(this.getSymbol).filter((x) => x.selected).length > 0" class="d-flex flex-row flex-wrap align-items-center p-3">
							<template v-for="symbols in symbolsWarning.map((f) => f.map(getSymbol))">
								<div :key="symbols[0].properName" v-if="symbols[0].selected">
									<img class="d-block img-fluid iconPx48 m-3" :src="symbols[0].imageURL" alt="" :title="symbols[0].descriptionTranslation" />
								</div>
								<div :key="symbols[0].imageURL" v-if="symbols[1]">
									<img class="d-block img-fluid iconPx48 m-3" v-if="symbols[1].selected" :src="symbols[1].imageURL" alt="" :title="symbols[1].descriptionTranslation" />
								</div>
							</template>
						</div>
						<div v-else class="emptyTxt text-center p-4">
							<p class="icons icon-noitems plainIcn bigIcn m-0 p-0"></p>
							<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055680', 'No items found') }}</h4>
							<h6 class="mb-3">{{ getTranslation('I00.00055690', 'You don’t have any items here.') }}</h6>
						</div>
					</template>
				</div>
				<div class="col-6">
					<Subtitle class="borderT" :text="getTranslation('I00.00051220', 'Equipment')"></Subtitle>
					<SmallLoader v-if="!symbolsLoaded" />
					<template v-else>
						<div v-if="symbolsPersonalFire.map(getSymbol).filter((x) => x.selected).length > 0" class="d-flex flex-row flex-wrap align-items-center p-3">
							<template v-for="symbol in symbolsPersonalFire.map(getSymbol).filter((x) => x.selected)">
								<img class="d-block img-fluid iconPx48 m-3" :key="symbol.properName" :src="symbol.imageURL" alt="" :title="symbol.descriptionTranslation" />
							</template>
						</div>
						<div v-else class="emptyTxt text-center p-4">
							<p class="icons icon-noitems plainIcn bigIcn m-0 p-0"></p>
							<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055680', 'No items found') }}</h4>
							<h6 class="mb-3">{{ getTranslation('I00.00055690', 'You don’t have any items here.') }}</h6>
						</div>
					</template>
				</div>
			</div>
		</CardBox>
		<CardBox additionalClass="lightGrayBg" :text="getTranslation('I00.00049830', 'Risk evaluation')">
			<HseRisksSummary :title="getTranslation('I00.00054960', 'Health')" :hseSource="risk.health || {}" :haveHygienicExposureLimits="risk.productAttributesIncludedSubstancesHaveHygienicExposureLimits" />
			<HseRisksSummary :title="getTranslation('I00.00054970', 'Safety')" :hseSource="risk.safety || {}" />
			<HseRisksSummary :title="getTranslation('I00.00054980', 'Environment')" :hseSource="risk.environment || {}" />
		</CardBox>
		<CardBox additionalClass="lightGrayBg" :text="getTranslation('I00.00030190', 'Exposure scenario')" v-if="raProductComplianceList && raProductComplianceList.length > 0">
			<div class="row" v-for="(exposure, ind) in risk.exposureScenarios" :key="ind">
				<ExposureSummary :exposure="getCompliance(exposure)" :title="getActivityItem(exposure.productVariant.id) ? getActivityItem(exposure.productVariant.id).name : ''" :options="options" v-if="getCompliance(exposure)" />
			</div>
		</CardBox>
		<Accordion class="mt-4 smallBox" :text="getTranslation('I00.00019120', 'Log')" v-model="logsOpened">
			<template>
				<Logs :logs="risk.logs.filter((f) => f.description)" />
			</template>
		</Accordion>
	</div>
</template>

<script>
import RiskDetail from './components/RiskDetail';
import Logs from '../../logs/Logs';
import { parseDate } from '../../../libraries/date';
import Accordion from '../../../components/common/accordion/Accordion';
import axios from '../../../axios';
import { hashCode, idsAreEqual } from '../../../libraries/common';
import HseRisksSummary from './components/HseRisksSummary'
import ExposureSummary from './components/ExposureSummary'
import { getPictogram, getPictogramTitle } from '../../../libraries/product';
import Subtitle from '../../common/cardBox/Subtitle';
export default {
  components: {
    RiskDetail,
    Logs,
    Accordion,
    HseRisksSummary,
    ExposureSummary,
    Subtitle
  },
  props: ['text', 'risk', 'options', 'raProductComplianceList', 'common', 'noProductSelected'],
  data() {
    return {
      logsOpened: false,
      calculatedWarnings: null,
      lastRiskHash: null,
      symbolsProhibition: [],
      symbolsProtection: [],
      symbolsWarning: [],
      symbolsPersonalFire: [],
      symbolsLoaded: false
    };
  },
  methods: {
    getRiskCalc(type) {
      return (this.risk.allOptionsThatMakeRiskCalcHigher || [])
        .filter(f => f.types.indexOf(type) >= 0);
    },
    getSpecificTranslation(type) {
      var obj = {
        'h': this.getTranslation('I00.00050550', 'Specific health risk'),
        's': this.getTranslation('I00.00050560', 'Specific safety risk'),
        'e': this.getTranslation('I00.00050570', 'Specific environment risk'),
      };
      return obj[type];
    },
    getStateTranslation(state) {
      var obj = {
        notDone: this.getTranslation('I00.00019830', 'Not done'),
        notNecessary: this.getTranslation('I00.00025540', 'NotNecessary'),
        done: this.getTranslation('I00.00011570', 'Done'),
      }

      return obj[state];
    },
    getStateIcon(state) {
      var obj = {
        notDone: 'icon-warning warnings',
        notNecessary: 'icon-minus notNecessary',
        done: 'icon-check done',
      }

      return obj[state];
    },
    getCalculatedWarnings() {
      this.calculatedWarnings = null;
      return axios.post('/RiskAssessmentComplete/GetCalculatedWarnings', { risk: this.risk })
        .then(response => {
          this.calculatedWarnings = response.data;
          this.lastRiskHash = hashCode(this.risk);
        });
    },
    getStatus(isDoneConditions, otherNotDoneConditions) {
      if (isDoneConditions)
        return 'done';
      else
        return otherNotDoneConditions ? 'notDone' : 'notNecessary';
    },
    emloyeeRegisterState(risk) {
      return this.getStatus(risk.workerRecords != null);
    },
    warningsState(risk) {
      return this.getStatus((!risk.warnings || !risk.warnings.any()) ||
        (risk.warnings.any && risk.warnings.all(f => f.confirmed)));
    },
    storageState(risk) {
      return this.getStatus(risk.storage &&
        (!risk.storage.restrictions.any() || risk.storage.restrictions.all(f => f.status === 'Done' || f.status === 'NotNecessary')),
        risk.obligationsAndRestrictionsStorageRestriction);
    },
    measurementsState(risk) {
      return this.getStatus(risk.oelmeasurement,
        risk.obligationsAndRestrictionsAirExposureMeasurement,
        /*OperationEnvironmentTypes.CLOSED_ROOM.Value*/
        risk.operationEnvironmentType == 2 ||
        risk.productAttributesCmr ||
        risk.productAttributesLeadAndInorganicLeadCompounds ||
        risk.productAttributesCadmiumAndInorganicCadmiumCompound ||
        risk.handlingWorkOnNonEmptyContainer
      );
    },
    emergencyState(risk) {
      return this.getStatus(risk.emergency, risk.handlingPreviousAccidentOrIncident);
    },
    wasteInternalNotesState(risk) {
      return this.getStatus(risk.wasteInternalNotes, risk.obligationsAndRestrictionsInstructionToTheReceiversOfHazardousWaste);
    },
    workPermitState(risk) {
      return this.getStatus(risk.workPermit, risk.obligationsAndRestrictionsWorkPermit);
    },
    authorPermitState(risk) {
      return this.getStatus(risk.authorPermit, risk.obligationsAndRestrictionsPermissionFromTheWorkEnvironment);
    },
    emergencyPlansState(risk) {
      return this.getStatus(risk.emergencyPlans, risk.obligationsAndRestrictionsEvacuationPlan);
    },
    riskValue(risk) {
      if (risk.itemProp == null || risk.itemCons == null) return 0;
      return (risk.itemProp.itemValue_v3 || 0) * (risk.itemCons.itemValue_v3 || 0);
    },
    parseDate,
    getLists(riskList, optionList) {
      return riskList.map(f => optionList.find(g => g.value === f));
    },
    getCompliance(exposure) {
      if (!this.raProductComplianceList) return {};
      var id = exposure.productVariant.id;

      var resultES = this.raProductComplianceList
        .find(f => idsAreEqual(f.raCompliance.productVariant.id, id)) || {};

      if (resultES.raCompliance && resultES.raCompliance.status) {
        this.$set(resultES.raCompliance, 'complianceTypeTranslation', this.getTranslation('I00.00047450', 'Activity Compliance'));
        return resultES.raCompliance;
      }

      if (resultES.specificExposureScenario) {
        this.$set(resultES.specificExposureScenario, 'complianceTypeTranslation', this.getTranslation('I00.00047470', 'Compliance Specific'));
        return resultES.specificExposureScenario
      }

      if (resultES.generalExposureScenario)
        this.$set(resultES.generalExposureScenario, 'complianceTypeTranslation', this.getTranslation('I00.00047460', 'Compliance General'));

      return resultES.generalExposureScenario;
    },
    getActivityItem(id) {
      return this.risk.activity.activityItems.find(f => idsAreEqual(id, f.prodID));
    },
    getPictogram: getPictogram,
    getPictogramTitle: getPictogramTitle,
    getSymbol(symbol) {
      var find = this.risk.symbols.find(g => g.symbol == symbol.properName);
      return {
        properName: symbol.properName,
        selected: find ? true : false,
        comment: find ? find.comment : "",
        extension: symbol.extension,
        imageURL: symbol.imageURL,
        descriptionTranslation: symbol.descriptionTranslation
      };
    },
    returnAllSymbols() {
      return axios.post('/RiskAssessmentComplete/ReturnAllSymbols').then(response => {
        this.symbolsProhibition = response.data.symbolsProhibition;
        this.symbolsProtection = response.data.symbolsProtection;
        this.symbolsWarning = response.data.symbolsWarning
          .map(f => [{ ...f, otherChoice: undefined, otherChoiceName: undefined }, f.otherChoice].filter(f => f));
        this.symbolsPersonalFire = response.data.symbolsPersonalFire;
        this.symbolsLoaded = true;
      });
    }
  },
  computed: {
    obligationState() {
      return [{ value: this.risk.obligationsAndRestrictionsWorkPermit, text: this.getTranslation('I00.00019500', 'ObligationsAndRestrictionsWorkPermitLabel') },
      { value: this.risk.obligationsAndRestrictionsAirExposureMeasurement, text: this.getTranslation('I00.00019510', 'ObligationsAndRestrictionsAirExposureMeasurementLabel') },
      { value: this.risk.obligationsAndRestrictionsInstructionToTheReceiversOfHazardousWaste, text: this.getTranslation('I00.00019520', 'ObligationsAndRestrictionsInstructionToTheReceiversOfHazardousWasteLabel') },
      { value: this.risk.obligationsAndRestrictionsInstructionRegisterOfUsers, text: this.getTranslation('I00.00019530', 'ObligationsAndRestrictionsInstructionRegisterOfUsersLabel') },
      { value: this.risk.obligationsAndRestrictionsEvacuationPlan, text: this.getTranslation('I00.00026130', 'LabelObligationsAndRestrictionsEvacuationPlan') },
      { value: this.risk.obligationsAndRestrictionsPermissionFromTheWorkEnvironment, text: this.getTranslation('I00.00019550', 'ObligationsAndRestrictionsPermissionFromTheWorkEnvironmentLabel') },
      { value: this.risk.obligationsAndRestrictionsSubstitution, text: this.getTranslation('I00.00012140', 'ObligationsAndRestrictionsSubstitutionLabel') },
      { value: this.risk.obligationsAndRestrictionsStorageRestriction, text: this.getTranslation('I00.00025970', 'ObligationsAndRestrictionsStorageRestrictionLabel') }]
    },
    productAttributesForms() {
      return this.getLists(this.risk.productAttributesForm, this.options.operationFormList);
    },
    specialproductAttributesProp() {
      return ((this.options || {}).allProductAttributes || []).map(f => ({ ...f, value: this.risk[f.prop.camelCase()] }));
    },
    productSelected() {
      if (this.risk.handlingInstructions.prodID)
        return this.risk.activity.activityItems.find(f => idsAreEqual(f.prodID, this.risk.handlingInstructions.prodID));
      else
        return this.risk.activity.activityItems.length === 1 ? this.risk.activity.activityItems[0] : null;
    },
    defaultSelectedProduct() {
      return this.productSelected || this.risk.activity.activityItems.find(f => idsAreEqual(f.prodID, this.defaultSelectedProdId || {})) || this.risk.activity.activityItems.firstOrDefault();
    }
  },
  mounted() {
    if (!this._inactive) {
      this.getCalculatedWarnings();
      this.returnAllSymbols();
    }
    if (process.env.NODE_ENV === 'development') window['thisSummaryRiskPage'] = this;
  },
  activated() {
    if (this.lastRiskHash != hashCode(this.risk))
      this.getCalculatedWarnings();
  }
};
</script>