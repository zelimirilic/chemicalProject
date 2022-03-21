<template>
	<MainLoader v-if="!userData || !sideTree.getAllData()" />
	<div v-else>
		<nav class="actionMenu navbar HideOnPrint">
			<div class="d-flex flex-row flex-wrap ml-auto mr-4">
				<div class="actionLnk mr-4" :class="{ disabled: inputFieldsIsChanged }" v-if="$route.params.id" @click="showResetPasswordModal">
					<span class="icons icon-restore plainIcn"></span>
					<u>{{ getTranslation('I00.00005500', 'Reset') }}</u>
				</div>
				<template v-if="!$route.params.id">
					<span class="icons icon-plus ml-auto mr-4" v-on:click="clearUserData" v-if="userData.userID" v-tooltip="getTranslation('I00.00014710', 'New')"></span>
					<span v-else class="icons icon-plus ml-auto mr-4 disabled"></span>
				</template>
				<div class="actionLnk mr-4" :class="{ disabled: !isModelValid || !inputFieldsIsChanged }" @click="checkUser">
					<span class="icons icon-save plainIcn"></span>
					<u>{{ getTranslation('I00.00004810', 'Save') }}</u>
				</div>
			</div>
		</nav>
		<SmallLoader v-if="smallLoader" />
		<div class="card-deck cards" v-else>
			<div class="card">
				<MainTitle :text="getTranslation('I00.00047180', 'Basic information')"></MainTitle>
				<div class="card-body">
					<InputGroup :validations="[maxLength(512)]" v-model="userData.name" :text="getTranslation('I00.00030380', 'Name (first name and surname)')" required />
					<InputGroup class="mt-3" :type="'email'" :validations="[validators.email]" v-model="userData.additionalInfo.email" :text="getTranslation('I00.00008030', 'E-mail')" required />
					<InputGroup class="mt-3" :validations="[maxLength(512)]" v-model="userData.login" :text="getTranslation('I00.00009390', 'User name')" required />
					<template v-if="!$route.params.id">
						<InputGroup class="readOnly mt-3" :specialType="true" :value="userData.password" :text="getTranslation('I00.00030300', 'Temporary one-time password:')" v-if="userData.userID">
							<div class="input-group-append" v-tooltip="getTranslation('I00.00008190', 'Copy')">
								<span class="input-group-text icon-copy" @click="copyTempPassword"></span>
							</div>
						</InputGroup>
					</template>
				</div>
			</div>
			<div class="card">
				<MainTitle :text="getTranslation('I00.00041900', 'Settings')"></MainTitle>
				<div class="card-body">
					<SelectGroup class="mb-0" :items="applicationLanguages" prop="languageName" :value="getApplicationLanguageGroup()" @input="userData.defaultApplicationLanguage = $event.languageCode" :text="getTranslation('I00.00030310', 'Default application language')" />
					<SelectGroup class="mt-3 mb-0" :items="authorisationGroups" prop="name" v-model="userData.group" :text="getTranslation('I00.00030290', 'Authorisation group')" required />
					<OrganisationPicker class="mt-3" :text="getTranslation('I00.00030360', 'User belongs to organisational unit')" v-model="userData.organisation.orgID" :data="sideTree.getAllData()" required />
					<OrganisationPicker class="mt-3" :text="getTranslation('I00.00030340', 'Read permissions, organisational unit')" v-model="userData.organisationRead.orgID" :data="sideTree.getAllData()" required />
					<OrganisationPicker class="mt-3" :text="getTranslation('I00.00030350', 'Write permissions, organisational unit')" v-model="userData.organisationWrite.orgID" :data="sideTree.getAllData()" required />
					<SelectGroup class="mt-3 mb-0" :specialType="true" :items="startUpPages()" prop="name" :value="startUpPage" @input="$set(userData.additionalInfo, 'startUpTypePerUser', $event.page)" :text="getTranslation('I00.00053590', 'Start page')" compareByHash>
						<div class="input-group-append" v-tooltip="getTranslation('I00.00026430', 'Restore')">
							<span class="input-group-text icons icon-restore" :class="{ disabled: userData.additionalInfo.startUpTypePerUser == null }" @click="$set(userData.additionalInfo, 'startUpTypePerUser', null)"></span>
						</div>
					</SelectGroup>
				</div>
			</div>
			<div class="card">
				<MainTitle :text="getTranslation('I00.00050540', 'Additional information')"></MainTitle>
				<div class="card-body">
					<InputGroup :validations="[maxLength(512)]" v-model="userData.empNo" :text="getTranslation('I00.00030370', 'Employment no.')" />
					<InputGroup class="mt-3" :validations="[maxLength(512)]" v-model="userData.title" :text="getTranslation('I00.00022890', 'Title')" />
					<InputGroup class="mt-3" :validations="[maxLength(512)]" v-model="userData.homePhone" :text="getTranslation('I00.00025200', 'Phone')" />
					<InputGroup class="mt-3" :validations="[maxLength(512)]" v-model="userData.directTel" :text="getTranslation('I00.00025220', 'Mobile')" />
				</div>
			</div>
		</div>
		<ModalDialog additional-class="wp-400" :title="getTranslation('I00.00030480', 'Reset password')" hideClose v-if="showModalConfirm">
			<InputGroup :type="'email'" :validations="[validators.email]" v-model="resetPasswordEmail" :text="getTranslation('I00.00030810', 'Address where to send email')" />
			<div class="pt-4 text-right">
				<ButtonOk @click="resetPassword" :class="{ disabled: !validators.email.fnc(resetPasswordEmail) || checkMail }" />
				<ButtonCancel @click="showModalConfirm = false" />
			</div>
		</ModalDialog>
	</div>
</template>

<script>
import axios from '../../../axiosOld-DONOTUSE';
import { validators } from '../../../libraries/forms';
import { checkIsValid } from '../../../libraries/vue';
import { hashCode, errorDebug, ticker, parseID, idToString, camelCaseObj, idsAreEqual, randomChars, isNullOrEmpty } from '../../../libraries/common';
import MainTitle from '../../../components/common/cardBox/MainTitle';
import OrganisationPicker from '../../../components/common/form/picker/OrganisationPicker';
import { startUpPages } from '../../../libraries/permissions';
import { nodeNamePath } from '../../../libraries/tree';

export default {
  name: 'UserEdit',
  components: {
    OrganisationPicker,
    MainTitle
  },
  data() {
    return {
      smallLoader: false,
      $modelValidators: [],
      hashSettings: null,
      showModalConfirm: false,
      lastLogin: null,
      userData: null,
      authorisationGroups: [],
      applicationLanguages: [],
      documentLanguages: [],
      validators,
      isValid: true,
      resetPasswordEmail: null,
    };
  },
  methods: {
    getOptionsLists() {
      return axios.cancelAll()
        .postWithCancelToken('/UserManagement/GetOptionsLists')
        .then(response => {
          var data = camelCaseObj(response.data);
          Object.keys(data).forEach(key => this[key] = data[key]);
        });
    },
    getUserInfo() {
      if (this.$route.name == 'userNew') {
        return new Promise(resolve => resolve(this.setUserEmptyOrganisations({
          defaultApplicationLanguage: 'S', defaultDocumentLanguage: 'S',
          additionalInfo: {}, group: this.authorisationGroups.first(),
          password: randomChars(6),
        })));
      } else {
        return axios
          .cancelAll()
          .postWithCancelToken('/UserManagement/GetUserForEdit', { id: parseID(this.$route.params.id.replace('_', ':')) })
          .then(response => {
            var data = camelCaseObj(response.data);
            data.group = this.authorisationGroups.find(f => idsAreEqual(f.userGroupID, data.group.userGroupID));
            this.lastLogin = data.login;
            return this.setUserEmptyOrganisations(data);
          });
      }
    },
    setUserEmptyOrganisations(user) {
      user.organisation = user.organisation || {};
      user.organisationRead = user.organisationRead || {};
      user.organisationWrite = user.organisationWrite || {};
      return user;
    },
    checkUser() {
      if (!checkIsValid(this)) return;
      this.smallLoader = true;
      if (this.lastLogin !== this.userData.login) {
        return axios
          .post('/UserManagement/CheckIfUserNotExist', { login: this.userData.login })
          .then(response => {
            if (response.data.status)
              this.saveUser();
            else {
              this.smallLoader = false;
              ticker.addErrorMessage(this.getTranslation('I00.00051420', 'The username already exists. Please use a different username.'));
            }
          }).catch(this.errorDebug);
      } else {
        this.saveUser();
      }
    },
    maxLength: validators.maxLength,
    resetPassword() {
      if (!isNullOrEmpty(this.resetPasswordEmail) && isNullOrEmpty(this.userData.additionalInfo.email))
        this.userData.additionalInfo.email = this.resetPasswordEmail;
      this.showModalConfirm = false;
      this.smallLoader = true;
      return axios
        .post('/UserManagement/ResetPassword', { user_id: this.userData.userID.id, user_mdbid: this.userData.userID.id_mdbID, email: this.resetPasswordEmail, language: this.userData.defaultApplicationLanguage })
        .then(() => {
          this.smallLoader = false;
          this.hashSettings = hashCode(this.userData);
          ticker.addSuccessMessage(this.getTranslation('I00.00030440', 'Email with details is sent'));
        }).catch(this.errorDebug);
    },
    saveUser() {
      axios.cancelAll();
      this.smallLoader = true;
      return axios
        .post('/UserManagement/SaveUser', { user: this.userData })
        .then(response => {
          this.userData = this.setUserEmptyOrganisations(camelCaseObj(response.data));
          var currentUser = this.$store.state.appSettings.user.userID;
          if (idsAreEqual(this.userData.userID, currentUser)) {
            this.$store.state.appSettings.user.name = this.userData.name;
            this.$store.state.appSettings.user.organisationNodeNamePath = this.getUserNodeNamePath(this.userData.organisation);
          }
          this.userData.group = this.authorisationGroups.find(f => idsAreEqual(f.userGroupID, this.userData.group.userGroupID));
          this.hashSettings = hashCode(this.userData);
          this.lastLogin = this.userData.login;
          this.smallLoader = false;
          this.hashSettings = hashCode(this.userData);
          ticker.addSuccessMessage(this.getTranslation('I00.00051690', 'User saved successfully'));
        }).catch(this.errorDebug);
    },
    getRoute() {
      return this.$route.name;
    },
    getApplicationLanguageGroup() {
      return this.applicationLanguages.find(f => f.languageCode == this.userData.defaultApplicationLanguage);
    },
    getDocumentLanguageListGroup() {
      return this.documentLanguages.find(f => f.id == this.userData.defaultDocumentLanguage);
    },
    getUserNodeNamePath(obj) {
      var item = camelCaseObj(obj);
      var nod = this.sideTree.getAllData().find(f => idsAreEqual(f.item.orgID, item.orgID));
      return (nodeNamePath(nod) || "");
    },
    showResetPasswordModal() {
      this.showModalConfirm = true;
      this.resetPasswordEmail = this.userData.additionalInfo.email;
    },
    errorDebug(message) {
      this.smallLoader = false;
      return errorDebug(message);
    },
    getUserData() {
      this.getOptionsLists()
        .then(() => this.getUserInfo())
        .then(response => {
          this.userData = response;
          this.userData.additionalInfo = this.userData.additionalInfo || {};
          this.hashSettings = hashCode(this.userData);
        }).catch(errorDebug);
    },
    nodeSelected() {
      if (!this.userData)
        this.getUserData();
    },
    copyTempPassword() {
      navigator.clipboard.writeText(this.userData.password);
      ticker.addInfoMessage(this.getTranslation('I00.00056900', 'Temporary password copied!'));
    },
    clearUserData() {
      var routeName = this.getRoute();
      if (routeName == 'userNew')
        this.getUserData()
    },
    idToString,
    parseID,
    startUpPages,
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    inputFieldsIsChanged() {
      return this.hashSettings !== hashCode(this.userData);
    },
    checkMail() {
      var isEmpty = isNullOrEmpty(this.resetPasswordEmail);
      return isEmpty;
    },
    startUpPage() {
      var startUpPages = this.startUpPages();
      return startUpPages.find(f => f.page === this.userData.additionalInfo.startUpTypePerUser) ||
        startUpPages.find(f => f.page === this.userData.group.startUpType) ||
        startUpPages[0];
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisUser'] = this;

    if (this.sideTree.getAllData())
      this.nodeSelected();

    this.$store.state.hasMenu = true;

    this.getTranslation('I00.00030810', 'Address where to send email');
    this.getTranslation('I00.00003650', 'Information');
    this.getTranslation('I00.00051420', 'The username already exists. Please use a different username.');
    this.getTranslation('I00.00051690', 'User saved successfully');
    this.getTranslation('I00.00030440', 'Email with details is sent');
    this.getTranslation('I00.00056900', 'Temporary password copied!');
  },
  beforeDestroy() {
    axios.cancelAll();
    ticker.clearMessages();
    this.$store.state.hasMenu = false;
  }
};
</script>