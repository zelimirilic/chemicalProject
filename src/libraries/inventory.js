import Vue from 'vue';
import { validators } from "./forms";

var getConsumption = (consumption, prop) => ({
	[prop + 'IsSet']: consumption.isSet,
	[prop]: consumption.value,
	[prop + 'UnitID']: consumption.unit.id.id,
	[prop + 'UnitID_mdbID']: consumption.unit.id.id_mdbID,
	[prop + 'Unit']: consumption.unit.id.id + ':' + consumption.unit.id.id_mdbID,
});

export const convertProductForSave = (product) => ({
	productID: product.id.id,
	productID_mdbID: product.id.id_mdbID,
	variantID: product.id.clvid,
	artNo: product.artNo,
	artName: product.name,
	...getConsumption(product.usage, 'usage'),
	...getConsumption(product.storage, 'storage'),
	startDate: product.startDate,
	endDate: product.endDate,
	isChanged: true,
	isNew: true,
	deletedActive: false,
	supplierName: product.supplierName,
	productTypes: product.productTypes,
	nodeProperty: 1,
	isCustomerProduct: product.isCustomerProduct,
	guid: product.productGuid,
});

export const convertProductForDelete = (product, endDate, year, org_path_for_save) => ({
	ProductId: product.productID,
	ProductId_mdbId: product.productID_mdbID,
	VariantId: product.variantID,
	StartDate: product.startDate,
	EndDate: endDate,
	Year: year,
	PreviousNodeProperty: product.previousNodeProperty,
	ItemID: product.itemID,
	productTypes: product.productTypes,
	OrgPathForSave: org_path_for_save,
	UsageIsSet: product.usageIsSet,
	Usage: product.usage,
	UsageUnitID: product.usageUnitID,
	UsageUnitID_mdbID: product.usageUnitID_mdbID,
	UsageUnit: product.usageIsSet ? product.usageUnitID + ':' + product.usageUnitID_mdbID : null,
	StorageIsSet: product.storageIsSet,
	Storage: product.storage,
	StorageUnitID: product.storageUnitID,
	StorageUnitID_mdbID: product.storageUnitID_mdbID,
	StorageUnit: product.storageIsSet ? product.storageUnitID + ':' + product.storageUnitID_mdbID : null,
	IsChanged: true,
});


export const inventoryValidators = {
	isSet: (selectedProduct) => ({
		fnc: () => selectedProduct.storage.isSet || selectedProduct.usage.isSet,
		message: () => Vue.prototype.getTranslation('I00.00010050', 'You must check at least one checkbox.'),
	}),
	isNumber: (selectedProduct) => ({
		fnc: () => validators.isNumber.fnc(selectedProduct.usage.value) && validators.isNumber.fnc(selectedProduct.storage.value),
		message: () => validators.isNumber.message(),
	}),
}