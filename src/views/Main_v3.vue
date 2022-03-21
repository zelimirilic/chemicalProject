<template>
	<div id="MainPage">
		<div class="mainHead HideOnPrint">
			<div class="headerLeft">
				<div class="logoImg"><img :src="settings.appUrl + '~master/new_style_images/iChemistry/logo.png'" alt="" /></div>
				<div id="title"><span class="TitleLarge" title="Inventory" id="MainheadTitleText">Inventory</span></div>
			</div>
			<div class="helpMenu">
				<div class="helpBar menuTop4 cf">
					<div class="firstHov"><span class="home" onclick="ichem.layout.mainhead.service.ReturnToHomePage();">&nbsp;</span></div>
					<div class="secHov"><span class="help" onclick="top.LoadPageInMain('settings.appUrl + 'Help/Help', '');">&nbsp;</span></div>
					<div class="secHov last3"><span class="logout" onclick="ichem.layout.mainhead.service.LogOut();">&nbsp;</span></div>
					<!-- <div class="flagWrap thirdHov"><img class="flag" alt="" src="../~master/new_style_images/flags/language_BA.png" onclick="ChooseLanguage();" /></div> -->
				</div>
			</div>
		</div>
		<div class="mainCont RightCont rightOrientation">
			<div class="MainContWrapper">
				<div id="MainMenuContainer" class="HideOnPrint" style="height: 41px; position: static"></div>
				<div id="MainContDiv" style="margin-top: 40px">
					<div class="overlayWrap">&nbsp;</div>
					<table class="MainTbl">
						<tbody>
							<tr>
								<td class="mainContent">
									<div id="MainContentContainer">
										<Home />
									</div>
								</td>
							</tr>
							<tr class="HideOnPrint removeOnPages">
								<td class="footer">
									<div id="MainContentFooter"><img id="watermark" name="watermark" :src="settings.appUrl + '~master/new_style_images/iChemistry/watermark.png'" alt="" /></div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="mainCont asideCont rightOrientation HideOnPrint"></div>
	</div>
</template>

<script>
import { parseID, tryParse, idsAreEqual, camelCaseObj } from '../libraries/common';
import { getAllChildren, logOut, loadSettings } from '../libraries/vue';
import { getOrganisationTreeData } from '../libraries/tree';
import { validators } from '../libraries/forms';
import axios from '../axios';
import { requestFields, reviewFields } from '../libraries/applicationFormData';
import Home from './Home_v3.vue';

export default {
  components: {
    Home,
  },
  data() {
    return {
      loading: true,
      mainStyleHeight: null,
      showScrollButton: false,
      translationsLoaded: false,
      htmlData: null,
      menuHtml: null,
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
    },
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
            })
            .then(() => axios.get('/OrgProdList/GetAllFilterQueries'))
            .then(response => {
              this.$store.getters.state.customReports = response.data
                .map(f => camelCaseObj({
                  ...f,
                  options: JSON.parse(f.options || 'null'),
                  filterObject: JSON.parse(f.filterObject),
                })).filter(f => f.filterObject.route);
              this.loading = false;
            })
            .then(getOrganisationTreeData()
              .then(dat => {
                var id = localStorage.getItem('lastViewNode') ? parseID(localStorage.getItem('lastViewNode')) : this.appSettings.user.organisation;
                var find = dat.find(f => idsAreEqual(f.item.orgID, id)) || dat.find(f => idsAreEqual(f.item.orgID, this.appSettings.user.organisation)) || dat;

                this.$store.getters.treeStateClick(find);
                this.$nextTick(() => this.nodeSelected(find, false));
                this.$store.getters.state.treeData = dat;
              }));
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

    axios.get('https://localhost/iChemistry/MainMenu/Display')
      .then(response => {
        // eslint-disable-next-line
        $('#MainMenuContainer').html(Array.from($(response.data)).find(f => f.id === 'mainWrap'))
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