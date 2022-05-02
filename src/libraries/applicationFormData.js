import { validators } from './forms';
import Vue from 'vue';

var basicFields = () => {
	return {
		name: Vue.prototype.getTranslation('I00.00055460', 'Basic'),
		items: [
			{
				template: 'InputGroup',
				name: Vue.prototype.getTranslation('I00.00055370', 'Text Box'),
				props: { propRoot: 'input', placeholder: Vue.prototype.getTranslation('I00.00055380', 'Some text here'), text: Vue.prototype.getTranslation('I00.00055370', 'Text Box'), className: 'col-12', required: false, iSafe: false }
			},
			{
				template: 'CheckBoxGroup',
				name: Vue.prototype.getTranslation('I00.00055390', 'Check box'),
				props: { propRoot: 'chekckBox', text: Vue.prototype.getTranslation('I00.00055390', 'Check box'), className: 'col-12', required: false, iSafe: false }
			},
			{
				template: 'RadioGroup',
				name: Vue.prototype.getTranslation('I00.00055400', 'Radio group'),
				props: { propRoot: 'radio', text: Vue.prototype.getTranslation('I00.00055400', 'Radio group'), className: 'col-12', items: ['Item 1', 'Item 2'], required: false, iSafe: false }
			},
			{
				template: 'SelectGroup',
				name: Vue.prototype.getTranslation('I00.00055410', 'Select box'),
				props: { propRoot: 'select', text: Vue.prototype.getTranslation('I00.00055410', 'Select box'), className: 'col-12', items: ['Item 1', 'Item 2'], required: false, iSafe: false }
			},
			{
				template: 'TextAreaGroup',
				name: Vue.prototype.getTranslation('I00.00039450', 'Text area'),
				props: { propRoot: 'textArea', placeholder: Vue.prototype.getTranslation('I00.00055380', 'Some text here'), text: Vue.prototype.getTranslation('I00.00039460', 'Text area'), className: 'col-12', required: false, iSafe: false }
			},
			{
				template: 'InformationBox',
				icon: 'infobox',
				name: Vue.prototype.getTranslation('I00.00040090', 'Information'),
				props: { propRoot: 'informationBox', placeholder: Vue.prototype.getTranslation('I00.00055380', 'Some text here'), text: Vue.prototype.getTranslation('I00.00040090', 'Information') + ':', className: 'col-12' }
			},
			{
				template: 'Container',
				name: Vue.prototype.getTranslation('I00.00055420', 'Container'),
				children: [],
				props: { isSelected: false, className: 'col-12' }
			},
			{
				template: 'Section',
				icon: 'section',
				name: Vue.prototype.getTranslation('I00.00037700', 'Section'),
				children: [],
				props: { text: Vue.prototype.getTranslation('I00.00055480', 'Section name') }
			},

		]
	}
};

export const requestFields = function () {
	return [
		{
			name: this.getTranslation('I00.00054080', 'Mandatory'),
			items: [
				{
					template: 'ProductGroup',
					icon: 'productgroup',
					canBeOnlyOne: true,
					name: this.getTranslation('I00.00006920', 'Trade name(chemical product)'),
					props: {
						dataProp: 'product', text: this.getTranslation('I00.00006920', 'Trade name(chemical product)') + ':',
						title: this.getTranslation('I00.00009310', 'Pick product'), className: 'col-12', required: true,
						validations: [{ strFnc: 'return !props.required || !(data.product.name || \'\').isNullOrEmpty();', message: this.getTranslation('I00.00020310', 'Missing required field') }],
						disableProductNameEditing: false,
						sdsNotRequired: true,
						shouldShowRequestButton: true
					}
				},
				{
					template: 'InputGroup',
					icon: 'sdspublisher',
					canBeOnlyOne: true,
					name: this.getTranslation('I00.00006760', 'SDS publisher'),
					props: { dataProp: 'product.supplierName', text: this.getTranslation('I00.00006760', 'SDS publisher'), placeholder: 'SDS publisher', className: 'col-12', required: true }
				},
				{
					template: 'DepartmentWithConsumption',
					icon: 'usagegroup',
					canBeOnlyOne: true,
					name: this.getTranslation('I00.00025910', 'Usage'),
					props: {
						dataProp: 'usage',
						department: {
							dataProp: 'usagePlace',
							text: this.getTranslation('I00.00012760', 'Where is the product to be used?'),
							title: this.getTranslation('I00.00005390', 'Select department'),
							required: true
						},
						consumption: {
							propValue: 'usageAmount',
							propUnit: 'usageUnit',
							text: this.getTranslation('I00.00012480', 'Estimated annual consumption'),
							required: true
						},
						usingDash: true,
						className: 'col-12'
					},
				},
				{
					template: 'TextAreaGroup',
					icon: 'productdescriptiongroup',
					canBeOnlyOne: true,
					name: this.getTranslation('I00.00012470', 'Describe how the product is to be used'),
					props: { dataProp: 'dynamic.usageDescription', placeholder: this.getTranslation('I00.00012470', 'Describe how the product is to be used'), text: this.getTranslation('I00.00012470', 'Describe how the product is to be used'), className: 'col-12', required: true }
				},
				{
					template: 'InputGroup',
					icon: 'emailgroup',
					canBeOnlyOne: true,
					name: this.getTranslation('I00.00012810', 'Your email address'),
					props: {
						dataProp: 'dynamic.email', type: 'email', placeholder: this.getTranslation('I00.00012810', 'Your email address'),
						text: this.getTranslation('I00.00012810', 'Your email address'),
						tooltipTxt: this.getTranslation('I00.00020670', 'Email of group or person responsible for approval'),
						className: 'col-12', required: true,
						validations: [{ strFnc: 'return validators.email.fnc(value);', message: this.getTranslation('I00.00012710', 'Please provide a valid email adress.') }]
					}
				},
				{
					template: 'InputGroup',
					icon: 'emailconfirmgroup',
					canBeOnlyOne: true,
					name: this.getTranslation('I00.00012530', 'Confirm email address'),
					props: {
						dataProp: 'dynamic.confirmEmail', type: 'email', placeholder: this.getTranslation('I00.00012530', 'Confirm email address'),
						text: this.getTranslation('I00.00012530', 'Confirm email address'), className: 'col-12', required: true,
						validations: [{ strFnc: 'return data.dynamic.email === data.dynamic.confirmEmail;', message: this.getTranslation('I00.00012700', 'Email address did not match the email address in the Confirm field.') }]
					}
				},
				{
					template: 'Users',
					icon: 'usergroup',
					canBeOnlyOne: true,
					name: this.getTranslation('I00.00020670', 'Email of group or person responsible for approval'),
					props: { dataProp: 'dynamic.approvalGroups', text: this.getTranslation('I00.00020670', 'Email of group or person responsible for approval'), className: 'col-12', users: [] },
				},
			],
			basicFields: basicFields()
		},
		{
			name: this.getTranslation('I00.00055470', 'Predefined'),
			items: [
				{
					template: 'ProductTypePickerGroup',
					icon: 'producttypegroup',
					canBeOnlyOne: true,
					name: this.getTranslation('I00.00007350', 'product type'),
					props: { dataProp: 'productTypes', text: this.getTranslation('I00.00007350', 'product type'), title: this.getTranslation('I00.00007350', 'product type'), className: 'col-12', required: false }
				},
				{
					template: 'ProductGroup',
					icon: 'replaceproductgroup',
					canBeOnlyOne: true,
					name: this.getTranslation('I00.00012770', 'Replaces the following product(s)'),
					props: { dataProp: 'replaceProduct', text: this.getTranslation('I00.00012770', 'Replaces the following product(s)'), title: this.getTranslation('I00.00012770', 'Replaces the following product(s)'), className: 'col-12', required: false }
				},
				{
					template: 'DepartmentWithConsumption',
					icon: 'usagegroup',
					canBeOnlyOne: true,
					name: this.getTranslation('I00.00003530', 'Storage'),
					props: {
						dataProp: 'storage',
						department: {
							dataProp: 'storagePlace',
							text: this.getTranslation('I00.00012460', 'Where is the product to be used?'),
							title: this.getTranslation('I00.00005390', 'Select department'),
							required: false
						},
						consumption: {
							propValue: 'storageAmount',
							propUnit: 'storageUnit',
							text: this.getTranslation('I00.00012490', 'Estimated maximum storage'),
							required: false
						},
						usingDash: true,
						className: 'col-12'
					},
				},
				{
					template: 'TextAreaGroup',
					icon: 'storagegroup',
					canBeOnlyOne: true,
					name: this.getTranslation('I00.00020590', 'Describe how to store the product'),
					props: { dataProp: 'dynamic.storageDescription', placeholder: this.getTranslation('I00.00020590', 'Describe how to store the product'), text: this.getTranslation('I00.00020590', 'Describe how to store the product'), className: 'col-12', required: false }
				},
				{
					template: 'UploadFileGroup',
					icon: 'uploadgroup',
					name: this.getTranslation('I00.00016670', 'Attach document'),
					canBeOnlyOne: true,
					props: { dataProp: 'applicationDocument', text: this.getTranslation('I00.00016670', 'Attach document'), title: this.getTranslation('I00.00016670', 'Attach document'), className: 'col-12', required: false }
				},
				{
					template: 'TrafficLight',
					icon: 'trafficLight',
					name: this.getTranslation('I00.00049950', 'Traffic lights'),
					canBeOnlyOne: true,
					props: { dataProp: 'product.currentTrafficLights', text: this.getTranslation('I00.00049950', 'Traffic lights'), title: this.getTranslation('I00.00049950', 'Traffic lights'), className: 'col-2' }
				},
				{
					template: 'DateGroup',
					icon: 'producttest',
					name: this.getTranslation('I00.00054440', 'Product is on test'),
					canBeOnlyOne: true,
					props: { dataProp: 'productOnTestUntil', text: this.getTranslation('I00.00054440', 'Product is on test') + ':', className: 'col-12', minDate: { parameters: '', strFnc: 'return new Date()' }, required: false }
				},
				{
					template: 'RestrictionAndProhibitionLists',
					icon: 'restrictionlists',
					name: this.getTranslation('I00.00043120', 'Restriction and prohibition lists'),
					canBeOnlyOne: true,
					props: { dataProp: 'restrictionAndProhibitionLists', text: this.getTranslation('I00.00043120', 'Restriction and prohibition lists') + ':', className: 'col-12', minDate: { parameters: '', strFnc: 'return new Date()' } }
				},
				{
					template: 'OwnFields',
					icon: 'ownfields',
					name: this.getTranslation('I00.00028730', 'Own fields'),
					canBeOnlyOne: true,
					props: { dataProp: 'ownFields', text: this.getTranslation('I00.00028730', 'Own fields') + ':', className: 'col-12' }
				},
			]
		},
		basicFields()]
};

export const reviewFields = function () {
	return [
		{
			name: this.getTranslation('I00.00054080', 'Mandatory'),
			items: [
				{
					template: 'ProductGroup',
					icon: 'productgroup',
					canBeOnlyOne: true,
					name: this.getTranslation('I00.00006920', 'Trade name(chemical product)'),
					props: {
						dataProp: 'product', text: this.getTranslation('I00.00006920', 'Trade name(chemical product)'),
						title: this.getTranslation('I00.00009310', 'Pick product'), className: 'col-12', required: true, shouldShowRequestButton: true,
						readOnly: true,
						validations: [{ strFnc: 'return !props.required || !!data.product.id;', message: this.getTranslation('I00.00012080', 'Product is not set!') }],
						showDocumentLink: true
					}
				},
				{
					template: 'DepartmentWithConsumption',
					icon: 'usagegroup',
					canBeOnlyOne: true,
					name: this.getTranslation('I00.00025910', 'Usage'),
					props: {
						dataProp: 'usage',
						department: {
							dataProp: 'usagePlace',
							text: this.getTranslation('I00.00012760', 'Where is the product to be used?'),
							title: this.getTranslation('I00.00005390', 'Select department'),
							required: true
						},
						consumption: {
							propValue: 'usageAmount',
							propUnit: 'usageUnit',
							text: this.getTranslation('I00.00012480', 'Estimated annual consumption'),
							required: true
						},
						usingDash: true,
						className: 'col-12'
					},
				},
			]
		},
		{
			name: this.getTranslation('I00.00055470', 'Predefined'),
			items: [
				{
					template: 'ProductTypePickerGroup',
					icon: 'producttypegroup',
					canBeOnlyOne: true,
					name: this.getTranslation('I00.00007350', 'product type'),
					props: { dataProp: 'productTypes', text: this.getTranslation('I00.00007350', 'product type'), title: this.getTranslation('I00.00007350', 'product type'), className: 'col-12', required: false }
				},
				{
					template: 'DepartmentWithConsumption',
					icon: 'usagegroup',
					canBeOnlyOne: true,
					name: this.getTranslation('I00.00003530', 'Storage'),
					props: {
						dataProp: 'storage',
						department: {
							dataProp: 'storagePlace',
							text: this.getTranslation('I00.00012460', 'Where is the product to be used?'),
							title: this.getTranslation('I00.00005390', 'Select department'),
							required: false
						},
						consumption: {
							propValue: 'storageAmount',
							propUnit: 'storageUnit',
							text: this.getTranslation('I00.00012490', 'Estimated maximum storage'),
							required: false
						},
						usingDash: true,
						className: 'col-12'
					},
				},
				{
					template: 'DateGroup',
					icon: 'producttest',
					name: this.getTranslation('I00.00054440', 'Product is on test'),
					canBeOnlyOne: true,
					props: { dataProp: 'productOnTestUntil', text: this.getTranslation('I00.00054440', 'Product is on test') + ':', className: 'col-12', minDate: { parameters: '', strFnc: 'return new Date()' }, required: false }
				},
				{
					template: 'UploadFileGroup',
					icon: 'uploadgroup',
					name: this.getTranslation('I00.00016670', 'Attach document'),
					canBeOnlyOne: true,
					props: { dataProp: 'applicationDocument', text: this.getTranslation('I00.00016670', 'Attach document'), title: this.getTranslation('I00.00016670', 'Attach document'), className: 'col-12', required: false }
				},
				{
					template: 'RestrictionAndProhibitionLists',
					icon: 'restrictionlists',
					name: this.getTranslation('I00.00005540', 'Restriction and prohibition lists'),
					canBeOnlyOne: true,
					props: { dataProp: 'restrictionAndProhibitionLists', text: this.getTranslation('I00.00005540', 'Restriction and prohibition lists') + ':', className: 'col-12', minDate: { parameters: '', strFnc: 'return new Date()' } }
				},
				{
					template: 'OwnFields',
					icon: 'ownfields',
					name: this.getTranslation('I00.00028730', 'Own fields'),
					canBeOnlyOne: true,
					props: { dataProp: 'ownFields', text: this.getTranslation('I00.00028730', 'Own fields') + ':', isReview: true, className: 'col-12' }
				},
			]
		}, basicFields()];
};

export const defaultData = () => ({
	product: {},
	replaceProduct: null,
	productType: null,
	usagePlace: null,
	usagePlaces: null,
	usageAmount: null,
	usageUnit: null,
	storagePlace: null,
	storagePlaces: null,
	storageAmount: null,
	storageUnit: null,
	appDocumentLink: null,
	dynamic: {},
});

export const createValidationFunctions = function (arr) {
	arr.filter(f => f.props.validations)
		.forEach(f => f.props.validations.forEach(g => g.fnc = (new Function('data, props, validators, value', g.strFnc).bind(this, this.data, f.props, validators))));
}

export const createOtherFunctions = function (arr) {
	arr.forEach(f => Object.keys(f.props)
		.filter(key => !!f.props[key] && !!f.props[key].parameters && f.props[key].strFnc)
		.forEach(key => f.props[key] = new Function(f.props[key].parameters || {}, f.props[key].strFnc).bind(this)));
}

export const widthTranslator = ['1/6', '1/3', '1/2', '2/3', '5/6', '1/1'].reduce((acc, f, ind) => { acc[`col-${2 * (ind + 1)}`] = f; return acc; }, {});
