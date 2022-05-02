import { tryParse, camelCaseObj, ticker, errorDebug, isNullOrEmpty, hashCode } from "./common";
import { imagesToExcelString } from './exportToExcel';
import Vue from 'vue';
import { getClpOrKifs } from "./product";
import axios from '../axios';

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
export const getProductStatusClass = (statusValue) => {
	if (!statusValue)
		return "gray";

	switch (statusValue) {
		case 2:
		case 4:
			return "yellow";
		case 3:
			return "red";
		default:
			return "green";
	}
}
export const getIconLink = (nodeProp) => {
	switch (nodeProp) {
		case 0:
			return "icons/icon-gray.png";
		case 2:
			return "icons/shelf.png";
		case 3:
			return "icons/shelf-stopped.png";
		case 4:
			return "icons/icon-green.png";
		case 5:
			return "icons/icon-stop.png";
		case 6:
			return "icons/shelf-use.png";
		case 7:
			return "icons/shelf-stopped.png";
		case 8:
			return "icons/icon-good.gif";
	}
}
export const getIconClass = (mode) => {
	switch (mode) {
		case 0:
			return "borderOwn";
		case 1:
			return "borderBill";
		case 2:
			return "borderNonBill";
	}
}
export const getIconTitle = (mode) => {
	switch (mode) {
		case 0:
			return "I00.00050300";
		case 1:
			return "I00.00050310";
		case 2:
			return "I00.00050320";
	}
}
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
	});
	return camelCaseObj(groupedProductsJson);

}
export const parseSymbols = (response, allNodes) => {
	var orgProtectionSymbols = camelCaseObj(JSON.parse(response.data.orgProtectionSymbols));
	var departmentNodes = response.data.departmentNodes.reduce((acc, f) => {
		acc[f.orgId.id + '_' + f.orgId.id_mdbID] = f;
		return acc;
	}, {});
	orgProtectionSymbols.forEach(f => {
		f.departmentNodes = departmentNodes[f.orgId];
		f.department = allNodes.find(g => g.item.orgID.id === f.departmentNodes.orgId.id && g.item.orgID.id_mdbID === f.departmentNodes.orgId.id_mdbID);
	});
	return camelCaseObj(orgProtectionSymbols);

}
export const parseCustomFieldTitles = (response) => {
	return {
		customFieldTitle1: response.data.customFieldTitle1,
		customFieldTitle2: response.data.customFieldTitle2,
		customFieldTitle3: response.data.customFieldTitle3,
		customFieldTitle4: response.data.customFieldTitle4,
		customFieldTitle5: response.data.customFieldTitle5,
		customFieldTitle6: response.data.customFieldTitle6,
		customFieldTitle7: response.data.customFieldTitle7,
		customFieldTitle8: response.data.customFieldTitle8,
		customFieldTitle9: response.data.customFieldTitle9,
		customFieldTitle10: response.data.customFieldTitle10
	}
}
export const getPictograms = (dats, picts) => {
	var vals = dats.map(val => ['_w', '_d', '_n'].reduce((acc, f) => acc.replace(f, ''), val.value.toLowerCase()));
	return vals
		.map((val, ind) => ({
			obj: dats[ind],
			kod: dats[ind].value,
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
			image: Vue.prototype.appSettings.imageFolderExcel + 'flags/language_' + item.additionalData[prop] + '.png'
		}]) : null,
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

export const getOrganisationPathValues = function (product) {
	return product['departmentInfo'].departmentPath;
}

export const getOrganisationName = function (product) {
	return product['departmentInfo'].tableName;
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
		window.Ticker.AddInfoMessage((this.getTranslation('I00.00024390', 'Saving...') || 'Saving'))
		this.isSaving = true;
		return axios.post('/LocalProduct/SaveProductDepartmentFieldForChemsoft', { productsDepartmentFields })
			.then(() => {
				this.isSaving = false;
				this.currentData = this.cloneData;
				this.cloneData = null;
				window.Ticker.ClearMessages();
			}).catch(error => {
				this.isSaving = false;
				errorDebug(error);
			});
	}
}
export const beforeReportRouteLeave = function (to, from, next) {
	var isChanged = false;
	if (this.$route.query.id) {
		var report = this.$store.getters.state.customReports.find(f => f.id == this.$route.query.id);
		isChanged = hashCode([report.additionalColumns.map(f => ({ id: f.id, name: f.name })), report.hiddenColumns]) !== hashCode([this.selectedColumns.map(f => ({ id: f.id, name: f.name })), this.hiddenColumns]);
	} else
		isChanged = this.selectedColumns.concat(this.hiddenColumns).length;

	if (isChanged) {
		this.confirm(this.getTranslation('I00.00053950', 'Unsaved data'), this.getTranslation('I00.00053960', 'You have unsaved data. Are you sure you want to proceed?'))
			.then(() => next())
			.catch(errorDebug);
	} else next();
}
