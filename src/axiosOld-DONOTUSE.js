import Vue from 'vue';
import axios from 'axios';
import { ticker } from './libraries/common';
const instance = axios.create({
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
	axios.defaults.headers.common['authorization'] = 'Bearer ' + token;
}

var cancelTokens = [];

const axiosObj = {
	self: () => axiosObj.call(this),
	get: (url, options) => instance.get(url, { ...defaultOptions(), ...(options || {}) }).catch(error => {
		if (axiosObj.isCoookieValid(error))
			axiosObj.processError(error);
	}),
	post: (url, data, options) => {
		return instance.post(url, data, {
			...defaultOptions(), ...(options || {})
		}).catch(error => {
			if (axiosObj.isCoookieValid(error))
				axiosObj.processError(error);
		});
	},
	postWithCancelToken: (url, data, options) => {
		var token = axios.CancelToken.source();
		cancelTokens.push(token);
		return instance.post(url, data, {
			...defaultOptions(), ...(options || {}), cancelToken: token.token
		}).catch(error => {
			if (axiosObj.isCoookieValid(error))
				axiosObj.processError(error);
		});
	},
	cancelToken: () => axios.CancelToken.source(),
	isCoookieValid: (error) => {
		if ((error.response || {}).status == 401 || document.cookie.indexOf('ichem') == -1) {
			ticker.addErrorMessage("Your session cookie is invalid. Please close your browser and try again.");
			if (self.thisVue.$route.path.indexOf('/login') == -1)
				setTimeout(() => self.thisVue.$router.push('/' + (localStorage.getItem('lastLogIn') || 'login')), 5000);
			return false;
		}
		return true;
	},
	cancelAll: () => {
		cancelTokens.forEach(token => { if (token) token.cancel(); });
		cancelTokens = [];
		return axiosObj;
	},
	processError: (error) => {
		if ((((error || {}).response || {}).data || {}).stackTrace && (((error || {}).response || {}).data || {}).debbugMessage) {
			var consoleMessageText = error.response.data.debbugMessage;
			var stackTraceText = "\n\nSTACK TRACE:\n" + error.response.data.stackTrace;
			// eslint-disable-next-line no-console
			console.error("\n!!! axiosOld-DONOTUSE:: BACKEND ERROR while getting data from URL:", error.response.config.url, "[method:" + error.response.config.method + "]\nEXCEPTION TYPE:" + error.response.data.exceptionType + "\nMESSAGE:\n", consoleMessageText, stackTraceText, "\n\n\n");
		}
		throw (error);
	}
};

if (process.env.NODE_ENV === 'development') window['thisAxios'] = axiosObj;
export default axiosObj;
