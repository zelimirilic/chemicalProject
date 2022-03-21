import Vue from 'vue';
import axios from '../axios';
import { isFunction } from './common_v3';

Vue.prototype.exportToExcel = {
    joinByNewLine: (prop) => (dat) => dat[prop].join('\n'),
};

export const getAllParents = function getAllParents(vm) {
    return vm.$parent ? [vm, ...getAllParents(vm.$parent)] : [vm];
};
export const getAllValidationParents = (vm) => getAllParents(vm.$parent).filter(f => f.$data.$modelValidators && Array.isArray(f.$data.$modelValidators)).filter((_, ind) => ind === 0);

export const getAllChildren = function (vm) {
    function req(vue) {
        var ret = [vue];
        if (vue.$children && vue.$children.length > 0) {
            vue.$children.forEach(function (f) {
                ret.pushMany(req(f));
            });
        }
        return ret;
    }
    return req(vm);
}

export const setAllValidationParents = (vm) => getAllValidationParents(vm).forEach(f => f.$data.$modelValidators.push(vm));
export const removeAllValidationParents = (vm) => getAllValidationParents(vm).forEach(f => f.$data.$modelValidators.remove(vm));

export const propToBool = (prop) => prop === "" || prop;
export const propToFnc = (prop) => isFunction(prop) ? prop : (f => prop ? f[prop] : f);
export const valueToFnc = (value) => isFunction(value) ? value : (() => value);

export const getAllValidationChildren = (el) => {
    return getAllChildren(el)
        .filter(f => !f._inactive && f.checkIsValid);
}

export const checkIsValid = (el) => {
    var formNotValid = false;
    getAllValidationChildren(el)
        .forEach(f => {
            f.checkIsValid();
            if (!f.isValid) formNotValid = true;
        });
    return !formNotValid;
};

export const logOut = function () {
    axios.post('/Login/Logout', { noRedirect: true }).then(() => {
        this.$store.state.appSettings = null;
        this.$store.state.phrases = {};
        this.$store.state.sideTreeState = {};
        this.$store.state.treeData = null;
        this.$store.state.reportsAdditionalColumns = null;
        this.$store.state.allDefinedSymbols = null;
        this.$store.state.ghsPictograms = [];
        this.$store.state.kifPictograms = [];

        this.$router.push(this.$store.getters.getLogInLink());
        this.$store.getters.state.logInLink = null;
    });
};

export const loadSettings = function () {
    return axios.post('/AppSettings/GetSettings', { webRoot: Vue.prototype.settings.appUrlLocal !== null ? Vue.prototype.settings.appUrlLocal : Vue.prototype.settings.appUrl })
        .then(response => {
            var appSettingsData = {
                ...response.data,
                rootImagesFolder: response.data.imageFolder.substring(Vue.prototype.settings.appRoot.length),
                symbolsFolder: response.data.symbolsImageFolder.substring(Vue.prototype.settings.appRoot.length),
            };
            this.$store.state.appSettings = appSettingsData
            Vue.prototype.appSettings = appSettingsData;
            this.$store.state.allSymbols = this.$store.state.appSettings.allSymbols.map(f => ({
                ...f,
                src: f.imageURL
            }));
        });
}