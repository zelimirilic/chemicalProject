<template>
	<MainTitle class="card pageWrapper" :class="{ readOnly: !departmentInfo.HasPermission || !appSettings.permissions.organizationSpecificField.full }" :text="getTranslation('I00.00048540', 'Organisation specific fields')">
		<template #linkSlot>
			<ButtonIconSave v-if="departmentInfo && departmentInfo.HasPermission && appSettings.permissions.organizationSpecificField.full" @click="saveChanges" :class="{ disabled: saveStatusValue }" @saveButtonStatus="saveStatus($event)" />
		</template>
		<SmallLoader v-if="!myDepartmentFields || isSaving" />
		<div class="p-3" v-else>
			<div class="tblWrap borderTRBL rounded" v-if="myDepartmentFields">
				<table class="table dataTable">
					<thead>
						<tr>
							<th class="w-25">
								{{ getTranslation('I00.00039430', 'Insert field title') }}
								<sup class="astera">*</sup>
							</th>
							<th>
								{{ getTranslation('I00.00039440', 'Insert field values') }}
								<sup class="astera">*</sup>
							</th>
							<th class="wp-220">&nbsp;</th>
							<th class="iconCol">&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(ownField, ind) in myDepartmentFields.filter((f) => !f.Deleted)" :key="ind">
							<td class="w-25">
								<InputGroup class="disabled" v-model="ownField.Name" placeholder="Name" type="text" required />
							</td>
							<td>
								<InputCollection :value="parseValue(ownField.DepartmentOwnFieldValues[0].DefaultValue)" @input="ownField.DepartmentOwnFieldValues[0].InheritedFromParent ? setFieldToLocal(ownField, $event) : setValue(ownField, $event)" :validations="[maxLength(35)]" />
							</td>
							<td class="wp-220">
								<CheckBoxGroup class="mt-2" v-model="ownField.DepartmentOwnFieldValues[0].Inheritable" :class="{ readOnly: isInheritedOrLocalField(ownField) }">{{ getTextForOrgFieldDescription(ownField) }}</CheckBoxGroup>
							</td>
							<td class="iconCol">
								<ButtonIcon class="d-block mt-1" iconClass="icon-delete" v-if="!ownField.DepartmentOwnFieldValues[0].InheritedFromParent" @click="removeField(ownField)" :title="getTranslation('I00.00034190', 'Archive')" withReadOnlyMode />
							</td>
						</tr>
						<tr class="grayBg">
							<td class="w-20">
								<InputGroup v-model="newOwnField.Name" placeholder="Name" :validations="[maxLength(35)]" />
							</td>
							<td>
								<InputCollection placeholder="Default Value" :value="parseValue(newOwnField.Value)" @input="$set(newOwnField, 'Value', stringifyValue($event))" :validations="[maxLength(35)]" />
							</td>
							<td class="wp-220">
								<CheckBoxGroup class="mt-2" v-model="newOwnField.Inheritable">{{ getTranslation('I00.00048580', 'Inherit field to child departments.') }}</CheckBoxGroup>
							</td>
							<td class="iconCol">
								<ButtonIconAdd class="d-block mt-1" @click="addField" withReadOnlyMode />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</MainTitle>
</template>

<script>
import InputCollection from '../../common/form/input/InputCollection';
import axios from '../../../axiosOld-DONOTUSE';
import { hashCode, errorDebug, ticker, camelCaseObj, tryParse } from '../../../libraries/common';
import MainTitle from '../../../components/common/cardBox/MainTitle';
import { validators } from '../../../libraries/forms';
import ButtonIconAdd from '../../../components/common/button/buttonIcon/ButtonIconAdd';
import { checkIsValid } from '../../../libraries/vue';

export default {
  name: 'Users',
  components: {
    ButtonIconAdd,
    MainTitle,
    InputCollection
  },
  props: ['departmentInfo', 'departmentOwnFields', 'orgId'],
  data() {
    return {
      errorMessage: null,
      $modelValidators: [],
      hashDepartmentsOwnFields: null,
      departmentFieldHelper: null,
      newOwnField: {},
      originalHashCode: null,
      originalDepartmentsOwnFields: null,
      isSaving: false,
      myDepartmentFields: null
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

      var departmentOwnFields = this.myDepartmentFields.map(f => ({
        ID: f.ID,
        OrgID: this.orgId.id,
        OrgID_mdbID: this.orgId.id_mdbID,
        Name: f.Name,
        DefaultValue: f.DepartmentOwnFieldValues[0].DefaultValue,
        Inheritable: f.DepartmentOwnFieldValues[0].Inheritable,
        Deleted: f.Deleted === true,
        Changed: f.hash !== hashCode({ ...f, hash: undefined }),
        Local: f.DepartmentOwnFieldValues[0].Local == 'localField',
        Parent: false,
        ParentFrom: f.DepartmentOwnFieldValues[0].InheritedFromParent,
        Valid: true
      }));

      departmentOwnFields = departmentOwnFields.filter((f) => !(!f.ID && f.Deleted));
      if (departmentOwnFields.length < 1) { this.isSaving = true; return; }
      this.isSaving = true;
      return axios
        .cancelAll()
        .post('/OrganisationInfo/SetDepartmentInfoSpecificChemsoft', { model: { OrgID: this.orgId.id, OrgID_mdbID: this.orgId.id_mdbID, DepartmentFieldHelper: departmentOwnFields } })
        .then(response => {
          if (response.data.saved)
            ticker.addSuccessMessage(response.data.serverMessage);
          this.isSaving = false;
          this.myDepartmentFields = response.data.DepartmentOwnFields;
          this.originalDepartmentsOwnFields = JSON.stringify(response.data.DepartmentOwnFields);
          this.originalHashCode = hashCode(this.departmentInfo);
        })
        .then(() => {
          if (this.appSettings.useReportsAdditionalColumns)
            this.loadAdditionalColumns();
        })
        .catch(error => {
          this.isSaving = false;
          errorDebug(error);
        });
    },
    loadAdditionalColumns() {
      this.$store.getters.state.reportsAdditionalColumns = [];
      axios.post('/OrgProdList/GetAdditionalColumns')
        .then(reponse => this.$store.getters.state.reportsAdditionalColumns = camelCaseObj(reponse.data).map(f => ({
          ...f,
          name: f.name.camelCase(),
          type: f.type.camelCase(),
        })));
    },
    maxLength: validators.maxLength,
    addField() {
      if (!checkIsValid(this)) return;
      if (!this.newOwnField.Name || this.newOwnField.Name === "") return;

      this.myDepartmentFields.push({
        Name: this.newOwnField.Name,
        DepartmentOwnFieldValues: [{ DefaultValue: this.newOwnField.Value, Inheritable: this.newOwnField.Inheritable }],
        Deleted: false
      });
      this.newOwnField = {};
      this.isSaving = false;
    },
    removeField(ownField) {
      ownField.Deleted = true;
      ownField.Name = '';
      this.isSaving = false;
    },
    setFieldToLocal(ownField, value) {
      ownField.DepartmentOwnFieldValues[0].InheritedFromParent = false;
      ownField.DepartmentOwnFieldValues[0].Local = 'localField';
      this.isSaving = false;
      this.setValue(ownField, value);
    },
    getTextForOrgFieldDescription(ownField) {
      return ownField.DepartmentOwnFieldValues[0].Local == 'localField' ? this.getTranslation('I00.00048610', 'Local field.') : ownField.DepartmentOwnFieldValues[0].InheritedFromParent ? this.getTranslation('I00.00048620', 'Inherited field to child departments.') : this.getTranslation('I00.00048580', 'Inherit field to child departments.');
    },
    isInheritedOrLocalField(ownField) {
      return ownField.DepartmentOwnFieldValues[0].InheritedFromParent || ownField.DepartmentOwnFieldValues[0].Local == 'localField';
    },
    parseValue(value) {
      var val = tryParse(value) || value;
      if (val == null) return val;

      return (Array.isArray(val) && val.length > 1) ? val : [val];
    },
    stringifyValue(value) {
      return value.length > 1 ? JSON.stringify(value) : value.first();
    },
    setValue(ownField, value) {
      this.$set(ownField.DepartmentOwnFieldValues[0], 'DefaultValue', this.stringifyValue(value));
    }
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    inputFieldsIsChanged() {
      if (this.myDepartmentFields)
        return this.originalHashCode != hashCode(this.departmentInfo) || this.originalDepartmentsOwnFields !== JSON.stringify(this.myDepartmentFields.filter((f) => !f.Deleted));
      return null;
    },
    saveStatusValue() {
      return !this.isModelValid || !this.inputFieldsIsChanged || this.isSaving;
    }
  },
  mounted() {
    this.originalHashCode = hashCode(this.departmentInfo);
    this.myDepartmentFields = this.departmentOwnFields;
    this.originalDepartmentsOwnFields = JSON.stringify(this.myDepartmentFields);
  },
  beforeDestroy() {
    axios.cancelAll();
  },
};
</script>