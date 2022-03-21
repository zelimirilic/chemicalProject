<template>
	<MainLoader v-if="!departmentInfo" />
	<div v-else>
		<DepartmentInfoBasics :departmentInfo="departmentInfoForBasic" :orgId="orgId" @saveButtonStatus="saveStatus.departmentInfoBasics = $event" />
		<DepartmentInfoImage class="mt-4" :departmentInfo="departmentInfoForImage" :defaultImageContent="defaultImageContent" :orgId="orgId" @saveButtonStatus="saveStatus.departmentInfoImage = $event" />
		<DepartmentInfoPermissions v-if="isAvailableDepartmentInfoForPermissions" class="mt-4" :departmentInfo="departmentInfoForPermissions" :appSettings="appSettings" :orgId="orgId" @saveButtonStatus="saveStatus.departmentInfoPermissions = $event" />
		<DepartmentInfoSpecificFields class="mt-4" :departmentInfo="departmentInfoForSpecificField" :departmentOwnFields="departmentOwnFieldsForSpecificField" :orgId="orgId" @saveButtonStatus="saveStatus.departmentInfoSpecificFields = $event" />
		<ContactsAndResponsibilities class="mt-4" :departmentInfo="departmentInfoForPermissions" :contactsAndResponsibilities="contactsAndResponsibilitiesData" :responsibilityList="responsibilityListData" :orgId="orgId" />
		<DocumentsBoxEditor :documentCategories="'departmentDocumentsOnly'" :orgId="orgId" />
	</div>
</template>

<script>
import axios from '../../../axiosOld-DONOTUSE';
import { errorDebug, deepClone, hashCode, camelCaseObj } from '../../../libraries/common';
import { validators } from '../../../libraries/forms';
import DepartmentInfoBasics from '../../../components/settings/departmentInfo/DepartmentInfoBasics';
import DepartmentInfoImage from '../../../components/settings/departmentInfo/DepartmentInfoImage';
import DepartmentInfoSpecificFields from '../../../components/settings/departmentInfo/DepartmentInfoSpecificFields';
import ContactsAndResponsibilities from '../../../components/settings/departmentInfo/ContactsAndResponsibilities';
import DepartmentInfoPermissions from '../../../components/settings/departmentInfo/DepartmentInfoPermissions';
import DocumentsBoxEditor from '../../../components/products/productPage/DocumentsBoxEditor';

export default {
  components: {
    DepartmentInfoBasics,
    DepartmentInfoSpecificFields,
    ContactsAndResponsibilities,
    DepartmentInfoImage,
    DepartmentInfoPermissions,
    DocumentsBoxEditor
  },
  props: ['orgId'],
  data() {
    return {
      departmentInfo: null,
      departmentInfoForBasic: null,
      departmentInfoForSpecificField: null,
      departmentInfoForImage: null,
      departmentInfoForPermissions: null,
      errorMessage: null,
      defaultImageContent: null,
      departmentOwnFieldsForSpecificField: null,
      contactsAndResponsibilitiesData: null,
      responsibilityListData: null,
      saveStatus: { departmentInfoBasics: false, departmentInfoImage: false, departmentInfoPermissions: false, departmentInfoSpecificFields: false },
      saveStatusHash: null
    }
  },
  watch: {
    orgId() {
      this.getDepartmentInfo();
    },
    saveStatusValue() {
      this.$emit('saveButtonsStatus', this.saveStatusValue);
    }
  },
  methods: {
    maxLength: validators.maxLength,
    getDepartmentInfo() {
      this.departmentInfo = null;
      return axios
        .cancelAll()
        .post('/OrganisationInfo/GetDepartmentInfo', { orgId: this.orgId.id, orgIdMdbId: this.orgId.id_mdbID })
        .then(response => {
          this.departmentInfo = response.data.departmentInfo;
          this.defaultImageContent = response.data.departmentInfo.DefaultImageContent;
          this.errorMessage = null;
          this.departmentOwnFieldsForSpecificField = response.data.departmentInfo.DepartmentOwnFields.map(f => deepClone({ ...f, hash: hashCode(f) }));
          this.contactsAndResponsibilitiesData = camelCaseObj(response.data.departmentInfo.ContactPersons.map(f => deepClone({ ...f, hash: hashCode(f) })));
          this.responsibilityListData = camelCaseObj(response.data.responsibilityList).map(f => f.value);
          // inner controlls works with full clones 
          this.departmentInfoForBasic = { ...this.departmentInfo };
          this.departmentInfoForSpecificField = { ...this.departmentInfo };
          this.departmentInfoForImage = { ...this.departmentInfo };
          this.departmentInfoForPermissions = { ...this.departmentInfo };
          this.saveStatusHash = hashCode(this.saveStatus)
        })
        .catch(errorDebug);
    }
  },
  translationsLoaded() {
    if (process.env.NODE_ENV === 'development') window['thisDepartmentInfo'] = this;
    this.getDepartmentInfo();
  },
  computed: {
    isChanged() {
      return this.saveStatusHash !== hashCode(this.saveStatus);
    },
    saveStatusValue() {
      return Object.values(this.saveStatus).filter(x => x == true).length > 0;
    },
    isAvailableDepartmentInfoForPermissions() {
      return this.appSettings.inventoryStatus
        || this.appSettings.excludedFromRA
        || this.appSettings.inventoryNotAllowed
        || this.foodProcessingEnabled;
    },
  },
  mounted() {
    this.getTranslation('I00.00039670', 'You try to import too large file. Size restriction max 8mb.');
    this.getTranslation('I00.00051660', 'Sorry you can only upload following files:');
    this.getTranslation('I00.00003650', 'Information');
  },
  beforeDestroy() {
    axios.cancelAll();
  }
};
</script>