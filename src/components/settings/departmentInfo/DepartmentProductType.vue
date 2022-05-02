<template>
	<MainTitle class="card pageWrapper" :text="getTranslation('I00.00057320', 'Department properties')">
		<template #linkSlot>
			<ButtonIconSave :class="{ disabled: isChanged }" v-if="departmentInfo && departmentInfo.HasPermission" @click="save()" />
		</template>
		<SmallLoader v-if="isSaving" />
		<div v-else>
			<div class="row p-4">
				<div class="col-xl-3 col-12 mb-3">
					<SelectGroup class="mb-0" :text="getTranslation('I00.00027860', 'Ventilation label')" :items="operationEnvironmentTypeList" :prop="getTranslation" v-model="selectedPhraseId" @input="getValues()" />
				</div>
				<div class="col-xl-3 col-12 mb-3">
					<InputGroup :text="getTranslation('I00.00057340', 'Floor type')" :validations="[maxLength(300)]" :placeholder="getTranslation('I00.00057340', 'Floor type')" :value="floorText" v-model="floorText" @input="getValues()" />
				</div>
				<div class="col-xl-3 col-12 mb-3 chemsoft-date">
					<DateGroup :text="getTranslation('I00.00057330', 'Inventory date')" :value="invDate" v-model="invDate" @input="getValues()" />
				</div>
			</div>
			<div class="row px-4">
				<div class="col-xl-3 col-12">
					<CheckBoxGroup class="mb-3" :text="getTranslation('I00.00057360', 'Exposed persons')" v-model="isChecked" />
				</div>
				<div class="col-xl-3 col-12">
					<div v-if="isChecked">
						<Number v-model="expPerson" type="number" :text="getTranslation('I00.00057370', 'Number of exposed persons')" :placeholder="getTranslation('I00.00057370', 'Number of exposed persons')" @input="$emit('changed', getValues())" />
					</div>
				</div>
			</div>
			<div class="row px-4">
				<span class="col-xl-3 col-12">{{ getTranslation('I00.00057380', 'Geographic location') }}</span>
			</div>
			<div class="row p-4">
				<div class="col-xl-3 col-12">
					<InputGroup :class="{ notValid: !isLatitudeValid }" :text="getTranslation('I00.00057390', 'Latitude')" :placeholder="getTranslation('I00.00057390', 'Latitude')" :value="lat" v-model="lat" @input="$emit('changed', getValues())" />
					<label class="alert alert-danger w-100 mt-2" v-show="!isLatitudeValid && latitudeErrorMessage">{{ latitudeErrorMessage }}</label>
				</div>
				<div class="col-xl-3 col-12">
					<InputGroup :class="{ notValid: !isLongitudeValid }" :text="getTranslation('I00.00057400', 'Longitude')" :placeholder="getTranslation('I00.00057400', 'Longitude')" :value="long" v-model="long" @input="$emit('changed', getValues())" />
					<label class="alert alert-danger w-100 mt-2" v-show="!isLongitudeValid && longitudeErrorMessage">{{ longitudeErrorMessage }}</label>
				</div>
			</div>
			<div class="row p-4">
				<div class="col-xl-3 col-12">
					<InputGroup :text="getTranslation('I00.00057480', 'Storage Type')" :validations="[maxLength(300)]" :placeholder="getTranslation('I00.00057480', 'Storage Type')" :value="storageType" v-model="storageType" @input="$emit('changed', getValues())" />
				</div>
				<div class="col-xl-3 col-12">
					<InputGroup :text="getTranslation('I00.00057490', 'Storage class')" :validations="[maxLength(300)]" :placeholder="getTranslation('I00.00057490', 'Storage class')" :value="storageClass" v-model="storageClass" @input="$emit('changed', getValues())" />
				</div>
			</div>
		</div>
	</MainTitle>
</template>
<style>
.chemsoft-date label {
	margin-bottom: 0.5rem;
}
</style>
<script>
import MainTitle from '../../../components/common/cardBox/MainTitle';
import { hashCode, errorDebug } from '../../../libraries/common';
import { validators } from '../../../libraries/forms';
import InputGroup from '../../../components/common/form/input/InputGroup.vue';
import DateGroup from '../../../components/common/form/date/DateGroup.vue';
import CheckBoxGroup from '../../../components/common/form/checkBox/CheckBoxGroup.vue';
import Number from '../../../components/common/form/input/Number.vue';
import { parseDate } from '../../../libraries/date';
import axios from '../../../axios';
export default {
  components: {
    MainTitle,
    InputGroup,
    DateGroup,
    CheckBoxGroup,
    Number
  },
  props: ['departmentInfo', 'orgId'],
  data() {
    return {
      isSaving: false,
      isLatitudeValid: true,
      isLongitudeValid: true,
      latitudeErrorMessage: null,
      longitudeErrorMessage: null,
      axios,
      originalHashCode: null,
      operationEnvironmentTypeList: [],
      selectedPhraseId: null,
      floorText: this.departmentInfo.FloorText,
      invDate: parseDate(this.departmentInfo.InventoryDate),
      isChecked: false,
      expPerson: this.departmentInfo.ExposedPerson,
      lat: this.departmentInfo.Latitude,
      long: this.departmentInfo.Longitude,
      storageType: this.departmentInfo.StorageType,
      storageClass: this.departmentInfo.StorageClass
    };
  },

  methods: {
    maxLength: validators.maxLength,
    getValues() {
      this.departmentInfo.VentilationType = this.departmentInfo.OperationEnvironmentTypeList.find(f => f.PhraseId == this.selectedPhraseId).Value;
      this.departmentInfo.FloorText = this.floorText;
      this.departmentInfo.InventoryDate = parseDate(this.invDate);
      this.departmentInfo.ExposedPerson = this.expPerson;
      this.departmentInfo.Latitude = this.lat;
      this.departmentInfo.Longitude = this.long;
      this.departmentInfo.StorageType = this.storageType;
      this.departmentInfo.StorageClass = this.storageClass;

      if (this.departmentInfo.Latitude && !this.departmentInfo.Longitude) {
        this.isLongitudeValid = false;
        this.longitudeErrorMessage = this.getTranslation("I00.00057440", "Required Longitude");
      }
      else if (!this.departmentInfo.Latitude && this.departmentInfo.Longitude) {
        this.isLatitudeValid = false;
        this.latitudeErrorMessage = this.getTranslation("I00.00057430", "Required Latitude");
      }
      else {
        this.isLongitudeValid = true;
        this.isLatitudeValid = true;
        this.longitudeErrorMessage = null;
        this.latitudeErrorMessage = null;
      }
    },
    validateLatitude(value) {
      if (!value)
        return true;
      else
        var isLatitude = isFinite(value) && Math.abs(value) <= 90 && value.length <= 12;
      if (!isLatitude) {
        this.isLatitudeValid = false;
        this.latitudeErrorMessage = this.getTranslation("I00.00057410", "Invalid Latitude");
      }
      else {
        this.isLatitudeValid = true;
        this.latitudeErrorMessage = null;
      }
      return isLatitude;
    },
    validateLongitude(value) {
      if (!value)
        return true;
      var isLongitude = isFinite(value) && Math.abs(value) <= 180 && value.length <= 13;
      if (!isLongitude) {
        this.isLongitudeValid = false;
        this.longitudeErrorMessage = this.getTranslation("I00.00057420", "Invalid Longitude");
      }
      else {
        this.isLongitudeValid = true;
        this.longitudeErrorMessage = null;
      }
      return isLongitude;
    },
    inputValidation(value) {
      if (!value)
        return true;
      return value.length <= 300;
    },
    save() {
      this.isSaving = true;
      this.departmentInfo.OrgID = this.orgId.id;
      this.departmentInfo.OrgID_mdbID = this.orgId.id_mdbID;
      this.departmentInfo.VentilationType = this.departmentInfo.OperationEnvironmentTypeList.find(f => f.PhraseId == this.selectedPhraseId).Value;
      axios.cancelAll()
        .postWithCancelToken('/OrganisationInfo/SetDepartmentInfoVentilationTypeChemsoft', { model: { ...this.departmentInfo } })
        .then(response => {
          if (response.data.saved) {
            this.isSaving = false;
            this.originalHashCode = hashCode(this.departmentInfo);
          }
        }).catch(error => {
          this.isSaving = false;
          errorDebug(error);
        });
      if (this.departmentInfo.ExposedPerson == "" || this.departmentInfo.ExposedPerson == null)
        this.isChecked = false;
      else this.isChecked = true;
    }
  },
  computed: {
    selectionChanged() {
      if (this.departmentInfo)
        if (this.originalHashCode != hashCode(this.departmentInfo) &&
          this.validateLatitude(this.departmentInfo.Latitude) &&
          this.validateLongitude(this.departmentInfo.Longitude) &&
          this.inputValidation(this.departmentInfo.StorageType) &&
          this.inputValidation(this.departmentInfo.StorageClass) &&
          this.inputValidation(this.departmentInfo.FloorText) &&
          !((this.departmentInfo.Latitude && !this.departmentInfo.Longitude) || (!this.departmentInfo.Latitude && this.departmentInfo.Longitude)))
          return true;
      return false;
    },
    isChanged() {
      return !this.selectionChanged;
    }
  },
  mounted() {
    this.getTranslation("I00.00057440", "Required Longitude");
    this.getTranslation("I00.00057430", "Required Latitude");
    this.getTranslation("I00.00057410", "Invalid Latitude");
    this.getTranslation("I00.00057420", "Invalid Longitude");
    var self = this;
    self.departmentInfo.InventoryDate = parseDate(self.departmentInfo.InventoryDate);
    this.departmentInfo.OperationEnvironmentTypeList.forEach(x => {
      self.operationEnvironmentTypeList.push(x.PhraseId);
    });
    if (this.departmentInfo.VentilationType == null || this.departmentInfo.VentilationType == "")
      this.selectedPhraseId = this.operationEnvironmentTypeList[0];
    else
      this.selectedPhraseId = this.departmentInfo.OperationEnvironmentTypeList.find(f => f.Value == this.departmentInfo.VentilationType).PhraseId;
    if (self.departmentInfo.ExposedPerson == "" || self.departmentInfo.ExposedPerson == null)
      this.isChecked = false;
    else this.isChecked = true;
    this.originalHashCode = hashCode(this.departmentInfo);
  }
};
</script>