<template>
	<MainTitle class="card pageWrapper" :text="getTranslation('I00.00025170', 'Contacts &amp; responsibilities')">
		<template #linkSlot>
			<ButtonIconSave v-if="departmentInfo && departmentInfo.HasPermission" @click="saveChanges" :class="{ disabled: isChanged }" @saveButtonStatus="saveStatus($event)" />
		</template>
		<SmallLoader v-if="!myContactsAndResponsibilitiesFields || isSaving" />
		<div class="p-3" :class="{ readOnly: !departmentInfo.HasPermission }" v-else>
			<div class="borderTRBL rounded" v-if="myContactsAndResponsibilitiesFields">
				<table class="table dataTable">
					<thead>
						<tr>
							<th class="w-20">
								{{ getTranslation('I00.00020000', 'Name') }}
								<sup class="astera">*</sup>
							</th>
							<th class="w-20">{{ getTranslation('I00.00025230', 'Responsibility') }}</th>
							<th class="wp-140">{{ getTranslation('I00.00025200', 'Phone') }}</th>
							<th class="wp-140">{{ getTranslation('I00.00025220', 'Mobile') }}</th>
							<th>{{ getTranslation('I00.00008030', 'E-mail') }}</th>
							<th class="wp-90">
								{{ getTranslation('I00.00025210', 'From date') }}
								<sup class="astera">*</sup>
							</th>
							<th class="iconCol">&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(field, ind) in myContactsAndResponsibilitiesFields.notDeleted()" :key="ind">
							<td class="w-20">{{ field.name }}</td>
							<td class="w-20">{{ field.responsibilityPhraseID != null ? getTranslation(field.responsibilityPhraseID) : '' }}</td>
							<td class="wp-140 wrapAll">{{ field.phone }}</td>
							<td class="wp-140 wrapAll">{{ field.mobile }}</td>
							<td>{{ field.email }}</td>
							<td class="wp-90">{{ field.fromDate }}</td>
							<td class="iconCol"><ButtonIcon iconClass="icon-delete" @click="$set(field, 'deleted', true)" :title="getTranslation('I00.00034190', 'Archive')" /></td>
						</tr>
						<tr class="grayBg">
							<td><SearchDropdownGroup :value="newField.name ? newField : null" @input="addName" prop="name" :items="items" required></SearchDropdownGroup></td>
							<td><SelectGroup class="mb-0 px-0 primaryTxt" :items="responsibilityList" :prop="getTranslation" v-model="newField.responsibilityPhraseID" /></td>
							<td><InputGroup v-model="newField.phone" :placeholder="getTranslation('I00.00025200', 'Phone')" :validations="[validators.maxLength(30)]" /></td>
							<td><InputGroup v-model="newField.mobile" :placeholder="getTranslation('I00.00025220', 'Mobile')" :validations="[validators.maxLength(30)]" /></td>
							<td><InputGroup v-model="newField.email" :placeholder="getTranslation('I00.00008030', 'E-mail')" :validations="[validators.email]" /></td>
							<td class="wp-90"><DateGroup v-model="newField.fromDate" required /></td>
							<td class="iconCol"><ButtonIconAdd @click="addField" :class="{ disabled: !isModelValid }" /></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</MainTitle>
</template>

<script>
import axios from '../../../axios';
import { hashCode, errorDebug, ticker } from '../../../libraries/common';
import MainTitle from '../../../components/common/cardBox/MainTitle';
import { validators } from '../../../libraries/forms';
import ButtonIconAdd from '../../../components/common/button/buttonIcon/ButtonIconAdd';
import { checkIsValid } from '../../../libraries/vue';
import { parseDate } from '../../../libraries/date';

export default {
  name: 'Contacts',
  components: {
    ButtonIconAdd,
    MainTitle
  },
  props: ['departmentInfo', 'contactsAndResponsibilities', 'responsibilityList', 'orgId'],
  data() {
    return {
      $modelValidators: [],
      validators,
      newField: {},
      originalHashCode: null,
      originalContactsAndResponsibilitiesFields: null,
      isSaving: false,
      myContactsAndResponsibilitiesFields: null,
      userList: null,
      items: []
    };
  },

  methods: {
    getUserList() {
      return axios
        .post('/DefaultPopUp/DefaultPopUpJson', { type: "AllUsers" })
        .then(response => {
          this.items = response.data.map(f => ({
            id: f.id,
            label: f.identifier + " " + f.mainText,
            name: f.mainText,
            ident: f.identifier,
            email: f.emailText,
            mobile: f.mobilePhone,
            phone: f.phone
          }));
        })
        .catch(errorDebug);
    },
    saveChanges() {
      var contactsAndResponsibilities = this.myContactsAndResponsibilitiesFields.map(f => ({
        ...f,
        id: 0,
        orgID: this.orgId.id,
        orgID_mdbID: this.orgId.id_mdbID,
      })).filter((f) => !(f.deleted));

      this.isSaving = true;
      return axios
        .post('/OrganisationInfo/SetContactsAndResponsibilitiesChemsoft', { model: { orgID: this.orgId.id, orgID_mdbID: this.orgId.id_mdbID, contactPersons: contactsAndResponsibilities } })
        .then(response => {
          if (response.data.saved)
            ticker.addSuccessMessage(response.data.serverMessage);
          this.isSaving = false;
          this.myContactsAndResponsibilitiesFields = response.data.contactPersons;
          this.originalHashCode = hashCode(this.myContactsAndResponsibilitiesFields);
        })
        .catch(error => {
          this.isSaving = false;
          errorDebug(error);
        });
    },
    addName(event) {
      this.newField = {
        ...this.newField,
        ...event,
      }
    },
    addField() {
      if (!checkIsValid(this)) return;

      this.myContactsAndResponsibilitiesFields.push({
        ...this.newField,
        fromDate: parseDate(this.newField.fromDate)
      });
      this.newField = {};
    },
    parseDate,
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    inputFieldsIsChanged() {
      if (this.myContactsAndResponsibilitiesFields)
        return this.originalHashCode !== hashCode(this.myContactsAndResponsibilitiesFields);
      return false;
    },
    isChanged() {
      return !this.inputFieldsIsChanged;
    }
  },
  mounted() {
    this.getUserList();
    if (process.env.NODE_ENV === 'development') window['thisContactsAndResponsibilities'] = this;
    this.myContactsAndResponsibilitiesFields = this.contactsAndResponsibilities;
    this.originalHashCode = hashCode(this.myContactsAndResponsibilitiesFields);
  },
};
</script>