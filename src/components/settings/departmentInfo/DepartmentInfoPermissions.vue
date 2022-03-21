<template>
	<MainTitle class="card pageWrapper" :text="getTranslation('I00.00030240', 'Permissions')">
		<template #linkSlot>
			<ButtonIconSave v-if="departmentInfo && departmentInfo.HasPermission" @click="saveChanges" :class="{ disabled: saveStatusValue }" @saveButtonStatus="saveStatus($event)" />
		</template>
		<SmallLoader v-if="!departmentInfo || isSavingShowLoader" />
		<div class="p-3" :class="{ readOnly: !departmentInfo.HasPermission }" v-else>
			<div v-if="appSettings.excludedFromRA" class="p-2">
				<CheckBoxGroup v-model="departmentInfo.ExcludedFromRA">{{ getTranslation('I00.00048890', 'Exclude department from Ra') }}</CheckBoxGroup>
			</div>
			<div v-if="appSettings.inventoryNotAllowed" class="p-2">
				<CheckBoxGroup v-model="departmentInfo.InventoryNotAllowed">{{ getTranslation('I00.00048900', 'Inventory not allowed for this department') }}</CheckBoxGroup>
				<p class="alert alert-warning mt-3 mb-0">{{ getTranslation('I00.00048950', 'Department need to be empty for this operation') }}</p>
			</div>
			<div v-if="appSettings.foodProcessingEnabled" class="p-2">
				<CheckBoxGroup v-model="departmentInfo.FoodProcessing">{{ getTranslation('I00.00049400', 'Food processing department') }}</CheckBoxGroup>
			</div>
		</div>
	</MainTitle>
</template>

<script>
import axios from '../../../axios';
import { hashCode, errorDebug, ticker } from '../../../libraries/common';
import MainTitle from '../../../components/common/cardBox/MainTitle';
import { validators } from '../../../libraries/forms';
import { checkIsValid } from '../../../libraries/vue';

export default {
  components: {
    MainTitle
  },
  props: ['departmentInfo', 'appSettings', 'orgId'],
  data() {
    return {
      errorMessage: null,
      $modelValidators: [],
      hashSettings: null,
      isSaving: false,
      originalHashCode: null,
      isSavingShowLoader: false
    };
  },
  watch: {
    saveStatusValue() {
      this.$emit('saveButtonStatus', !this.saveStatusValue);
    }
  },
  methods: {
    saveChanges() {
      if (!checkIsValid(this)) return;
      this.isSaving = true;
      this.isSavingShowLoader = true;
      this.departmentInfo.OrgID = this.orgId.id;
      this.departmentInfo.OrgID_mdbID = this.orgId.id_mdbID;
      return axios
        .postWithCancelToken('/OrganisationInfo/SetDepartmentInfoPermisionsChemsoft', { model: { ...this.departmentInfo } })
        .then(response => {
          if (response.data.saved) {
            ticker.addSuccessMessage(response.data.serverMessage);

          }
          if (response.data.warning) {
            ticker.addWarningMessage(response.data.warning);
            this.departmentInfo.InventoryNotAllowed = false;
          }

          this.originalHashCode = hashCode(this.departmentInfo);
          this.isSaving = false;
          this.isSavingShowLoader = false;
        })
        .catch(error => {
          this.isSaving = false;
          this.isSavingShowLoader = false;
          errorDebug(error);
        });
    },
    maxLength: validators.maxLength,
    getTextForOrgFieldDescription(ownField) {
      return ownField.DepartmentOwnFieldValues[0].Local == 'localField' ? this.getTranslation('I00.00048610', 'Local field.') : ownField.DepartmentOwnFieldValues[0].InheritedFromParent ? this.getTranslation('I00.00048620', 'Inherited field to child departments.') : this.getTranslation('I00.00048580', 'Inherit field to child departments.');
    },
    isInheritedOrLocalField(ownField) {
      return ownField.DepartmentOwnFieldValues[0].InheritedFromParent || ownField.DepartmentOwnFieldValues[0].Local == 'localField';
    }
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    inputFieldsIsChanged() {
      return this.originalHashCode != hashCode(this.departmentInfo);
    },
    saveStatusValue() {
      return !this.isModelValid || !this.inputFieldsIsChanged || this.isSaving;
    }
  },
  mounted() {
    this.originalHashCode = hashCode(this.departmentInfo);
  },
  beforeDestroy() {
    axios.cancelAll();
  },
};
</script>