import { idToString, idsAreEqual } from './common';
import { filterRCodes } from './product';

export const allSubstances = activityItems => activityItems
	.groupBy(f => idToString(f.prodID))
	.mapMany(f => f.items.first().substances);


export const baseProduct = risk => risk.activity.activityItems.length === 1 ?
	risk.activity.activityItems.first() :
	(risk.handlingInstructions.prodID ? risk.activity.activityItems.find(f => idsAreEqual(f.prodID, risk.handlingInstructions.prodID)) : null);


export const getRCodes = risk => filterRCodes(risk.activity.activityItems.mapMany(f => f.productClassificationCode ? f.productClassificationCode.rcodes : []))
	.mapMany(f => f)
	.groupBy(f => f.text + '-' + f.additionalInfo)
	.map(f => f.items.first());

export const getSelectedActivityItems = risk => risk.handlingInstructions.allPictograms ? risk.activity.activityItems : risk.activity.activityItems.filter(f => f.showPictogram);
