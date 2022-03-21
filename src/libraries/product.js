import Vue from 'vue';

export const translatedCodes = codes => codes
	.map(f => {
		if (!f.additionalInfo) return Vue.prototype.getSystemTranslation(f.text, 'Precautionary statements translation');
		return (Vue.prototype.getSystemTranslation(f.additionalInfo) || '').split('|')
			.reduce((acc, f) => acc.replace('.?', f), Vue.prototype.getSystemTranslation(f.text, 'Precautionary statements translation') || '');
	}).sort();

export const getClpOrKifs = (ghss, kifs) => {
	if (Vue.prototype.appSettings.dangerSymbolPreference === 'ONLY_CLP_OR_KIFS')
		return ghss.any() ? [ghss] : [kifs];
	else if (Vue.prototype.appSettings.dangerSymbolPreference === 'ONLY_KIFS_OR_CLP')
		return kifs.any() ? [kifs] : [ghss];
	else
		return [kifs, ghss];
};

export const filterDangerSymbols = (items) => {
	var ghss = items.filter(f => f.codeID.code.toLowerCase().startsWith('ghs') || f.codeID.code_mdbID !== 10);
	var kifs = items.filter(f => ghss.indexOf(f) === -1);

	return getClpOrKifs(ghss, kifs);
};
export const filterDangerClasses = (items) => {
	var ghss = items.filter(f => f.codeID.code.toLowerCase().startsWith('clp'));
	var kifs = items.filter(f => ghss.indexOf(f) === -1);

	return getClpOrKifs(ghss, kifs);
};
export const filterRCodes = (items) => {
	var ghss = items.filter(f => f.codeID.code.toLowerCase().startsWith('h') || f.codeID.code.toLowerCase().startsWith('euh'));
	var kifs = items.filter(f => ghss.indexOf(f) === -1);

	return getClpOrKifs(ghss, kifs);
};
export const filterSCodes = (items) => {
	var ghss = items.filter(f => f.codeID.code.toLowerCase().startsWith('p'));
	var kifs = items.filter(f => ghss.indexOf(f) === -1);

	return getClpOrKifs(ghss, kifs);
};

export const isLocalProduct = product => product.id.id_mdbID != 10;

export const getUfiCode = product => ((product.msdsSection1 || []).find(f => f.keyID == 742) || null);

export const getPictogram = (symbol) => {
	var allSymbols = Vue.prototype.appSettings.allSymbols;
	if (typeof symbol === 'string') {
		return ((allSymbols.find(x => x.possibleNames.any(y => y == symbol)) || {}).src || (allSymbols.find(x => x.possibleNames.any(y => y == symbol)) || {}).imageURL);
	}

	return symbol.imageURL;
};

export const getPictogramTitle = (symbol) => {
	if (typeof symbol === 'string')
		return symbol;

	return symbol.userDefined ? symbol.phrase : (((symbol.description || "").match('^CLP') || []).any() ? symbol.phrase : (symbol.codeID || {}).code)
};