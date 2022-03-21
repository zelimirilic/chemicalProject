<template>
	<header class="navbar flex-row flex-nowrap align-items-center topMenu hideOnPrint">
		<router-link to="/" class="navbar-brand"><img class="logoImg img-fluid" :src="settings.baseUrl + 'img/chemsoftLogoWhite.svg'" alt="Chemsoft" /></router-link>
		<MainMenu />
		<span class="menuBtn mr-3" @click="openModal()">
			<span>{{ getTranslation('I00.00055080', 'New application') }}</span>
		</span>
		<div class="specialType input-group wp-200 bigSearch" :class="{ active: showActiveClassSearch }">
			<div class="input-group-prepend">
				<span class="input-group-text icons icon-search" @click="searchAll"></span>
			</div>
			<input class="form-control" v-model="searchText" :placeholder="!showActiveClassSearch || this.searchText == '' ? getTranslation('I00.00004930', 'Search') : ''" @click="showActiveClassSearch = true" @blur="toggleMainSearch" @keyup.enter="searchAll" ref="mainSearchInput" />
			<div class="input-group-append">
				<span class="input-group-text icons icon-delete xsmallIcn" @mousedown="clearSearch"></span>
			</div>
		</div>
		<ul class="rightMenu navbar-nav flex-row align-items-center ml-3">
			<li class="nav-item" v-if="canSee.messageCenter()">
				<router-link to="/messages" class="nav-link icons icon-mail"></router-link>
			</li>
			<DropDownMenu :class="{ 'router-link-active': isActivePath('/settings') }" additionalClass="settings" align="right" ref="settings" v-show="hasSettings">
				<A class="nav-link icons icon-settings dropdown-toggle" />
				<template #items>
					<router-link to="/settings/settings" class="dropdown-item" exact v-if="canSee.settings()">{{ getTranslation('I00.00041900', 'Settings') }}</router-link>
					<template v-if="canSee.userAndPermission()">
						<router-link to="/settings/users" class="dropdown-item" exact>{{ getTranslation('I00.00030230', 'Users') }}</router-link>
						<router-link to="/settings/permissions" class="dropdown-item" exact>{{ getTranslation('I00.00030740', 'Permissions') }}</router-link>
					</template>
					<router-link to="/settings/product_type" class="dropdown-item" v-if="canSee.productType()">{{ getTranslation('I00.00012550', 'Product type') }}</router-link>
					<router-link :to="{ name: 'applicationForm' }" class="dropdown-item" v-if="canSee.applicationForm()">{{ getTranslation('I00.00049450', 'Form creator') }}</router-link>
				</template>
			</DropDownMenu>
			<DropDownMenu align="right" additionalClass="navUser">
				<A class="nav-link userLnk dropdown-toggle">{{ userInitials }}</A>
				<template #items>
					<div class="dropdown-item d-flex align-items-center lightGrayBg">
						<span class="userInit">{{ userInitials }}</span>
						<div class="userBox">
							<p class="userName mb-0">{{ appSettings.user.name }}</p>
							<p class="mt-1 mb-0" v-tooltip="organisationNodeNamePath">{{ findNodeNamePath(organisationNodeNamePath) }}</p>
						</div>
					</div>
					<div class="dropdown-item langBox" v-if="canSee.applicationLanguage()">
						<SelectGroup class="mb-0" @click.stop :items="$store.getters.state.appSettings.applicationLanguages" prop="languageName" :value="applicationLanguage" @input="setApplicationLanguage" :text="getTranslation('I00.00007060', 'System language')" />
					</div>
					<A class="dropdown-item logOut" @click="logOut()">{{ getTranslation('I00.00004150', 'Log out') }}</A>
				</template>
			</DropDownMenu>
		</ul>
		<ModalDialog additional-class="appForm wp-800" :title="getTranslation('I00.00055080', 'New application')" v-if="showModal" @close="closeModal">
			<ApplicationRequest v-if="canSee.application()"></ApplicationRequest>
		</ModalDialog>
	</header>
</template>


<script>
import MainMenu from './MainMenu';
import DropDownMenu from '../menu/DropDownMenu';
import { canSee } from '../../libraries/permissions';
import axios from '../../axiosOld-DONOTUSE';
import { isActivePath } from '../../libraries/router';
import ModalDialog from '../common/modal/ModalDialog.vue';
import ApplicationRequest from '../../views/applications/ApplicationRequest.vue';
import A from '../common/others/A.vue';
export default {
  components: {
    MainMenu,
    DropDownMenu,
    ModalDialog,
    ApplicationRequest,
    A
  },
  data() {
    return {
      searchText: '',
      hasSettings: false,
      showActiveClassSearch: false,
      showModal: false
    }
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    clearSearch() {
      this.searchText = '';
      setTimeout(() => this.$refs.mainSearchInput.focus(), 150);
    },
    hasChildren(prop) {
      return !!this.$refs[prop].$slots.items;
    },
    findNodeNamePath(data) {
      return data.split('\\').last();
    },
    logOut() {
      this.$router.push(this.$store.getters.getLogInLink());
      if (!this.$store.state.saveStatus)
        this.$emit('logout')
    },
    setApplicationLanguage(language) {
      this.$store.getters.state.appSettings.applicationLanguage = language.languageCode;
      this.setDocumentAndapplicationLanguage();
    },
    setDocumentLanguage(language) {
      this.$store.getters.state.appSettings.documentLanguage = language.languageCode;
      this.setDocumentAndapplicationLanguage();
    },
    setDocumentAndapplicationLanguage() {
      return axios.post('/LanguageSelector/ChangeLanguage', { doc_lang: this.$store.getters.state.appSettings.applicationLanguage, sys_lang: this.$store.getters.state.appSettings.applicationLanguage })
        .then(() => {
          axios.post("/Phrases/GetPhrases", { ids: Object.keys(this.$store.getters.state.phrases) })
            .then(response => this.$store.getters.state.phrases = response.data);
        });
    },
    searchAll() {
      if (!this.searchDisabled)
        this.$router.push(`/search?searchWord=${encodeURIComponent(this.searchText)}`);
    },
    getSearchWord() {
      if (this.$route.name === 'search')
        this.searchText = this.$route.query.searchWord;
    },
    toggleMainSearch() {
      this.showActiveClassSearch = !this.showActiveClassSearch;
    },
    isActivePath,
  },
  computed: {
    isSearchedFor() {
      return this.$route.name === 'search' && this.$route.query.searchWord === this.searchText;
    },
    organisationNodeNamePath() {
      return (this.$store.state.appSettings.user.organisationNodeNamePath || '')
    },
    searchDisabled() {
      return this.searchText.isNullOrEmpty() || this.isSearchedFor;
    },
    applicationLanguage() {
      return this.$store.getters.state.appSettings.applicationLanguage ?
        this.$store.getters.state.appSettings.applicationLanguages.find(f => f.languageCode == this.$store.getters.state.appSettings.applicationLanguage)
        : this.$store.getters.state.appSettings.applicationLanguage.firstOrDefault();
    },
    userInitials() {
      return this.appSettings.user.name.split(' ').map(f => f[0])
        .concat(this.appSettings.user.name[1])
        .take(2).join('')
        .toUpperCase();
    },
    canSee: canSee,
  },
  watch: {
    '$route.query.searchWord'() {
      this.getSearchWord();
    }
  },
  mounted() {
    this.getSearchWord();
    this.hasSettings = this.hasChildren('settings');

    this.$root.$on('Navigation', () => {
      this.closeModal();
    });
  }
}
</script>