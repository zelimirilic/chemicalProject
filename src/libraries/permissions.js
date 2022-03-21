import Vue from 'vue';
import { isBelowOrgId } from './tree';

export const canSee = function () {
	var appSettings = () => this ? this.$store.state.appSettings : Vue.prototype.appSettings;
	return {
		inventory: () => appSettings().mainMenuButtonAdminInventory && appSettings().permissions.inventory.read,
		riskAssessment: () => (appSettings().permissions.riskAssessment.read || appSettings().permissions.signRiskAssessment.read) && appSettings().riskAssessment_v3,
		overview: () => appSettings().mainMenuOverview,
		reportStatutory: () => appSettings().orgProdListMainMenuButtonLaw,
		reportAdr: () => appSettings().orgProdListMainMenuButtonADR,
		reportFire: () => appSettings().orgProdListMainMenuButtonFire,
		substitution: () => appSettings().mainMenuButtonAdminSubstitution && appSettings().permissions.substitution.full,
		exposureScenario: () => appSettings().mainMenuButtonExposureScenarios,
		document: () => appSettings().mainMenuButtonAdminDocuments,
		application: () => appSettings().adaptableInventoryRequest,
		applicationForm: () => appSettings().permissions.settingsAccess.full,
		history: () => appSettings().mainMenuAdminHistory,
		messageCenter: () => appSettings().messageCenter,
		settings: () => appSettings().permissions.settingsAccess.full,
		userAndPermission: () => appSettings().permissions.settings.full && appSettings().permissions.usersAndPermissions.full,
		department: () => appSettings().mainMenuButtonAdminOrganisation && appSettings().permissions.organisation.full,
		productType: () => appSettings().editProductTypeTree && appSettings().permissions.productTypeAdministration.full,
		applicationLanguage: () => appSettings().canChangeApplicationLanguage,
		documentLanguage: () => appSettings().canChangeDocumentLanguage,
		localProducts: () => appSettings().createLocalProduct,
	};
}

export const hasWriteRights = nod => Vue.prototype.appSettings.user.userID.id_mdbID === 10 || (Vue.prototype.appSettings.user.organisationWrite && isBelowOrgId(nod, Vue.prototype.appSettings.user.organisationWrite));
Vue.prototype.hasWriteRights = () => Vue.prototype.sideTree.getSelectedNode() ? hasWriteRights(Vue.prototype.sideTree.getSelectedNode()) : false;

export const canEditPermissions = group => group.userGroupID.id_mdbID !== 10 || (Vue.prototype.appSettings.sharedDatabase && group.customerId == null);

export const startUpPages = () => {
	return [
		{ name: Vue.prototype.getTranslation('I00.00050240', 'Home page'), page: { name: 'home' } },
		{ name: Vue.prototype.getTranslation('I00.00047720', 'Chemical list'), page: { name: 'reportChemical', params: { tab: 'department' } } },
		canSee().overview() ? { name: Vue.prototype.getTranslation('I00.00007700', 'Overview'), page: { name: 'overview' } } : null,
		canSee().overview() ? { name: Vue.prototype.getTranslation('I00.00005660', 'Risk assessment'), page: { name: 'riskList', params: { tab: 'risks' } } } : null,
	].filter(f => f).map(f => ({ ...f, page: JSON.stringify(f.page) }));
}