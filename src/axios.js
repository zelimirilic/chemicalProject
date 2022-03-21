import Vue from 'vue';
import axiosLib from 'axios';
import { camelCaseObj } from './libraries/common';
import { ticker } from './libraries/common';

const instance = axiosLib.create({
	baseURL: process.env.VUE_APP_URL || (location.origin + '/'),
});

const defaultOptions = () => {
	var nod = Vue.prototype.sideTree ? Vue.prototype.sideTree.getSelectedDepartment() : null;
	return {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': (document.cookie.split(';').map(f => f.trim()).find(f => f.startsWith('ichem')) || '').substring(6),
			'Cache-Control': 'no-cache,no-store,must-revalidate,max-age=-1,private',
			'LastViewNode': nod ? JSON.stringify({ orgID: nod.orgID, nodePath: nod.nodePath }) : '',
			'chemsoftrequestviaaxios': window.ThisIsChemsoft ? true : false
		},
		withCredentials: true,
	}
};

export const setToken = token => {
	axiosLib.defaults.headers.common['authorization'] = 'Bearer ' + token;
}

var cancelTokens = [];

const axios = {
	self: () => axios.call(this),
	get: (url, options) => instance.get(url + `${url.indexOf('?') >= 0 ? '&' : '?'}_=${Math.random()}`, { ...defaultOptions(), ...(options || {}) })
		.then(response => new Promise(resolve => resolve({ ...response, data: camelCaseObj(response.data) })))
		.catch(error => {
			if (axios.isCoookieValid(error))
				axios.processError(error);
		}),
	post: (url, data, options) => {
		return instance.post(url, data, { ...defaultOptions(), ...(options || {}), })
			.then(response => new Promise(resolve => resolve({ ...response, data: camelCaseObj(response.data) })))
			.catch(error => {
				if (axios.isCoookieValid(error))
					axios.processError(error);
			})
	},
	postWithCancelToken: (url, data, options) => {
		var token = axiosLib.CancelToken.source();
		cancelTokens.push(token);
		return instance.post(url, data, { ...defaultOptions(), ...(options || {}), cancelToken: token.token })
			.then(response => new Promise(resolve => resolve({ ...response, data: camelCaseObj(response.data) })))
			.catch(error => {
				if (axios.isCoookieValid(error))
					axios.processError(error);
			})
	},
	cancelToken: () => axiosLib.CancelToken.source(),
	isCoookieValid: (error) => {
		if ((error.response || {}).status == 401 || document.cookie.indexOf('ichem') == -1) {
			ticker.addErrorMessage("Your session cookie is invalid. Please close your browser and try again.");
			if (self.thisVue.$route.path.indexOf('/login') == -1)
				setTimeout(() => { self.thisVue.$router.push('/' + (localStorage.getItem('lastLogIn') || 'login')); return false; }, 5000)
		}
		return true;
	},
	processError: (error) => {
		if ((((error || {}).response || {}).data || {}).stackTrace && (((error || {}).response || {}).data || {}).debbugMessage) {
			var consoleMessageText = error.response.data.debbugMessage;
			var stackTraceText = "\n\nSTACK TRACE:\n" + error.response.data.stackTrace;
			// eslint-disable-next-line no-console
			console.error("\n!!! axios:: BACKEND ERROR while getting data from URL:", error.response.config.url, "[method:" + error.response.config.method + "]\nEXCEPTION TYPE:" + error.response.data.exceptionType + "\nMESSAGE:\n", consoleMessageText, stackTraceText, "\n\n\n");
		}
		throw (error);
	},
	cancelAll: () => {
		cancelTokens.forEach(token => { if (token) token.cancel(); });
		cancelTokens = [];
		return axios;
	}
};

export default axios;