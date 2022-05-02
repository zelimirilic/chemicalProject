<template>
	<div>
		<SmallLoader v-if="!countries" />
		<template v-else>
			<Search :countries="countries" :country="country" :lastSearchObj="lastSearchObj" :numberOfProducts="(searchedProducts || []).length" @search="submitSearch" @countryChanged="country = $event" ref="search" />
			<Products class="addTbl mt-5 mb-3" :lastSearchObj="lastSearchObj" :products="searchedProducts" :addedProductIds="productAdded()" :tabs="tabs" :selectedTab="selectedTab" :units="units" @tabChanged="tabChanged" @productSelected="productSelected" @addProduct="$emit('productPicked', $event)" @removeProduct="$emit('productRemoved', $event)" />
			<div class="mt-5 pb-3 borderTRBL rounded" v-if="selectedProduct">
				<SubTitle class="borderB blueTtl" :text="selectedProduct.name"></SubTitle>
				<ChosenProduct :class="{ disabled: !isValid }" :value="selectedProduct" :units="units" :simplePick="simplePick" :withConsumption="propToBool(withConsumption)" :withProductType="propToBool(withProductType)" :validations="validations && validations(selectedProduct)" @productChanged="checkModelValidity" />
				<label class="mx-3 alert alert-danger" v-if="!isModelValid && errorMessage">{{ errorMessage }}</label>
				<div class="px-3 text-right">
					<Button :class="{ disabled: !isModelValid }" @click="pickProduct">{{ okButtonText || getTranslation('I00.00013100', 'Add') }}</Button>
					<Button v-if="$listeners.addProduct" :class="{ disabled: !isModelValid }" @click="addProduct">{{ getTranslation('I00.00013100', 'Add') }}</Button>
					<ButtonCancel @click="cancelProduct" />
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import axios from '../../axiosOld-DONOTUSE';
import SmallLoader from '../common/loaders/SmallLoader_v3';
import Search from './add/Search_v3';
import Products from './add/Products_v3';
import SubTitle from '../common/cardBox/Subtitle_v3';
import ChosenProduct from './add/ChosenProduct_v3';
import Button from '../common/button/button/Button_v3';
import { errorDebug, isNullOrEmpty, camelCaseObj } from '../../libraries/common_v3';
import { propToBool, checkIsValid } from '../../libraries/vue_v3';

export default {
	components: {
		Search,
		Products,
		SubTitle,
		ChosenProduct,
		Button,
		SmallLoader,
	},
	props: ['inventoryYear', 'hideGlobalTab', 'simplePick', 'withConsumption', 'withProductType', 'validations', 'okButtonText', 'isVisible', 'addedProductsIds'],
	data() {
		return {
			selectedTab: 0,
			searchedProducts: [],

			lastSearchObj: {},
			units: [],
			countries: null,
			country: {},
			selectedProduct: null,
			loading: false,
			sortFnc: (data) => data,
			isValid: true,
			errorMessage: null,
			$modelValidators: [],
		};
	},
	methods: {
		propToBool: propToBool,
		checkModelValidity() {
			this.$nextTick(() =>
				this.$nextTick(() => {
					if (this.validations && !checkIsValid(this)) {
						var val = this.validations(this.selectedProduct).find((f) => !f.fnc()) || { message: () => null };
						this.errorMessage = val.message();
					}
				})
			);
		},
		tabChanged(tab) {
			this.selectedTab = tab;
			if (!isNullOrEmpty(this.lastSearchObj.search_word)) this.submitSearch(this.lastSearchObj);
		},
		productAdded() {
			return this.addedProductsIds || null;
		},
		submitSearch(event) {
			this.selectedProduct = null;
			this.searchedProducts = null;
			var obj = {
				...event,
				include_lab: this.tabs[this.selectedTab].id === 1,
				only_own_products: this.tabs[this.selectedTab].id === 0,
				activeTab: this.selectedTab,
			};

			this.lastSearchObj = obj;
			this.loading = true;

			obj.noLimitSearch = !isNullOrEmpty(obj.search_word2);
			axios
				.post('/InventoryAdd/SearchJson', obj)
				.then((data) => {
					this.loading = false;
					this.searchedProducts = data.data.Products;
				})
				.catch(errorDebug);
		},
		productSelected(event) {
			if (this.validations) {
				var val = this.validations(event).find((f) => !f.fnc()) || { message: () => null };
				this.isValid = !val.fnc;
				this.errorMessage = val.message();
			}
			this.selectedProduct = event;
			this.selectedProduct.isCustomerProduct = this.tabs[this.selectedTab].id === 0;
		},
		pickProduct() {
			this.$emit('productPicked', this.selectedProduct);
			this.selectedProduct = null;
		},
		addProduct() {
			this.$emit('addProduct', this.selectedProduct);
			this.selectedProduct = null;
		},
		cancelProduct() {
			this.selectedProduct = null;
			if (this.$refs.search) this.$refs.search.resetSearch();

			this.searchedProducts = [];
			this.selectedTab = 0;
			this.$emit('cancel');
		},
	},
	computed: {
		tabs() {
			return [
				{ text: this.getTranslation('I00.00011860', 'Only own products'), id: 0, value: this.appSettings.permissions.inventory.full },
				{ text: this.getTranslation('I00.00038120', 'Global products'), id: 1, value: this.appSettings.permissions.additionalTabs.full && !propToBool(this.hideGlobalTab) },
			].filter((f) => f.value);
		},
		searchHelper() {
			return {
				'-1': {
					empty: this.getTranslation('I00.00011840', 'The search returned no results. If you want search on other than the product name...'),
					args: ['Name', 'ArtNo', 'SupplierArtNo', 'SdsNo'],
				},
				0: { args: ['Name', 'ArtNo', 'SupplierName', 'SupplierArtNo', 'RKods'] },
				1: { args: ['Name'] },
				2: { args: ['ArtNo'] },
				3: { args: ['SupplierName'] },
				4: { args: ['SupplierArtNo'] },
				5: { args: ['SdsNo'] },
				6: { args: ['BarCode'] },
				7: {},
			};
		},
		isModelValid() {
			return this.isValid && this.$data.$modelValidators.all((f) => f.isValid);
		},
	},
	mounted() {
		if (process.env.NODE_ENV === 'development') window['thisInventoryAdd'] = this;

		axios
			.get('/InventoryAdd/GetCountries')
			.then((response) => {
				this.countries = response.data;
				this.country = this.countries[0];
			})
			.catch(errorDebug);
		axios
			.get('/InventoryAdd/GetUnits')
			.then((response) => (this.units = camelCaseObj(response.data)))
			.catch(errorDebug);
	},
	watch: {
		isVisible() {
			if (this.isVisible) {
				this.$refs.search.focus();
			}
		},
	},
};
</script>
