<template>
	<div v-cloak>
		<MainLoader v-if="loading || !translationsLoaded" />
		<template v-else>
			<ChangePassword :userId="appSettings.user.userID" v-if="appSettings.user.temporaryPassword" />
			<template v-else>
				<!-- <div class="overlayWrap">&nbsp;</div> -->
				<Navigation @logout="logOut" @search="search" />

				<main class="mainWrapper" :style="mainStyleHeight" ref="main">
					<SideBar v-model="sideBarOpened" @input="saveToStorage('sideBarOpened', $event)" @nodeSelected="nodeSelected($event, true)" />

					<div class="contScroll scrollBar" @scroll="onScroll" :class="{ 'mt-5': $store.state.hasMenu }" ref="contScroll">
						<div class="contentWrap">
							<Tickers />
							<router-view ref="view" />
							<ModalDialog v-if="$store.state.modalConfirm.show" additional-class="wp-400" :title="$store.state.modalConfirm.title" @close="$store.state.modalConfirm.reject">
								<h6>{{ $store.state.modalConfirm.message }}</h6>
								<div class="pt-4 text-right">
									<ButtonOk @click="$store.state.modalConfirm.resolve" />
									<ButtonCancel @click="$store.state.modalConfirm.reject" />
								</div>
							</ModalDialog>
						</div>
					</div>
				</main>
				<button class="btn backToTop hideOnPrint" :title="getTranslation('I00.00053290', 'Go to top')" @click="scrollToTop()" v-if="showScrollButton"><span class="icons icon-arrowup"></span></button>
			</template>
		</template>
	</div>
</template>

<script>
import { parseID, tryParse, idsAreEqual, camelCaseObj } from '../libraries/common';
import { getAllChildren, logOut, loadSettings } from '../libraries/vue';
import { getOrganisationTreeData } from '../libraries/tree';
import { validators } from '../libraries/forms';
import axios from '../axios';
import { requestFields, reviewFields } from '../libraries/applicationFormData';
import Navigation from '../components/navigation/Navigation';
import SideBar from '../components/navigation/SideBar';
import Tickers from '../components/ticker/Tickers';
import ChangePassword from './login/ChangePassword';

export default {
  components: {
    Navigation,
    SideBar,
    ChangePassword,
    Tickers,
  },
  data(self) {
    return {
      sideBarOpened: tryParse(localStorage.sideBarOpened || self.windowSize('xl')),
      loading: true,
      mainStyleHeight: null,
      showScrollButton: false,
      translationsLoaded: false,
    };
  },
  methods: {
    logOut: logOut,
    search() { },
    nodeSelected(event, clicked) {
      if (this.$refs.view) {
        getAllChildren(this.$refs.view)
          .filter(f => f.nodeSelected)
          .forEach(f => f.nodeSelected(event.item, clicked));
      }
    },
    saveToStorage(prop, event) {
      localStorage.setItem(prop, event);
    },
    getMainStyleHaight() {
      if (!this.$refs.main) return null;

      var height = this.$store.getters.state.windowHeight - this.$refs.main.getBoundingClientRect().top;
      return `height: ${height}px;`;
    },
    onScroll(e) {
      this.showScrollButton = (e.target.scrollTop || 0) > 50;
    },
    scrollToTop() {
      $(this.$refs.contScroll).animate({ scrollTop: 0 }, "normal"); // eslint-disable-line
    }
  },
  watch: {
    '$store.getters.state.windowHeight'() {
      this.mainStyleHeight = this.getMainStyleHaight();
    },
  },
  beforeMount() {
    var pushToLogIn = () => this.$router.push('/' + (localStorage.getItem('lastLogIn') || 'login'));
    axios
      .post('/Login/IsLoggedIn')
      .then(reponse => {
        if (!reponse.data) {
          pushToLogIn();
        } else {
          loadSettings.call(this)
            .then(() => {
              var startUpPage = tryParse(this.appSettings.user.startUpPage);
              if ((this.$route.meta.permission && !this.$route.meta.permission()) || (this.$route.name === 'home' && startUpPage)) {
                this.$router.replace(startUpPage || '/');
              }

              getOrganisationTreeData()
                .then(dat => {
                  var id = localStorage.getItem('lastViewNode') ? parseID(localStorage.getItem('lastViewNode')) : this.appSettings.user.organisation;
                  var find = dat.find(f => idsAreEqual(f.item.orgID, id)) || dat.find(f => idsAreEqual(f.item.orgID, this.appSettings.user.organisation)) || dat;

                  this.$store.getters.treeStateClick(find);
                  this.$nextTick(() => this.nodeSelected(find, false));
                  this.$store.getters.state.treeData = dat;
                });

              axios.get('/OrgProdList/GetAllFilterQueries')
                .then(response => {
                  this.$store.getters.state.customReports = response.data
                    .map(f => camelCaseObj({
                      ...f,
                      options: JSON.parse(f.options || 'null'),
                      filterObject: JSON.parse(f.filterObject),
                    })).filter(f => f.filterObject.route);
                  this.loading = false;
                })
            })
        }
      })
      .catch(() => pushToLogIn());

    requestFields.call(this);
    reviewFields.call(this);
  },
  mounted() {
    this.getTranslation('I00.00016210', 'You don\'t have enough permissions. This page is read-only.');
    this.getTranslation('I00.00010100', 'Unsaved data!');
    this.getTranslation('I00.00024410', 'Error');
    this.getTranslation('I00.00053950', 'Unsaved data');
    this.getTranslation('I00.00053960', 'You have unsaved data. Are you sure you want to proceed?');

    //This part of code triggers getTranslations for error messages
    Object.keys(validators).forEach(key => {
      var fnc = validators[key].message || validators[key]().message;
      fnc();
    });

    if (process.env.NODE_ENV === 'development') window['thisAxios'] = axios;
    if (process.env.NODE_ENV === 'development') window['thisMain'] = this;
  },
  translationsLoaded() {
    this.translationsLoaded = true;
  },
  updated() {
    var style = this.getMainStyleHaight();
    if (this.mainStyleHeight !== style)
      this.mainStyleHeight = style;
  }
};
</script>