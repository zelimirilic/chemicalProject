import Vue from 'vue';
import { submitDataThroughForm } from './forms';
import axios from '../axios';
import { ticker } from '../libraries/common';

export const exportToExcel = (headers, data, departmentName) => {
	return axios.post('/ExportToExcel/ExportToOldExcel', { excel_headers: JSON.stringify(headers), excel_data: JSON.stringify(data), department_name: departmentName })
		.then((response) => {
			submitDataThroughForm("/ExportToExcel/DownloadExcelFile", { fileName: response.data.excelFileGuid });
		});
}
export const exportAllToExcel = (headers, datas, departmentNames, message) => {
	if (window.Ticker) window.Ticker.AddInfoMessage(message);
	else ticker.addInfoMessage(message);

	return axios.post('/ExportToExcel/ExportAllToOldExcelPostedAsText', JSON.stringify(headers) + '|~$|~' + JSON.stringify(datas) + '|~$|~' + JSON.stringify(departmentNames), { 'Content-Type': 'text/plain' }).then(response => {
		submitDataThroughForm('/ExportToExcel/DownloadExcelFile', { fileName: response.data.excelFileGuid });
	});
};
export const genericDangerSymbolsResult = (array, datatable_product) => {
	//array should be array of paramethers with which we extract array of objects we need to get appropriate symbols
	var result = new Array();
	for (var i = 0; i < array.length; i++) {
		var array_of_elements = datatable_product[array[i]];
		if (!Array.isArray(array_of_elements))
			array_of_elements = [array_of_elements];
		for (var j = 0; j < array_of_elements.length; j++) {
			if (!Vue.prototype.appSettings.exportToRealExcel) {
				switch (array[i]) {
					case "oldLawNotVattenfallDangerSymbols":
						result.push(getAppropriateDangerSymbols(array_of_elements[j]));
						break;
					case "newLawDangerSymbols":
						result.push(getAppropriateWarningSymbols(array_of_elements[j]));
						break;
					case "vattenfallDangerSymbols":
						result.push(getAppropriateVattenfallSymbols(array_of_elements[j]));
						break;
				}
			} else {
				result.push({ Image: 'userImages->' + array_of_elements[j].absolutePath });
			}
		}
	}

	return imagesToExcelString(result);
}

function getAppropriateDangerSymbols(danger_symbol) {
	var result = danger_symbol.code != null ? (!danger_symbol.userDefined ? danger_symbol.code.substr(0, danger_symbol.code.indexOf('-') - 1) : danger_symbol.phrase) : "";
	if (result == "/*S only; symbol and risk designation*/V")
		result = "V";

	return result;
}

function getAppropriateVattenfallSymbols(vattenfall_danger_symbol) {
	return !vattenfall_danger_symbol.userDefined ? vattenfall_danger_symbol.code : vattenfall_danger_symbol.phrase;
}

function getAppropriateWarningSymbols(warning_symbol) {
	var value = !warning_symbol.userDefined ? warning_symbol.code + " " : warning_symbol.phrase;
	switch (warning_symbol.imageName) {
		case "acid_red":
			value += "(GHS05)";
			break;
		case "bottle":
			value += "(GHS04)";
			break;
		case "exclam":
			value += "(GHS07)";
			break;
		case "explos":
			value += "(GHS01)";
			break;
		case "flamme":
			value += "(GHS02)";
			break;
		case "skull":
			value += "(GHS06)";
			break;
		case "rondflam":
			value += "(GHS03)";
			break;
		case "silhouete":
			value += "(GHS08)";
			break;
		case "Aquatic-pollut-red":
			value += "(GHS09)";
			break;
	}
	return value;
}

export const imagesToExcelString = (imgs) => imgs.length > 0 ? (Vue.prototype.appSettings.exportToRealExcel ? 'images->' + JSON.stringify(imgs) : imgs.join(", ")) : '';