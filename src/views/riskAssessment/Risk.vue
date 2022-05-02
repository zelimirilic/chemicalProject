<template>
	<MainLoader v-if="!risk || !options" />
	<div v-else>
		<TabsWithMenu class="card pageWrapper" :tabs="steps" :value="activeStep" @input="tabChanged">
			<template #menu v-if="!isReadOnly && anyWriteRights">
				<template v-if="isGeneral">
					<ButtonIcon iconClass="icon-local" @click="showMakeLocalDialog = true" v-tooltip="getTranslation('I00.00031070', 'Make local')" />
				</template>
				<template v-if="!isGeneral">
					<ButtonIcon iconClass="icon-copy" @click="openCopyRaModal" v-tooltip="getTranslation('I00.00038410', 'Copy')" v-if="isNew" />
					<ButtonIconRestore :class="{ disabled: isSaving }" @click="revertRisk" v-if="writeRights && riskIsChanged" />
					<ButtonIcon iconClass="icon-save" :class="{ disabled: isSaving }" v-tooltip="getTranslation('I00.00004810', 'Save')" @click="tabChanged(activeStep, activeStep)" v-if="writeRights && riskIsChanged" />
					<ButtonIcon iconClass="icon-safetysheet" :class="{ disabled: (risk.activity.activityItems.length === 0 && !noProdSelected && risk.additionalRiskSource.length === 0) || !stepsDone.first() }" v-tooltip="getTranslation('I00.00000170', 'Safety sheet')" @click="openSafetySheetModal" v-if="activeStep >= steps.length - 2" />
				</template>
				<template v-if="!isGeneral && appSettings.permissions.signRiskAssessment.full">
					<ButtonIcon iconClass="icon-sign" :class="{ disabled: !risk.id || stepsDone.any((f) => !f) || riskIsChanged }" @click="signRisk" v-tooltip="getTranslation('I00.00008380', 'Sign')" v-if="!risk.signed && activeStep === steps.length - 1" />
					<ButtonIcon iconClass="icon-edit" @click="changeRisk" v-tooltip="getTranslation('I00.00007690', 'Change')" v-if="risk.signed" />
				</template>
			</template>
			<template #tabSlot="item">
				<div class="d-flex flex-row align-items-center">
					<span class="icons mr-2" :class="{ 'icon-check': stepsDone[item.index], 'icon-warning': !stepsDone[item.index] }" v-if="stepsDone[item.index] != null"></span>
					<span>{{ item.tab.label }}</span>
				</div>
			</template>
			<SmallLoader v-show="isSaving" />
			<keep-alive>
				<component v-show="!isSaving" :class="{ readOnly: isGeneral || isReadOnly || !writeRights || risk.signed }" :savingDone="savingDone" @savingDone="savingDone = false" @noProdSelected="noProductSelected = $event" :noProductSelected="noProductSelected" :is="steps[activeStep].component" :risk="risk" :options="options" :common="common" :raProductComplianceList="raProductComplianceList" @checkIsValid="() => (stepsDone[activeStep] = checkIsValid())" ref="component" />
			</keep-alive>
		</TabsWithMenu>
		<ModalDialog :title="getTranslation('I00.00000170', 'Safety sheet')" additional-class="wp-900" @close="closeSafetySheetModal" v-if="showSafetySheet">
			<SafetySheet :id="risk.id" :forcedRisk="risk" :noProdSelected="noProductSelected" />
		</ModalDialog>
		<ModalDialog :title="getTranslation('I00.00015500', 'Information')" @close="showMakeLocalDialog = false" additional-class="wp-400" v-show="showMakeLocalDialog">
			<h6>{{ getTranslation('I00.00030150', 'ChangeText evaluation') }}</h6>
			<div class="pt-4 text-right">
				<ButtonOk @click="makeRiskLocal" />
				<ButtonCancel @click="showMakeLocalDialog = false" />
			</div>
		</ModalDialog>
		<ModalDialog :title="getTranslation('I00.00015040', 'Copy risk assessment')" :withFooter="true" @close="showCopyRaModal = false" additional-class="w-80" v-show="showCopyRaModal">
			<RiskCopy :id="risk.id" :isVisible="showCopyRaModal" :withFooter="true" @copied="copyDone($event)" @cancel="showCopyRaModal = false" withConsumption withProductType />
		</ModalDialog>
		<ModalDialog additional-class="wp-400" :title="modalConfirm.title" @close="modalConfirm.reject" v-if="modalConfirm.show">
			<h6>{{ modalConfirm.message }}</h6>
			<div class="pt-4 text-right">
				<ButtonOk @click="modalConfirm.resolve" />
				<ButtonCancel @click="modalConfirm.reject" />
			</div>
		</ModalDialog>
	</div>
</template>

<script>
import Vue from 'vue';
import Handling from '../../components/riskAssessment/risk/Handling';
import Exposure from '../../components/riskAssessment/risk/Exposure';
import Evaluation from '../../components/riskAssessment/risk/Evaluation';
import SafetyInstruction from '../../components/riskAssessment/risk/SafetyInstruction';
import Summary from '../../components/riskAssessment/risk/Summary';
import TabsWithMenu from '../../components/common/tabs/TabsWithMenu';
import SafetySheet from '../activity/safetySheet/SafetySheet';
import RiskCopy from '../../components/riskAssessment/risk/components/RiskCopy';
import axios from '../../axios';
import { hashCode, deepClone, errorDebug, idsAreEqual, idToString, ticker, camelCaseObj } from '../../libraries/common';
import { getAllChildren, checkIsValid, logOut } from '../../libraries/vue';
import { translatedCodes, filterDangerSymbols } from '../../libraries/product';
import { getRCodes } from '../../libraries/risk';


export default {
  name: 'Risk',
  components: {
    Handling,
    Exposure,
    Evaluation,
    SafetyInstruction,
    Summary,
    TabsWithMenu,
    SafetySheet,
    RiskCopy
  },
  data() {
    return {
      risk: null,
      options: null,
      lastRisk: null,
      riskHash: 0,
      isSaving: false,
      stepsDone: [],
      raProductComplianceList: null,
      checkedProducts: [],
      expsDoc: null,
      showSafetySheet: false,
      showMakeLocalDialog: false,
      noProductSelected: false,
      savingDone: false,
      isNew: this.$route.name == 'riskNew',
      showCopyRaModal: false,
      modalConfirm: { show: false },
    };
  },
  methods: {
    logOut: logOut,
    openSafetySheetModal() {
      this.showSafetySheet = true;
      window.thisVue.$refs.hideOnPrint.className = 'mainBox hideOnPrint';
    },
    closeSafetySheetModal() {
      this.showSafetySheet = false;
      window.thisVue.$refs.hideOnPrint.className = 'mainBox';
    },
    newRisk() {
      var nod = this.sideTree.getSelectedDepartment();

      return this.initialiseObjects({
        activity: {
          activityItems: this.$route.query.product ? [{ ...JSON.parse(atob(this.$route.query.product)), productClassificationCode: { dangerSymbols: [], rcodes: [] } }] : [],
          department: {
            orgID: {
              id: nod.orgID.id,
              id_mdbID: nod.orgID.id_mdbID
            },
            name: nod.name
          }
        },
        additionalRiskSource: [],
        measures: [],
        productAttributesForm: [],
        handlingProcessCategory: [],
        logs: [],
        symbols: [],
        validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
        isNew: true
      });

    },
    initialiseObjects(risk) {
      risk.health = (risk || {}).health || {};
      risk.handlingInstructions = (risk || {}).handlingInstructions || { allPictograms: true };
      return risk;
    },
    nodeSelected(node, clicked) {
      if (clicked)
        this.$router.push({ name: 'riskList' })
      else {
        ticker.clearMessages();
        if (!this.anyWriteRights) {
          ticker.addWarningMessage(this.getTranslation('I00.00016210', 'You don\'t have enough permissions. This page is read-only.'));
        } else if (!this.writeRights) {
          ticker.addWarningMessage(this.getTranslation('I00.00051860', 'You only have permission to sign risk assessment.'));
        }

        axios.post('/RiskAssessmentComplete/GetDocExpsType', { orgId: node.orgID })
          .then(response => this.expsDoc = response.data)
          .then(() => {
            if (!this.risk) {
              if (this.$route.params.riskId) {
                this.getRisk(this.$route.params.riskId)
                  .then(() => {
                    if (this.appSettings.exposureScenarioComplianceInRiskAssessment && this.expsDoc) {
                      return this.getExposureScenario();
                    }
                  })
                  .then(() => {
                    if (this.options && this.options.allProductAttributes)
                      this.stepsDone = this.checkModel(this.steps);
                  });
              } else {
                this.risk = this.newRisk();
                this.changeRiskHash(this.risk);
              }
            } else {
              this.risk.activity.department = {
                orgID: node.orgID,
                name: node.name
              };
              this.checkedProducts = [];
              this.getExposureScenario()
                .then(() => this.stepsDone = this.checkModel(this.steps));
            }
          });
      }
    },
    getRisk(id) {
      return axios.post('/RiskAssessmentComplete/CreateRiskAssessmentData', { id: id })
        .then(response => {
          this.risk = this.initialiseObjects(camelCaseObj(JSON.parse(response.data)).risk);
          this.updateAdditionalRiskItems();
          var find = this.sideTree.getAllData().find(f => idsAreEqual(f.item.orgID, this.risk.activity.department.orgID));
          if (!this.isGeneral)
            this.$store.getters.treeStateClick(find);
          this.changeRiskHash(this.risk);
        });
    },
    updateAdditionalRiskItems() {
      ['health', 'safety', 'environment'].forEach(x => (this.risk[x] != null && this.risk[x].risks) ? this.risk[x].risks.forEach(f => f.name != null ? f.itemRisk.itemText = f.name : '') : '');
    },
    getAllProductAttributes() {
      return axios.post('/RiskEvaluation/GetProductAttributes')
        .then(response => {
          this.options.allProductAttributes = camelCaseObj(JSON.parse(response.data));
        });
    },
    getOptionList() {
      return axios.post('/RiskAssessmentComplete/CreateRiskAssessmentOptions')
        .then(response => {
          this.options = camelCaseObj(JSON.parse(response.data));
          return this.getAllProductAttributes();
        });
    },
    changeRiskHash(risk) {
      this.riskHash = hashCode(this.stripedRisk(risk));
      this.lastRisk = JSON.parse(JSON.stringify(risk));
    },
    checkIsValid() {
      return checkIsValid(this.$refs.component);
    },
    /**
     * Deals with fields that, if not valid, saving of risk is not possible.
     * 
     * Checks if all child vue-componnents are valid for save.
     * If a componnent has isValidForSave function it will be called to check is that component has valid data.
     * If you want to add this feature to a componnent just add isValidForSave function to methods section.
     * If there is no isValidForSave function in a component, it will be treated as always valid.
     */
    allComponentsAreValidForSave() {
      if (getAllChildren(this.$refs.component).filter(f => !f._inactive && f.isValidForSave && !f.isValidForSave()).length > 0) {
        ticker.addErrorMessage(this.getTranslation('I00.00039720', 'Please enter field data before saving.'));
        return false;
      }
      return true;
    },
    tabChanged(activeStep, lastActiveStep) {
      this.isNew = false;

      if (!this.allComponentsAreValidForSave()) return;
      if (activeStep !== lastActiveStep)
        this.$router.replace({ name: this.$route.name, params: { ...this.$route.params, component: this.steps[activeStep].component.splitByUpperCase().map(f => f.toLowerCase()).join('_') } });

      this.stepsDone[lastActiveStep] = this.checkIsValid();

      if (!this.risk.id)
        this.shouldCheckPermitToWorkCheckBox();

      var parseResponse = response => {
        var oldRisk = this.risk;
        this.risk = this.initialiseObjects(camelCaseObj(JSON.parse(response.data)));

        if (!idsAreEqual(this.sideTree.getSelectedDepartment().orgID, this.risk.activity.department.orgID)) {
          var find = this.sideTree.getAllData().find(f => idsAreEqual(f.item.orgID, this.risk.activity.department.orgID));
          this.$store.getters.treeStateClick(find);
        }

        if (oldRisk) {
          this.risk.activity.activityItems.forEach(f => {
            var actIt = oldRisk.activity.activityItems.find(g => idsAreEqual(f.prodID, g.prodID));

            ['productClassificationCode', 'substances'].forEach(prop => f[prop] = actIt[prop]);
          });
          if (!this.risk.logs.length) {
            this.risk.logs = oldRisk.logs;
          }
        }

        return this.getExposureScenario()
          .then(() => {
            this.changeRiskHash(this.risk);
            this.isSaving = false;
            this.$store.state.saveStatus = false;
            if (this.risk.id) {
              this.stepsDone = this.checkModel(this.steps);
              if (this.$route.name == 'riskNew' || this.$route.params.riskId != this.risk.id) {
                this.$router.replace({ name: 'risk', params: { riskId: this.risk.id, component: this.steps[activeStep].component.toLowerCase() } });
              }
            }
          });
      };

      if (this.anyWriteRights) {
        if (this.riskIsChanged) {
          this.setHseRiskPoints();
          this.isSaving = true;
          axios.post('/RiskAssessmentComplete/SaveRiskAssessment', { risk: this.stripedRisk(this.risk), component: this.steps[lastActiveStep].component, isDone: this.stepsDone[lastActiveStep] })
            .then(parseResponse)
            .catch(response => {
              this.isSaving = false;
              errorDebug(response);
            });
        } else {
          if (process.env.NODE_ENV === 'development') {
            this.isSaving = true;
            axios.post('/RiskAssessmentComplete/CheckModel', this.stripedRisk(this.risk))
              .then(parseResponse)
              .catch(response => {
                this.isSaving = false;
                errorDebug(response);
              });
          }
        }
      }
      this.savingDone = true;
    },
    revertRisk() {
      this.risk = deepClone(this.lastRisk);
      this.changeRiskHash(this.risk);
      this.isSaving = false;
      this.$store.state.saveStatus = false;
      this.$nextTick(() => this.checkIsValid());
    },
    setHseRiskPoints() {
      ['health', 'safety', 'environment'].forEach(x => (this.risk[x] != null && this.risk[x].risks) ? this.risk[x].risks.forEach(f => (f.itemProp == null || f.itemCons == null) ? 0 : f.riskPoint = (f.itemProp.itemValue_v3 || 0) * (f.itemCons.itemValue_v3 || 0)) : '');
    },
    shouldCheckPermitToWorkCheckBox() {
      var codesToCheck = ["F", "F+", "CLP6", "CLP7", "CLP8", "CLP9", "CLP10", "CLP11", "CLP12", "CLP13", "CLP14", "CLP79", "CLP80", "CLP81", "CLP99", "GHS02_D", "GHS02_W"];
      var allActivityDangerSymbols = [].concat.apply([], this.risk.activity.activityItems.map(f => f.productClassificationCode.dangerSymbols.map(x => x.codeID.code)))
      var anyMatchingCodeExist = codesToCheck.some(r => allActivityDangerSymbols.indexOf(r) >= 0)

      if (anyMatchingCodeExist && (this.risk.handlingCauseFire || this.risk.operationEnvironmentType == "CLOSED_ROOM"))
        this.$set(this.risk, 'obligationsAndRestrictionsWorkPermit', true);
    },
    checkModel(steps) {
      return steps.map((step) => {
        var ComponentClass = Vue.extend(this.$options.components[step.component]);
        var instance = new ComponentClass({
          router: this.$router,
          propsData: {
            risk: this.risk,
            options: this.options,
            common: this.common,
            changeRiskHash: this.changeRiskHash,
            raProductComplianceList: this.raProductComplianceList
          }
        });
        instance._inactive = true;
        instance.$mount();

        var formNotValid = false;
        getAllChildren(instance)
          .filter(f => !f._inactive)
          .forEach(f => {
            if (f.checkIsValid) {
              f.checkIsValid();
              if (!f.isValid) formNotValid = true;
            }
          });
        return !formNotValid;
      });
    },
    signRisk() {
      this.isSaving = true;
      axios.post('/RiskAssessmentSummary/Sign', { ra_id: this.risk.id, isCS: true })
        .then((response) => {
          var dat = camelCaseObj(JSON.parse(response.data.log));
          this.risk.logs.push(dat);
          this.risk.signed = true;
          this.risk.signedDate = new Date();
          this.risk.signedBy = dat.user.name;
          this.changeRiskHash(this.risk);
          this.isSaving = false;
          ticker.addSuccessMessage(this.getTranslation('I00.00052060', 'Risk assessment successfully signed!'));
        })
        .catch(response => {
          this.isSaving = false;
          errorDebug(response);
        });
    },
    changeRisk() {
      this.risk.signed = false;
      this.risk.signedDate = null;
      this.risk.version++;
    },
    makeRiskLocal() {
      this.showMakeLocalDialog = false;
      this.isSaving = true;
      axios.post('/RiskAssessmentSummary/CloneRiskAssessmentToChildDepartment', { ra_id: this.risk.id, isCS: true })
        .then((response) => {
          var riskId = camelCaseObj(JSON.parse(response.data.risk)).id;
          this.$router.push({ name: 'risk', params: { riskId: riskId, component: 'summary' } });
          this.getRisk(riskId);
          this.isSaving = false;
        })
        .catch(response => {
          this.isSaving = false;
          errorDebug(response);
        });
    },
    stripedRisk(risk) {
      if (!risk) return risk;
      return {
        ...risk,
        activity: {
          ...risk.activity,
          activityItems: risk.activity.activityItems.map(f => ({
            ...f,
            productClassificationCode: { dangerSymbols: [] },
            substances: undefined,
          }))
        },
        logs: null,
      }
    },
    getExposureScenario() {
      var prodIds = this.risk.activity.activityItems.map(f => idToString(f.prodID));
      var shouldCheck = !prodIds.all(f => this.checkedProducts.indexOf(f) > -1);
      this.checkedProducts = prodIds;

      var changeRisk = () => {
        if (this.raProductComplianceList) {
          var riskIsChanged = this.riskIsChanged;
          this.raProductComplianceList = this.raProductComplianceList
            .filter(f => this.risk.activity.activityItems.any(g => idsAreEqual(f.raCompliance.productVariant.id, g.prodID)))

          this.risk.exposureScenarios = this.raProductComplianceList.map(f => f.raCompliance);

          if (!riskIsChanged) {
            this.changeRiskHash(this.risk);
          }
        }
      };

      if (shouldCheck) {
        return axios.post('/RiskAssessmentComplete/GetExposureScenario', this.stripedRisk(this.risk))
          .then(response => {
            this.raProductComplianceList = response.data.raproductComplianceList;
            this.checkedProducts = prodIds;

            return changeRisk();
          })
          .catch(errorDebug);
      } else {
        return new Promise((response) => response(changeRisk()));
      }
    },
    openCopyRaModal() {
      this.showCopyRaModal = true;
    },
    closeCopyRaModal() {
      this.showCopyRaModal = false;
    },
    copyDone(id) {
      this.closeCopyRaModal();
      this.isNew = false;
      this.$router.push(`/chemicals/risk_assessment/risk/${id}/handling`);
      this.getRisk(id);
      ticker.addSuccessMessage(this.getTranslation('I00.00022350', 'Success'));
    },
    confirm(title, message) {
      this.modalConfirm = { title, message };
      this.modalConfirm.show = true;
      return new Promise((resolve, reject) => {
        this.modalConfirm.resolve = () => {
          resolve(this.modalConfirm.decision);
          this.modalConfirm.show = false;
        };
        this.modalConfirm.reject = () => {
          this.$store.state.saveStatus = false;
          var node = this.sideTree.getAllData().find(x => idsAreEqual(x.item.orgID, this.risk.activity.department.orgID));
          this.$store.getters.treeStateClick(node);
          this.modalConfirm.show = false;
          reject(false);
        };
      });
    }
  },
  computed: {
    currentRiskHash() {
      return hashCode(this.stripedRisk(this.risk));
    },
    riskIsChanged() {
      return this.riskHash !== this.currentRiskHash;
    },
    activeStep() {
      var component = this.steps.find(f => f.component.toLowerCase() === this.$route.params.component.replace('_', ''));
      return component ? this.steps.indexOf(component) : 0;
    },
    steps() {
      return [
        {
          label: this.getTranslation('I00.00049740', 'Handling'),
          component: 'Handling'
        },
        {
          label: this.getTranslation('I00.00030190', 'Exposure Scenario'),
          component: 'Exposure'
        },
        {
          label: this.getTranslation('I00.00050380', 'Risk evaluation and actions'),
          component: 'Evaluation'
        },
        {
          label: this.getTranslation('I00.00050390', 'Safety instruction'),
          component: 'SafetyInstruction'
        },
        {
          label: this.getTranslation('I00.00008360', 'Summary'),
          component: 'Summary'
        }
      ].filter(f => (this.appSettings.exposureScenarioComplianceInRiskAssessment && this.expsDoc) || f.component != 'Exposure');
    },
    common() {
      var getDangerSymbols = riskActivityItems => {
        return riskActivityItems
          .mapMany(f => (f.productClassificationCode ? f.productClassificationCode.dangerSymbols : []))
          .groupBy(f => f.imageName)
          .map(f => f.items.first());
      }
      return {
        getGhsClpSymbols: riskActivityItems => filterDangerSymbols(getDangerSymbols(riskActivityItems)).mapMany(f => f),
        getDangerSymbols: getDangerSymbols,
        getRCodesClassification: risk => translatedCodes(getRCodes(risk)).sort(),
      };
    },
    isGeneral() {
      return this.$route.meta.general;
    },
    isReadOnly() {
      return this.$route.meta.readOnly;
    },
    writeRights() {
      return this.hasWriteRights() && this.appSettings.permissions.riskAssessment.full;
    },
    anyWriteRights() {
      return this.hasWriteRights() && (this.appSettings.permissions.riskAssessment.full || this.appSettings.permissions.signRiskAssessment.full);
    }
  },
  watch: {
    currentRiskHash() {
      if (this.$refs.component && this.risk.id) {
        this.$nextTick(() => this.$set(this.stepsDone, this.activeStep, this.checkIsValid()));
      }
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisRisk'] = this;
    this.getOptionList()
      .then(() => {
        if (this.risk && this.risk.id)
          this.stepsDone = this.checkModel(this.steps);
      });
    if (this.sideTree.getSelectedDepartment()) {
      this.nodeSelected(this.sideTree.getSelectedDepartment());
    }

    this.getTranslation('I00.00039720', 'Please enter field data before saving.');
    this.getTranslation('I00.00051860', 'You only have permission to sign risk assessment.');
    this.getTranslation('I00.00052060', 'Risk assessment successfully signed!');
    this.getTranslation('I00.00022350', 'Success');
  },
  beforeDestroy() {
    ticker.clearMessages();
  },
  beforeRouteLeave: function (to, from, next) {
    this.$store.state.saveStatus = false;
    if (this.risk && !this.isSaving && this.riskIsChanged) {
      this.$store.state.saveStatus = true;
      this.confirm(this.getTranslation('I00.00053950', 'Unsaved data'), this.getTranslation('I00.00053960', 'You have unsaved data. Are you sure you want to proceed?'))
        .then(() => {
          this.$store.state.saveStatus = false;
          window.thisVue.$refs.hideOnPrint.className = 'mainBox';
          var routeMatch = to.path.indexOf('login') > -1;
          if (routeMatch)
            this.logOut();

          next()
        })
        .catch(errorDebug);
    } else {
      window.thisVue.$refs.hideOnPrint.className = 'mainBox';
      next();
    }
  },
};
</script>