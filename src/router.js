import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Settings from './views/settings/settings/Settings';
import Users from './views/settings/users/Users';
import User from './views/settings/users/User';
import Permissions from './views/settings/permissions/Permissions';
import Permission from './views/settings/permissions/Permission';
import Departments from './views/settings/departments/Departments';
import ProductType from './views/settings/producttype/ProductType';
import Overview from './views/overview/Overview';
import RiskList from './views/riskAssessment/RiskList';
import About from './views/About';
import Risk from './views/riskAssessment/Risk';
import ReportChemical from './views/reports/chemical/List';
import ReportADR from './views/reports/adr/List';
import ReportFire from './views/reports/fire/List';
import ReportStatutory from './views/reports/statutory/List';
import Product from './views/products/Product';
import Activity from './views/activity/Activity';
import InventoryList from './views/inventory/InventoryList';
import Search from './views/search/Search';
import LocalProducts from './views/products/localProduct/LocalProducts';
import LocalProduct from './views/products/localProduct/LocalProduct';
import ApplicationFormCreator from './views/applicationForm/ApplicationFormCreator';
import ApplicationList from './views/applications/ApplicationList';
import ApplicationRequest from './views/applications/ApplicationRequest';
import ApplicationReview from './views/applications/ApplicationReview';
import OneOffMeasure from './views/overview/OneOffMeasure';
import { canSee } from './libraries/permissions';

// const ReportChemical = resolve => {
// 	require.ensure(['./views/reports/chemical/List.vue'], () => resolve(require('./views/reports/chemical/List.vue')), 'reports');
// }

Vue.use(Router)

var router = new Router({
	base: process.env.VUE_APP_ROUTE_URL || '/system/',
	mode: 'history',
	// scrollBehavior(to, from, savedPosition) {
	// },
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
			meta: { isInMainPage: true }
		},
		{
			path: '/settings/settings',
			name: 'settings',
			component: Settings,
			meta: { permission: canSee.settings, isInMainPage: true }
		},
		{
			path: '/settings/users',
			name: 'users',
			component: Users,
			meta: { permission: canSee.userAndPermission, isInMainPage: true }
		},
		{
			path: '/settings/users/new',
			name: 'userNew',
			component: User,
			meta: { permission: canSee.userAndPermission, isInMainPage: true }
		},
		{
			path: '/settings/users/:id',
			name: 'userEdit',
			component: User,
			meta: { permission: canSee.userAndPermission, isInMainPage: true }
		},
		{
			path: '/settings/permissions',
			name: 'permissions',
			component: Permissions,
			meta: { permission: canSee.userAndPermission, isInMainPage: true }
		},
		{
			path: '/settings/permissions/new',
			name: 'permissionNew',
			component: Permission,
			meta: { permission: canSee.userAndPermission, isInMainPage: true }
		},
		{
			path: '/settings/permissions/:id',
			name: 'permission',
			component: Permission,
			meta: { permission: canSee.userAndPermission, isInMainPage: true }
		},
		{
			path: '/settings/departments',
			name: 'departments',
			component: Departments,
			meta: { permission: canSee.department, isInMainPage: true }
		},
		{
			path: '/settings/product_type',
			name: 'productType',
			component: ProductType,
			meta: { permission: canSee.productType, isInMainPage: true }
		},
		{
			path: '/overview',
			name: 'overview',
			component: Overview,
			meta: { permission: canSee.overview, isInMainPage: true }
		},
		{
			path: '/chemicals/inventory',
			name: 'inventory',
			component: InventoryList,
			meta: { permission: canSee.inventory, isInMainPage: true }
		},
		{
			path: '/chemicals/risk_assessment/:tab?',
			name: 'riskList',
			component: RiskList,
			meta: { permission: canSee.riskAssessment, isInMainPage: true }
		},
		{
			path: '/chemicals/risk_assessment/risk_new/:component',
			name: 'riskNew',
			component: Risk,
			meta: { permission: canSee.riskAssessment, isInMainPage: true }
		},
		{
			path: '/chemicals/risk_assessment/risk/:riskId/:component?',
			name: 'risk',
			component: Risk,
			meta: { permission: canSee.riskAssessment, isInMainPage: true }
		},
		{
			path: '/chemicals/risk_assessment/general_risk/:riskId/:component?',
			name: 'generalRisk',
			component: Risk,
			meta: { permission: canSee.riskAssessment, general: true, isInMainPage: true }
		},
		{
			path: '/chemicals/risk_assessment/view_risk/:riskId/:component?',
			name: 'readOnlyRisk',
			component: Risk,
			meta: { permission: canSee.riskAssessment, readOnly: true, isInMainPage: true }
		},
		{
			path: '/chemical_list/:tab?',
			name: 'reportChemical',
			component: ReportChemical,
			meta: { isInMainPage: true }
		},
		{
			path: '/reports/adr/:tab?',
			name: 'reportAdr',
			component: ReportADR,
			meta: { permission: canSee.reportAdr, isInMainPage: true }
		},
		{
			path: '/reports/fire/:tab?',
			name: 'reportFire',
			component: ReportFire,
			meta: { permission: canSee.reportFire, isInMainPage: true }
		},
		{
			path: '/reports/chemical_report/:tab?',
			name: 'reportStatutory',
			component: ReportStatutory,
			meta: { permission: canSee.reportStatutory, isInMainPage: true }
		},
		{
			path: '/product/:id/:component?',
			name: 'product',
			component: Product,
			meta: { isInMainPage: true }
		},
		{
			path: '/activity/:id/:component?',
			name: 'activity',
			component: Activity,
			meta: { isInMainPage: true }
		},
		{
			path: '/search',
			name: 'search',
			component: Search,
			meta: { isInMainPage: true }
		},
		{
			path: '/chemicals/local_products',
			name: 'localProducts',
			component: LocalProducts,
			meta: { isInMainPage: true }
		},
		{
			path: '/chemicals/local_products/new',
			name: 'localProductNew',
			component: LocalProduct,
			meta: { isInMainPage: true }
		},
		{
			path: '/settings/application_form/new',
			name: 'applicationForm',
			component: ApplicationFormCreator,
			meta: { permission: canSee.applicationForm, isInMainPage: true }
		},
		{
			path: '/chemicals/applications/:tab?',
			name: 'applications',
			component: ApplicationList,
			meta: { permission: canSee.application, isInMainPage: true }
		},
		{
			path: '/chemicals/applications/request/new',
			name: 'applicationRequestNew',
			component: ApplicationRequest,
			meta: { permission: canSee.application, isInMainPage: true }
		},
		{
			path: '/chemicals/applications/request/:id',
			name: 'applicationRequest',
			component: ApplicationRequest,
			meta: { permission: canSee.application, isInMainPage: true }
		},
		{
			path: '/chemicals/applications/review/:requestId',
			name: 'applicationReview',
			component: ApplicationReview,
			meta: { permission: canSee.application, isInMainPage: true }
		},
		{
			path: '/measure',
			component: OneOffMeasure,
			meta: { isInMainPage: true }
		},
		{
			path: '/about',
			component: About,
			meta: { isInMainPage: true }
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			// component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
		}
	]
})

router.beforeEach((to, from, next) => {
	Vue.prototype.storeState.tickers = [];

	if (!to.meta.permission || !Vue.prototype.appSettings || to.meta.permission())
		next();
});

export default router;