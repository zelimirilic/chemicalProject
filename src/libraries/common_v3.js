import Vue from 'vue';
import moment from 'moment';

export const isFunction = value => typeof value === "function";
export const isObject = value => value !== null && typeof value === 'object';
export const isDate = value => value instanceof Date || value instanceof moment;
export const isString = value => typeof value === 'string' || value instanceof String;

export const errorDebug = (error) => {
    if (error !== false && error.toString() !== 'Cancel') {
        var data = tryParse((error.response || {}).data) || (error.response || {}).data || error.message;
        ticker.addErrorMessage(data.message || data || Vue.prototype.getTranslation('I00.00024410', 'Error'));
        if (process.env.NODE_ENV !== "production") console.error(error); // eslint-disable-line
    }
}

var addTickerMessage = type => message => {
    Vue.prototype.storeState.tickers = Vue.prototype.storeState.tickers.filter(f => !(f.type === type && f.text === message));
    var tick = { type: type, text: message };
    Vue.prototype.storeState.tickers.push(tick);
    return () => Vue.prototype.storeState.tickers.remove(tick);
}
const tickerFncs = {
    addErrorMessage: addTickerMessage('danger'),
    addWarningMessage: addTickerMessage('warning'),
    addInfoMessage: addTickerMessage('info'),
    addSuccessMessage: addTickerMessage('success'),
    removeMessage: message => Vue.prototype.storeState.tickers = Vue.prototype.storeState.tickers.filter(f => f.text !== message),
    clearMessages: () => {
        Vue.prototype.storeState.tickers = [];
    }
}

export const ticker = tickerFncs;

export const triggerService = function (milliseconds) {
    var date = null;
    var startCountdown = function () {
        date = new Date(Date.now() + milliseconds);
        var rec = function () {
            if (date != null) {
                if (date < new Date()) {
                    date = null;
                    fncs.forEach(function (fnc) { fnc(); });
                    fncs = [];
                    if (finishFnc) {
                        finishFnc();
                        finishFnc = null;
                    }
                } else {
                    setTimeout(rec, 0);
                }
            }
        }
        rec();
    }
    var fncs = [];
    this.clear = () => {
        date = null;
        fncs = [];
        return this;
    }
    this.push = (fnc) => {
        fncs.push(fnc);
        startCountdown();
        return this;
    }
    var finishFnc = null;
    this.onFinishFnc = (fnc) => {
        finishFnc = fnc;
        return this;
    }
    this.hasOnFinishFnc = () => finishFnc != null;
    this.isProcessing = () => fncs.length > 0;
    this.pause = () => date = new Date(Date.now() + 100000000000);

    this.resetTimer = startCountdown;
}

export const toKeyValue = function (obj) {
    return Object.keys(obj).reduce((acc, key) => { acc.push({ name: key, value: obj[key] }); return acc; }, []);
};
export const hashCode = (obj) => {
    var str = JSON.stringify(obj).replaceAll('":""', '":null');
    var hash = 0;
    if (str.length == 0) return hash;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
export const parseID = (idstr) => {
    var spl = idstr.split(':');
    return spl.length > 2 ? { id: parseInt(spl.first()), id_mdbID: parseInt(spl[1]), clvid: parseInt(spl[2]) } : { id: parseInt(spl.first()), id_mdbID: parseInt(spl[1]) };
}

export const idToString = (id) => {
    var keys = Object.keys(id);
    var idKey = keys.find(f => f.toLowerCase().endsWith('id'));
    var idMdbidKey = keys.find(f => f.toLowerCase().endsWith('id_mdbid'));
    var clvidKey = keys.find(f => f.toLowerCase().endsWith('clvid'));
    return [id[idKey], id[idMdbidKey], id[clvidKey]].filter(f => !isNullOrEmpty(f)).join(':');
}
export const idToSlashedString = (id) => idToString(id).replaceAll(':', '_');

export const idsAreEqual = (id1, id2) => (id1.ID || id1.id) === (id2.ID || id2.id) && (id1.ID_mdbID || id1.id_mdbID) === (id2.ID_mdbID || id2.id_mdbID) && (id1.CLVID || id1.clvid || 0) === (id2.CLVID || id2.clvid || 0);

export const isNullOrEmpty = function (str) {
    return (str == null || !str.toString().trim())
}

export const getAllChildrens = function getAllChildrens(element) {
    var arr = Array.from(element.children || []);
    arr.pushMany(arr.filter(f => f.children && f.children.length).mapMany(f => getAllChildrens(f)));
    return arr;
}

export const isBetween = (num, num1, num2) => {
    var isBetween = (num, num1, num2) => num >= num1 && num <= num2;
    return isBetween(num, num1, num2) || isBetween(num, num2, num1);
}

export const deepClone = (obj) => jQuery.extend(true, Array.isArray(obj) ? [] : {}, obj); // eslint-disable-line

export const tryParse = obj => {
    try {
        return JSON.parse(obj);
    } catch (e) {
        return null;
    }
}

export const tryParseArray = obj => {
    var val = tryParse(obj);
    return val && Array.isArray(val) ? val : null;
}


var txtElement = document.createElement("textarea");
export const decodeHtml = html => {
    txtElement.innerHTML = html;
    return txtElement.value;
};

export const camelCaseObj = obj => {
    if (Array.isArray(obj)) {
        return obj.map(f => camelCaseObj(f));
    } else if (isDate(obj)) {
        return obj;
    } else if (isObject(obj)) {
        return Object.keys(obj).reduce((acc, key) => {
            acc[key.camelCase()] = (obj[key] && isObject(obj[key])) ? camelCaseObj(obj[key]) : obj[key];
            return acc;
        }, {});
    } else return obj;
}

export const randomChars = (len) => Math.random().toString(36).substring(len - 1);

export const getAllParentNodes = el => el.parentNode ? [el.parentNode, ...getAllParentNodes(el.parentNode)] : [];

export const getFnc = prop => new Function('data', `try { return data.${prop}; } catch(e) { return undefined; };`);
export const setFnc = function (prop) {
    var spl = prop.split('.');
    var head = spl.head().join('.');
    return new Function('data, value', `this.$set(data${head ? '.' + head : ''}, '${spl.last()}', value);`).bind(this);
};

export const copyObjectProps = (obj, props) => props.reduce((acc, key) => { acc[key] = obj[key]; return acc; }, {});

export const isLocalID = id => id.id_mdbID != 10;

export const startPhraseObject = () => (process.env.NODE_ENV === 'development') ? {} : (tryParse(localStorage.getItem('phrases')) || []).reduce((acc, f) => { acc[f] = undefined; return acc; }, {});

export const perPageItems = () => [...[5, 10, 15, 20].map(f => ({ value: f, name: f })), { value: 1000000, name: Vue.prototype.getTranslation('I00.00012130', 'All') }];

export const getBrowser = () => {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/)
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
};
