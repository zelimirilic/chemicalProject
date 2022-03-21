import Vue from 'vue';
import path from 'path';
import './libraries/vue';
import './store/index';
import infiniteScroll from 'vue-infinite-scroll';
//import VTooltip from 'v-tooltip';
import { validators } from './libraries/forms';
import { parseID, idsAreEqual } from './libraries/common';
import url from 'url-parse';
import axios from './axios';
import { getOrganisationTreeData } from './libraries/tree_v3';
import { requestFields, reviewFields } from './libraries/applicationFormData';

Vue.use(infiniteScroll);
//Vue.use(VTooltip);
const requireView = require.context('../src/views', true, /[\w-.]+_v3.vue$/);
const requireComponent = require.context('../src/components', true, /[\w-.]+_v3.vue$/);

const ignoredComponents = [];

[requireComponent, requireView].forEach(req => {
	req.keys()
		.forEach((fileName) => {
			const baseName = path.basename(fileName, '.vue');
			if (ignoredComponents.indexOf(baseName) > -1) {
				return;
			}

			let component = req(fileName);
			component = component.default || component;
			const componentName = component.name || `${baseName.substring(0, baseName.length - 3)}`;
			Vue.component('cs' + componentName, component);
		});
});

Vue.prototype.validators = validators;
Vue.prototype.$store = { state: Vue.prototype.storeState, getters: Vue.prototype.storeGetters };
Vue.prototype.requestFields = requestFields;
Vue.prototype.reviewFields = reviewFields;

Vue.prototype.settings = {
	appRoot: new url(process.env.VUE_APP_URL || (location.origin + '/')).origin,
	appUrl: process.env.VUE_APP_URL || (location.origin + '/'),
	appUrlLocal: process.env.VUE_APP_PLAIN_URL,
	baseUrl: process.env.BASE_URL,
};

Vue.prototype.cs = {
	vue: require('./libraries/vue.js'),
	form: require('./libraries/forms.js'),
	common: require('./libraries/common.js'),
	index: require('./store/index.js'),
};

Vue.prototype.axios = axios;



axios.post('/AppSettings/GetSettings', { webRoot: Vue.prototype.settings.appUrlLocal !== null ? Vue.prototype.settings.appUrlLocal : Vue.prototype.settings.appUrl })
	.then(response => {
		var appSettingsData = {
			...response.data,
			rootImagesFolder: response.data.imageFolder.substring(Vue.prototype.settings.appRoot.length),
			symbolsFolder: response.data.symbolsImageFolder.substring(Vue.prototype.settings.appRoot.length),
		};
		Vue.prototype.$store.state.appSettings = appSettingsData;
		Vue.prototype.appSettings = appSettingsData;
		Vue.prototype.$store.state.allSymbols = Vue.prototype.$store.state.appSettings.allSymbols.map(f => ({
			...f,
			src: f.imageURL
		}));
		getOrganisationTreeData()
			.then(dat => {
				var id = localStorage.getItem('lastViewNode') ? parseID(localStorage.getItem('lastViewNode')) : Vue.prototype.appSettings.user.organisation;
				var find = dat.find(f => idsAreEqual(f.item.orgID, id)) || dat.find(f => idsAreEqual(f.item.orgID, Vue.prototype.appSettings.user.organisation)) || dat;

				Vue.prototype.$store.getters.treeStateClick(find);
				//this.$nextTick(() => this.nodeSelected(find, false));
				Vue.prototype.$store.getters.state.treeData = dat;
			});

		Vue.prototype.sideTree = {
			getAllData: () => Vue.prototype.$store.getters.state.treeData,
			getSelectedDepartment: () => Vue.prototype.$store.getters.selectedNode ? Vue.prototype.$store.getters.selectedNode.item : null,
			getSelectedNode: () => Vue.prototype.$store.getters.selectedNode,
		};
	});

Vue.prototype.confirm = function (title, message) {
	var args = arguments;
	Vue.prototype.$store.state.modalConfirm.show = true;
	Vue.prototype.$store.state.modalConfirm.title = title;
	Vue.prototype.$store.state.modalConfirm.message = message;
	return new Promise((resolve, reject) => {
		Vue.prototype.$store.state.modalConfirm.resolve = () => {
			Vue.prototype.$store.state.modalConfirm.show = false;
			resolve(args[2]);
		};
		Vue.prototype.$store.state.modalConfirm.reject = () => {
			Vue.prototype.$store.state.modalConfirm.show = false;
			reject(false);
		};
	});
};

//This part of code triggers getTranslations for error messages
Object.keys(validators).forEach(key => {
	var fnc = validators[key].message || validators[key]().message;
	fnc();
});




