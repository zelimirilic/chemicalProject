import Vue from 'vue';
import App from './App_v3.vue';
import router from './router';
import store from './store/index.js';
import './libraries/array';
import './libraries/string';
import './libraries/number';
import './libraries/vue';
import url from 'url-parse';
import infiniteScroll from 'vue-infinite-scroll';

// import CheckBox from './components/common/form/checkBox/CheckBox';
// import CheckBoxGroup from './components/common/form/checkBox/CheckBoxGroup';
// import Input from './components/common/form/input/Input_v3';
// import InputGroup from './components/common/form/input/InputGroup_v3';
// import Number from './components/common/form/input/Number';
// import Select from './components/common/form/select/Select_v3';
// import SelectGroup from './components/common/form/select/SelectGroup_v3';
// import TextAreaGroup from './components/common/form/textArea/TextAreaGroup';
// import Date from './components/common/form/date/Date';
// import DateGroup from './components/common/form/date/DateGroup';

// import Button from "./components/common/button/button/Button";
// import ButtonOk from "./components/common/button/button/ButtonOk";
// import ButtonCancel from "./components/common/button/button/ButtonCancel";
// import ButtonIcon from "./components/common/button/buttonIcon/ButtonIcon";
// import ButtonIconSave from "./components/common/button/buttonIcon/ButtonIconSave";
// import ButtonIconRestore from "./components/common/button/buttonIcon/ButtonIconRestore";

// import SearchDropdown from './components/common/form/searchSelect/SearchDropdown';
// import SearchDropdownGroup from './components/common/form/searchSelect/SearchDropdownGroup';


// import CardBox from './components/common/cardBox/CardBox';
// import HalfBox from './components/common/cardBox/HalfBox';

// import ModalDialog from './components/common/modal/ModalDialog';

// import DataTable from './components/common/dataTable/DataTable_v3';
// import Th from './components/common/dataTable/Th_v3';

// import A from './components/common/others/A';

// import MainLoader from './components/common/loaders/MainLoader';
// import SmallLoader from './components/common/loaders/SmallLoader';

// Vue.component('CheckBox', CheckBox);
// Vue.component('CheckBoxGroup', CheckBoxGroup);
// Vue.component('Input', Input);
// Vue.component('InputGroup', InputGroup);
// Vue.component('Number', Number);
// Vue.component('Select', Select);
// Vue.component('SelectGroup', SelectGroup);
// Vue.component('TextAreaGroup', TextAreaGroup);
// Vue.component('Date', Date);
// Vue.component('DateGroup', DateGroup);

// Vue.component('Button', Button);
// Vue.component('ButtonOk', ButtonOk);
// Vue.component('ButtonCancel', ButtonCancel);
// Vue.component('ButtonIcon', ButtonIcon);
// Vue.component('ButtonIconSave', ButtonIconSave);
// Vue.component('ButtonIconRestore', ButtonIconRestore);

// Vue.component('SearchDropdown', SearchDropdown);
// Vue.component('SearchDropdownGroup', SearchDropdownGroup);

// Vue.component('CardBox', CardBox);
// Vue.component('HalfBox', HalfBox);

// Vue.component('ModalDialog', ModalDialog);

// Vue.component('DataTable', DataTable);
// Vue.component('Th', Th);

// Vue.component('A', A);

// Vue.component('MainLoader', MainLoader);
// Vue.component('SmallLoader', SmallLoader);

Vue.use(infiniteScroll);

Vue.config.productionTip = false;

Vue.prototype.settings = {
	appRoot: new url(process.env.VUE_APP_URL || (location.origin + '/')).origin,
	appUrl: process.env.VUE_APP_URL || (location.origin + '/'),
	baseUrl: process.env.BASE_URL,
};

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
