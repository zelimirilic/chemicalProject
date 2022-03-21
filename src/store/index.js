import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../axios';
import { triggerService, toKeyValue, idToString, startPhraseObject } from '../libraries/common';
import '../libraries/string';
import { defineState } from '../libraries/tree';

Vue.use(Vuex);

const trig = new triggerService(5);
const sizeObj = {
	xl: 1200,
	lg: 992,
	md: 768,
	sm: 576,
	xs: 0,
}
var translationComponents = [];

const store = new Vuex.Store({
	state: {
		phrases: startPhraseObject(),
		pagePhrases: {},
		logInLink: null,
		windowWidth: window.innerWidth,
		windowHeight: window.innerHeight,
		sideTreeState: {},
		treeData: null,
		customReports: [],
		subSearches: [],
		filledSubSearches: [],
		reportsAdditionalColumns: null,
		allDefinedSymbols: null,
		allSymbols: null,
		ghsPictograms: [],
		kifPictograms: [],
		modalConfirm: {
			show: false,
			title: null,
			message: null,
		},
		appSettings: null,
		tickers: [],
		alerts: [],
		hasMenu: false,
		mainLoaderVisible: false,
		saveStatus: false,
		modalTreeFlag: false,
		savedNewReportFlag: false,
		deleteReportFlag: false,
		avoidRouteLeave: false
	},
	getters: {
		state: (state) => state,
		get: (state) => (prop) => state[prop],
		set: (state) => (prop, value) => state[prop] = value,
		phrasesAreLoading: () => trig.isProcessing,
		getTranslation: (state) => type => function (phraseId) {
			var id = type + '.' + phraseId;
			if (this.$vnode && this.$options && this.$options['translationsLoaded'] && translationComponents.indexOf(this) === -1) {
				if (!translationComponents.find(f => f.$vnode.componentInstance === this.$vnode.componentInstance)) {
					translationComponents.push(this);

					this.$once("hook:mounted", () => {
						if (!trig.isProcessing()) {
							if (!this.$options.$translationsLoaded) {
								this.$options.$translationsLoaded = true;
								this.$options['translationsLoaded'].call(this);
								this.$emit('translationsLoaded');
							}
							translationComponents.remove(this);
						}
					});
				}
			}

			if (this && this.$options && this.$parent) {
				let path = getFullPath(this);
				state.pagePhrases[path] = state.pagePhrases[path] || {};
				state.pagePhrases[path][id] = true;
			}

			if (state.phrases[id] !== undefined)
				return state.phrases[id];
			else {
				if (!trig.hasOnFinishFnc()) {
					trig.onFinishFnc(() => {
						var ids = Object.keys(state.phrases).filter(id => state.phrases[id] == null);
						var usedComponents = translationComponents;
						translationComponents = [];
						if (ids.length) {
							axios.post("/Phrases/GetPhrases", {
								ids: ids
							}).then(response => {
								state.phrases = {
									...state.phrases,
									...(response || {}).data,
								};
								usedComponents.forEach(f => {
									if (!f.$options.$translationsLoaded) {
										f.$options.$translationsLoaded = true;
										f.$options['translationsLoaded'].call(f);
										f.$emit('translationsLoaded');
									}
								});

								if ((process.env.NODE_ENV !== 'development'))
									localStorage.setItem('phrases', JSON.stringify(Object.keys(state.phrases)));
							});
						}
					});
				}

				trig.push(() => state.phrases[id] = null);
			}
		},
		getWebTranslationOrValue: () => function (phraseId) {
			var phraseRegex = new RegExp('^[A-Z]?\\d{2}.?\\d{8}$');
			return phraseRegex.test(phraseId) ? this.getTranslation(phraseId) : phraseId;
		},
		getTranslationByComponents: (state) => function () {
			var phrs = toKeyValue(state.pagePhrases);
			phrs.forEach(f => Object.keys(f.value).forEach(key => f.value[key] = this.getTranslation(key)));
			return phrs.mapMany(f => Object.keys(f.value).map(g => f.name + '\t' + g + '\t"' + f.value[g] + '"'));
		},
		getLogInLink: (state) => () => {
			return '/' + (state.logInLink || localStorage.getItem('lastLogIn') || 'login');
		},
		windowSize: (state) => (sizeMarkup) => state.windowWidth >= sizeObj[sizeMarkup],
		currentWindowSize: (state) => () => Object.keys(sizeObj).find(key => state.windowWidth >= sizeObj[key]),
		treeStateOpen: (state) => (item, open) => {
			item.getParents().forEach(f => defineState(state.sideTreeState, f.item, 'opened', true));
			defineState(state.sideTreeState, item.item, 'opened', open);
		},
		treeStateClick: (state) => (item) => {
			state.sideTreeState = {};
			[item, ...item.getParents()].forEach(f => defineState(state.sideTreeState, f.item, 'opened', true));
			defineState(state.sideTreeState, item.item, 'clicked', true);
			localStorage.setItem('lastViewNode', idToString(item.item.orgID));
		},
		treeStateStarred: (state) => (item, val) => {
			defineState(state.sideTreeState, item.item, 'starred', val);
		},
		selectedNode: (state) => {
			if (!state.treeData) return null;

			for (var key in state.sideTreeState) {
				if (state.sideTreeState[key].clicked) {
					return state.treeData.find(f => f.item.id == key);
				}
			}
		},
	},
});

const getFullPath = function getFullPath(it) {
	if (it.$parent.$options._componentTag == null) {
		return it.$options._componentTag;
	} else {
		return getFullPath(it.$parent) + '/' + (it.$options._componentTag || it.$vnode.tag.split('-').last());
	}
}

window.addEventListener('resize', () => {
	store.state.windowHeight = window.innerHeight;
	store.state.windowWidth = window.innerWidth;
});

Vue.prototype.getTranslation = store.getters.getTranslation('web');
Vue.prototype.getSystemTranslation = store.getters.getTranslation('sys');
Vue.prototype.getWebTranslationOrValue = store.getters.getWebTranslationOrValue;
Vue.prototype.windowSize = store.getters.windowSize;
Vue.prototype.sideTree = {
	getAllData: () => store.state.treeData,
	getSelectedDepartment: () => store.getters.selectedNode ? store.getters.selectedNode.item : null,
	getSelectedNode: () => store.getters.selectedNode,
};

Vue.prototype.storeState = store.state;
Vue.prototype.storeGetters = store.getters;

Vue.prototype.confirm = function (title, message) {
	var args = arguments;
	store.state.modalConfirm.show = true;
	store.state.modalConfirm.title = title;
	store.state.modalConfirm.message = message;
	return new Promise((resolve, reject) => {
		store.state.modalConfirm.resolve = () => {
			store.state.modalConfirm.show = false;
			resolve(args[2]);
		};
		store.state.modalConfirm.reject = () => {
			store.state.modalConfirm.show = false;
			reject(false);
		};
	});
};
Vue.prototype.console = console;

export default store;
