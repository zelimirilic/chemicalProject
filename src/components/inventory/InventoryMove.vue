<template>
	<SmallLoader v-if="!treeData" />
	<div v-else>
		<label class="form-control-label">
			{{ getTranslation('I00.00005390', 'Select department') }}:
			<sup class="astera">*</sup>
		</label>

		<div class="h-100 departmentWrap">
			<div class="hp-280 scrollBar">
				<Tree :data="treeData" :state="state" @click="department = $event.item.orgID" />
			</div>
		</div>
		<div class="my-3 p-3 lightGrayBg borderTRBL rounded">
			<h6 class="primaryTxt mb-3">{{ getTranslation('I00.00009860', 'Options') }}</h6>
			<CheckBoxGroup class="disabled pt-2" :text="getTranslation('I00.00019480', 'Include products consumption and storage values')" :value="true" />
			<CheckBoxGroup class="pt-2" :class="{ disabled: !propToBool(copy) }" :text="getTranslation('I00.00019490', 'Include Inventory Request')" v-model="checked.copyInventoryRequest" v-if="rules.copyInventoryRequest" />
			<CheckBoxGroup class="pt-2" :class="{ disabled: !propToBool(copy) }" :text="getTranslation('I00.00019050', 'Include risk assessment')" v-model="checked.copyInvRisk" v-if="rules.copyInvRisk" />
			<CheckBoxGroup class="pt-2" :class="{ disabled: !propToBool(copy) }" :text="getTranslation('I00.00046210', 'Include Danish APB')" v-model="checked.copyAPB" v-if="rules.copyAPB" />
			<CheckBoxGroup class="pt-2" :class="{ disabled: !propToBool(copy) }" :text="getTranslation('I00.00046190', 'Include German WPI')" v-model="checked.copyBA" v-if="rules.copyBA" />
			<CheckBoxGroup class="pt-2" :class="{ disabled: !propToBool(copy) }" :text="getTranslation('I00.00046200', 'Include German GefB')" v-model="checked.copyGEFB" v-if="rules.copyGEFB" />
			<CheckBoxGroup class="pt-2" :class="{ disabled: !propToBool(copy) }" :text="getTranslation('I00.00019060', 'Include substitution')" v-model="checked.copyInvSub" v-if="rules.copyInvSub" />
			<CheckBoxGroup class="pt-2" :class="{ disabled: !propToBool(copy) }" :text="getTranslation('I00.00047320', 'Include ES compliance')" v-model="checked.copyES" @input="uncheckCopyESAllRev" v-if="rules.copyES" />
			<CheckBoxGroup class="pt-2" :text="getTranslation('I00.00047390', 'Including all revisions')" v-model="checked.copyESAllRev" v-if="propToBool(copy) && checked.copyES" />
			<CheckBoxGroup class="pt-2" :class="{ disabled: !propToBool(copy) }" :text="getTranslation('I00.00047390', 'Including all revisions')" :value="(checked.copyESAllRev = true)" v-else />
		</div>
		<div class="text-right">
			<ButtonOk :class="{ disabled: !department }" @click="emitData" />
			<ButtonCancel @click="$emit('cancel')" />
		</div>
	</div>
</template>

<script>
import { errorDebug } from '../../libraries/common';
import { defineState, getOrganisationTreeData } from '../../libraries/tree';
import { propToBool } from '../../libraries/vue';
import Tree from '../tree/Tree';
export default {
  components: { Tree },
  props: ['copy'],
  data(self) {
    var rules = {
      copyInventoryRequest: this.hasWriteRights && this.appSettings.adaptableInventoryRequest,
      copyInvRisk: this.appSettings.riskAssessment_v3 || this.appSettings.mainMenuAdminRiskAnalysis,
      copyAPB: this.appSettings.mainMenuButtonAdminDanishApbList,
      copyBA: this.appSettings.mainMenuButtonAdminGermanBAList,
      copyGEFB: this.appSettings.germanRiskAssessment,
      copyInvSub: this.appSettings.mainMenuButtonAdminSubstitution,
      copyES: this.appSettings.mainMenuButtonExposureScenarios,
    };
    return {
      department: null,
      checked: ['copyInventoryRequest', 'copyInvRisk', 'copyAPB', 'copyBA', 'copyGEFB', 'copyInvSub', 'copyES', 'copyESAllRev']
        .reduce((acc, key) => { acc[key] = !propToBool(self.copy) && rules[key]; return acc; }, {}),
      rules,
      state: {},
      treeData: null,
    }
  },
  methods: {
    emitData() {
      var copyOption = 'MoveEverything';
      if (propToBool(this.copy)) {
        if (this.checked.copyInvRisk)
          copyOption = this.checked.copyInvSub ? 'CopyAll' : 'CopyInvRisk';
        else
          copyOption = this.checked.copyInvSub ? 'CopyInvSub' : 'CopyInv';
      }
      var data = {
        toDepartmentId: this.department.id,
        toDepartmentId_mdbID: this.department.id_mdbID,
        copyOption,
        ...this.checked,
      };
      this.$emit('input', data);
    },
    uncheckCopyESAllRev(event) {
      if (!event) this.checked.copyESAllRev = false;
    },
    propToBool,
  },
  mounted() {
    getOrganisationTreeData()
      .then(response => {
        var treeData = response.find(f => f.item.orgID.id === this.appSettings.user.organisationWrite.id);
        treeData.toArray()
          .filter(f => f.locked)
          .forEach(f => {
            f.icon = 'icon-lock';
            f.disabled = true;
          });
        if (process.env.NODE_ENV === 'development') window['thisInventoryMove'] = this;
        var currentOrgID = this.sideTree.getSelectedDepartment().orgID;
        var org = response.find(f => f.item.orgID.id === currentOrgID.id)
        if (org) org.item.disabled = true;

        this.treeData = treeData;
        defineState(this.state, this.treeData.item, 'opened', true)
      })
      .catch(errorDebug);
  },
}
</script>