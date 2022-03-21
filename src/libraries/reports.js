import { tryParse, camelCaseObj, ticker, errorDebug, isNullOrEmpty, hashCode } from "./common";
import { imagesToExcelString } from './exportToExcel';
import Vue from 'vue';
import { getClpOrKifs } from "./product";
import axios from '../axios';
import { logOut } from './vue';

export const getDangerSymbols = (prod) => {
	var k = {
		vattenfallDangerSymbols: [],
		oldLawNotVattenfallDangerSymbols: [],
		newLawDangerSymbols: []
	};
	if (prod.dangerSymbols) {
		prod.dangerSymbols.forEach(function (l) {
			if (l.description.match('^VATTENFALL')) k.vattenfallDangerSymbols.push(l);
			else if (l.description.match('^KIFS')) k.oldLawNotVattenfallDangerSymbols.push(l);
			else k.newLawDangerSymbols.push(l);
		});
	}
	return k;
};

export const parseProducts = (response, allNodes) => {
	var groupedProductsJson = camelCaseObj(JSON.parse(response.data.groupedProductsJson));
	var departmentNodes = response.data.departmentNodes.reduce((acc, f) => {
		acc[f.orgId.id + '_' + f.orgId.id_mdbID] = f;
		return acc;
	}, {});
	groupedProductsJson.forEach(f => {
		f.departmentNodes = departmentNodes[f.orgId];
		f.department = allNodes.find(g => g.item.orgID.id === f.departmentNodes.orgId.id && g.item.orgID.id_mdbID === f.departmentNodes.orgId.id_mdbID);

		f.products.filter(g => g.additionalData).forEach(g => {
			Object.keys(g.additionalData)
				.forEach(key => g.additionalData[key] = tryParse(g.additionalData[key]) || g.additionalData[key]);
		});

		f.products.filter(g => g.appStatus == "").forEach(g => {
			g.appStatus = Vue.prototype.getTranslation('I00.00014800', 'Not Started');
		});
	});
	return camelCaseObj(groupedProductsJson);
}

export const getPictograms = (dats, picts) => {
	var vals = dats.map(val => ['_w', '_d', '_n'].reduce((acc, f) => acc.replace(f, ''), val.value.toLowerCase()));
	return vals
		.map((val, ind) => ({
			obj: dats[ind],
			kod: dats[ind].Value || dats[ind].value,
			pictogram: picts.find(x => x.possibleNames.any(y => y == val)),
		}))
		.filter(f => f.pictogram)
		.map(f => ({
			...f,
			img: f.pictogram.src
		}));
}

var trans = {
	lang: {
		class: 'lang',
		export: prop => item => item.additionalData[prop] ? imagesToExcelString([{
			image: Vue.prototype.appSettings.rootImagesFolder + 'flags/language_' + item.additionalData[prop] + '.png'
		}]) : '-',
	},
	unit: {
		class: 'unit',
		prop: prop => item => (item.additionalData[prop] || []).map(f => `${parseFloat(f.value)}${f.unit}`).join('\n'),
		export: prop => item => (item.additionalData[prop] || []).map(f => parseFloat(f.value)).join('\n'),
	},
	unitUnit: {
		class: 'unit',
		prop: () => () => null,
		export: prop => item => (item.additionalData[prop] || []).map(f => f.unit).join('\n'),
	},
	pictogram: {
		class: 'dangerSymbol',
		prop: () => () => null,
		export: prop => item => {
			var ghss = getPictograms(item.additionalData[prop] || [], Vue.prototype.storeState.ghsPictograms);
			var kifs = getPictograms(item.additionalData[prop] || [], Vue.prototype.storeState.kifPictograms);
			var picts = getClpOrKifs(ghss, kifs).flatMap(f => f)
				.map(f => ({
					image: ('userImages->' + f.pictogram.absolutePath)
				}));
			return imagesToExcelString(picts)
		},
	},
	textProdNo: {
		class: 'prodNo noWrap normal',
	},
	textNoWrap: {
		class: 'wp-100 noWrap normal',
	},
	default: {},
}
Object.keys(trans).forEach(key => {
	trans[key].prop = trans[key].prop || (prop => item => item.additionalData[prop] || '-');
	trans[key].sort = trans[key].sort || trans[key].prop;
	trans[key].export = trans[key].export || trans[key].prop;
});

export const columnsTranslator = (prop) => {
	return trans[prop] || trans.default;
}

export const getProp = (item, name) => {
	return item.name == '' ? name : item;
}

export const parseSelectedColumns = selectedColumns => {
	var ret = [];
	for (var i = 0; i < selectedColumns.length; i++) {
		var col = selectedColumns[i];
		ret.push(col);
		if (col.type === 'unit') {
			ret.push({
				name: "usageAmount",
				columnPhraseId: "I00.00027360",
				columnPhrase: "Usage amount",
				type: 'unitUnit',
				addedManually: true,
			});
		}
	}
	return ret;
}

export const getSds = productId => {
	ticker.removeMessage(Vue.prototype.getTranslation('I00.00020510', 'SDS missing'));
	axios.post('/MainDocument/ShowDocument', { productId: productId.id, productMdbId: productId.id_mdbID, clvid: productId.clvid })
		.then(response => {
			if (response.data.status == 'yes' && !isNullOrEmpty(response.data.content))
				window.open((response.data.content.startsWith('http') ? response.data.content : Vue.prototype.settings.appUrl + response.data.content.replace('../', '')), '_blank')
			else if (response.data.status == 'no' && !isNullOrEmpty(response.data.content)) {
				var urlObj = response.data.content.find(f => f.docLanguage == Vue.prototype.appSettings.applicationLanguage)
					|| response.data.content.find(f => f.docLanguage == 'BA')
					|| response.data.content.first();
				if (urlObj) window.open((urlObj.url.startsWith('http') ? urlObj.url : Vue.prototype.settings.appUrl + urlObj.url.replace('../', '')), '_blank');
			} else
				ticker.addErrorMessage(Vue.prototype.getTranslation('I00.00020510', 'SDS missing'));
		})
		.catch(errorDebug);
}

export const saveReportData = function () {
	var productsForSave = this.cloneData.filter(f => f.hashCode() !== hashCode(f));

	if (productsForSave.any()) {
		var columns = this.parsedSelectedColumns.filter(f => f.ownField);
		var productsDepartmentFields = productsForSave.map(item => ({
			id: { id: item.additionalData.id, id_mdbID: item.additionalData.id_mdbID },
			orgId: { id: item.additionalData.orgID, id_mdbID: item.additionalData.orgID_mdbID },
			fields: columns
				.map(column => ({ fieldId: column.fieldId, fieldName: column.name, fieldProductValue: item.additionalData[(column.ownField ? "ownField_" : "") + column.fieldId] }))
		}));

		this.isSaving = true;
		return axios.post('/LocalProduct/SaveProductDepartmentFieldForChemsoft', { productsDepartmentFields })
			.then(() => {
				this.isSaving = false;
				this.currentData = this.cloneData;
				this.cloneData = null;
			}).catch(error => {
				this.isSaving = false;
				errorDebug(error);
			});
	}
}

export const beforeReportRouteLeave = function (to, from, next) {
	var isChanged = false;
	this.$store.state.saveStatus = false;

	if (!this.$store.state.avoidRouteLeave) {
		if (this.$store.getters.state.deleteReportFlag) {
			next();
			return;
		}

		if (this.$route.query.id) {
			if (to.query.id == from.query.id && to.params !== from.params) {
				next();
				return;
			}

			var options = [];
			this.$store.getters.state.subSearches.forEach((f) => {
				options.push({ name: f.item.name, text: f.text });
			});
			var report = this.$store.getters.state.customReports.find(f => f.id == this.$route.query.id);
			var existingReport = this.$store.getters.state.customReports.find(f => f.id == to.query.id);
			if (existingReport || !to.query.id) this.$store.state.savedNewReportFlag = false;
			var filters = [];
			report.filterObject.filterQuery.forEach((f) => {
				filters.push({ name: f.name, text: f.text });
			});

			isChanged = (hashCode([report.additionalColumns.map(f => ({ id: f.id, name: f.name })), report.hiddenColumns]) !== hashCode([this.selectedColumns.map(f => ({ id: f.id, name: f.name })), this.hiddenColumns])
				|| (hashCode(filters) !== hashCode(options)) || from.params.tab != report.filterObject.route.params.tab) && !this.$store.state.savedNewReportFlag;
		} else
			isChanged = this.selectedColumns.concat(this.hiddenColumns).concat(this.$store.getters.state.subSearches).length && !this.$store.state.savedNewReportFlag;
		if (isChanged) {
			this.$store.state.saveStatus = true;
			this.confirm(this.getTranslation('I00.00053950', 'Unsaved data'), this.getTranslation('I00.00053960', 'You have unsaved data. Are you sure you want to proceed?'))
				.then(() => {
					this.$store.state.saveStatus = false;
					var routeMatch = to.path.indexOf('login') > -1;
					if (routeMatch)
						logOut.call(this);

					next()
				}).catch(errorDebug);
		} else next();
	} else {
		this.$store.state.avoidRouteLeave = false;
		next()
	}
}
