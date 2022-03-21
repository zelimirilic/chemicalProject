<template>
	<MainTitle class="card pageWrapper" :text="getTranslation('I00.00040090', 'Information')">
		<template #linkSlot>
			<ButtonIconSave v-if="departmentInfo && departmentInfo.HasPermission" @click="saveChanges" :class="{ disabled: saveStatusValue }" @saveButtonStatus="saveStatus($event)" />
		</template>
		<SmallLoader v-if="!departmentInfo || isSavingShowLoader" />
		<div class="p-4" :class="{ readOnly: !departmentInfo.HasPermission }" v-else>
			<div class="row align-items-end">
				<InputGroup class="col-xl-6 col-12 mb-4 readOnly" :text="getTranslation('I00.00020000', 'Name')" :validations="[maxLength(512)]" v-model="departmentInfo.Name" />
				<InputGroup class="col-xl-3 col-6 mb-4" :text="getTranslation('I00.00025270', 'Deptartment ID')" :validations="[maxLength(512)]" v-model="departmentInfo.DepartmentID" />
				<InputGroup class="col-xl-3 col-6 mb-4" :text="getTranslation('I00.00038380', 'Emergency telephone number')" :validations="[maxLength(255)]" v-model="departmentInfo.OrganisationEmergencyNumber" />
			</div>
			<div class="grayBg borderTRBL rounded px-3 py-2">
				<div class="mt-3 mb-4" v-if="departmentInfo.HasParent">
					<CheckBoxGroup v-model="departmentInfo.InheritFromParent">{{ getTranslation('I00.00025150', 'Use the same as parent department') }}</CheckBoxGroup>
				</div>
				<div id="orginfo_basic_data" :class="{ disabled: departmentInfo.InheritFromParent && departmentInfo.HasPermission, readOnly: !departmentInfo.HasPermission }">
					<div class="row p-1">
						<InputGroup class="col-12" :text="getTranslation('I00.00007880', 'Address')" :validations="[maxLength(512)]" v-model="departmentInfo.Address" />
					</div>
					<div class="row p-1">
						<InputGroup class="col-xl-2 col-3 mt-2" :text="getTranslation('I00.00025240', 'Postal No.')" :validations="[maxLength(512)]" v-model="departmentInfo.PostalNumber" />
						<InputGroup class="col-xl-6 col-6 mt-2" :text="getTranslation('I00.00025250', 'City')" :validations="[maxLength(512)]" v-model="departmentInfo.City" />
						<SelectGroup class="col-xl-4 col-3 mt-2" :items="departmentInfo.CountryList" :text="getTranslation('I00.00016760', 'Country')" prop="Text" :value="getCountrySelected()" @input="chooseCountry($event)" />
					</div>
				</div>
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
  props: ['departmentInfo', 'orgId'],
  data() {
    return {
      errorMessage: null,
      $modelValidators: [],
      departmentFieldHelper: null,
      originalHashCode: null,
      isSaving: false,
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
        .postWithCancelToken('/OrganisationInfo/SetDepartmentInfoBasicsChemsoft', { model: { ...this.departmentInfo } })
        .then(response => {
          if (response.data.saved)
            ticker.addSuccessMessage(response.data.serverMessage);
          this.isSaving = false;
          this.isSavingShowLoader = false;
          this.departmentInfo.Address = response.data.address;
          this.departmentInfo.City = response.data.city;
          this.departmentInfo.PostalNumber = response.data.postalNumber;
          this.departmentInfo.OrganisationEmergencyNumber = response.data.organisationEmergencyNumber;
          this.departmentInfo.Country = response.data.country;
          this.originalHashCode = hashCode(this.departmentInfo);
        })
        .catch(error => {
          this.isSaving = false;
          this.isSavingShowLoader = false;
          errorDebug(error);
        });
    },
    getCountrySelected() {
      if (this.departmentInfo) return this.departmentInfo.CountryList.find(f => f.Value == this.departmentInfo.Country);
      else return this.departmentInfo.CountryList.first();
    },
    chooseCountry(country) {
      this.$set(this.departmentInfo, 'Country', parseInt(country.Value));
    },
    maxLength: validators.maxLength,
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
  }
};
</script>