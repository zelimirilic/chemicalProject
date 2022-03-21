import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index.js';
import './libraries/array';
import './libraries/string';
import './libraries/number';
import './libraries/vue';
import url from 'url-parse';
import infiniteScroll from 'vue-infinite-scroll';
import VTooltip from 'v-tooltip';
import CheckBox from './components/common/form/checkBox/CheckBox';
import CheckBoxGroup from './components/common/form/checkBox/CheckBoxGroup';
import Input from './components/common/form/input/Input';
import InputGroup from './components/common/form/input/InputGroup';
import Number from './components/common/form/input/Number';
import Select from './components/common/form/select/Select';
import SelectGroup from './components/common/form/select/SelectGroup';
import TextAreaGroup from './components/common/form/textArea/TextAreaGroup';
import Date from './components/common/form/date/Date';
import DateGroup from './components/common/form/date/DateGroup';
import InformationBox from './components/common/form/informationBox/InformationBox';

import Button from "./components/common/button/button/Button";
import ButtonOk from "./components/common/button/button/ButtonOk";
import ButtonCancel from "./components/common/button/button/ButtonCancel";
import ButtonClose from "./components/common/button/button/ButtonClose";
import ButtonIcon from "./components/common/button/buttonIcon/ButtonIcon";
import ButtonIconSave from "./components/common/button/buttonIcon/ButtonIconSave";
import ButtonIconRestore from "./components/common/button/buttonIcon/ButtonIconRestore";

import SearchDropdown from './components/common/form/searchSelect/SearchDropdown';
import SearchDropdownGroup from './components/common/form/searchSelect/SearchDropdownGroup';


import CardBox from './components/common/cardBox/CardBox';
import HalfBox from './components/common/cardBox/HalfBox';

import ModalDialog from './components/common/modal/ModalDialog';

import DataTable from './components/common/dataTable/DataTable';
import Th from './components/common/dataTable/Th';

import A from './components/common/others/A';

import MainLoader from './components/common/loaders/MainLoader';
import SmallLoader from './components/common/loaders/SmallLoader';

import { ticker } from './libraries/common';


Vue.component('CheckBox', CheckBox);
Vue.component('CheckBoxGroup', CheckBoxGroup);
Vue.component('Input', Input);
Vue.component('InputGroup', InputGroup);
Vue.component('Number', Number);
Vue.component('Select', Select);
Vue.component('SelectGroup', SelectGroup);
Vue.component('TextAreaGroup', TextAreaGroup);
Vue.component('Date', Date);
Vue.component('DateGroup', DateGroup);
Vue.component('InformationBox', InformationBox);

Vue.component('Button', Button);
Vue.component('ButtonOk', ButtonOk);
Vue.component('ButtonCancel', ButtonCancel);
Vue.component('ButtonClose', ButtonClose);
Vue.component('ButtonIcon', ButtonIcon);
Vue.component('ButtonIconSave', ButtonIconSave);
Vue.component('ButtonIconRestore', ButtonIconRestore);

Vue.component('SearchDropdown', SearchDropdown);
Vue.component('SearchDropdownGroup', SearchDropdownGroup);

Vue.component('CardBox', CardBox);
Vue.component('HalfBox', HalfBox);

Vue.component('ModalDialog', ModalDialog);

Vue.component('DataTable', DataTable);
Vue.component('Th', Th);

Vue.component('A', A);

Vue.component('MainLoader', MainLoader);
Vue.component('SmallLoader', SmallLoader);

Vue.use(infiniteScroll);
Vue.use(VTooltip)

Vue.config.productionTip = false;

Vue.prototype.settings = {
	appRoot: new url(process.env.VUE_APP_URL || (location.origin + '/')).origin,
	appUrl: process.env.VUE_APP_URL || (location.origin + '/'),
	appUrlLocal: process.env.VUE_APP_PLAIN_URL,
	baseUrl: process.env.BASE_URL
};

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');

Vue.config.silent = false;

Vue.config.errorHandler = (err, vm, info) => {

	ticker.addErrorMessage("We're sorry to inform you that something went wrong processing your request.");

	function GetAllParentsTags(node) {
		var parentPath = '';
		if (node.$vnode && node.$vnode.tag) {
			parentPath = node.$vnode.tag.split('-')[3] ? GetAllParentsTags(node.$parent) + " -> " + node.$vnode.tag.split('-')[3] : '';
		}
		return parentPath;
	}
	var nodeHierarchy = GetAllParentsTags(vm);

	if (process.env.NODE_ENV !== "production")
		console.error('Vue.config.errorHandler HANDLED FRONTEND ERROR \n error: ', err, '\n\nVue Node Hierarchy: ', "Vue" + nodeHierarchy + '\n\nPage: ' + window.location.href + '\n\n'); // eslint-disable-line

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState != 4) return;
		if (this.status == 200) {
			var data = JSON.parse(this.responseText);
			if (process.env.NODE_ENV !== "production")
				console.error('HANDLED FRONTEND ERROR "' + err.toString() + '" from ' + window.location.href + ' is saved by ID:', data.ID);// eslint-disable-line
			ticker.addErrorMessage("Error ID: " + data.ID);
		}
	};

	xhr.open("POST", (process.env.VUE_APP_URL || (location.origin + '/')) + "Error/FrontVueError?v=" + Math.floor(Math.random() * 100000), true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Cache-Control', 'no-cache,no-store,must-revalidate,max-age=-1,private');
	xhr.setRequestHeader('Authorization', (document.cookie.split(';').map(f => f.trim()).find(f => f.startsWith('ichem')) || '').substring(6));
	xhr.setRequestHeader('chemsoftrequestviaaxios', 'false');
	xhr.withCredentials = true;
	xhr.send(JSON.stringify({
		url: window.location.href,
		vueNode: vm.$vnode.tag.split('-')[3],
		vueNodeHierarchy: "Vue" + nodeHierarchy,
		elementClass: vm ? vm.$el.className : '',
		errorMessage: err.toString(),
		errorStackTrace: err.stack ? err.stack.toString() : '',
		info: info,
		browser: vm.browserName
	}));
};
