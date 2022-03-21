<template>
	<div>
		<SmallLoader v-if="!countries" />
		<template v-else>
			<div class="card-body">
				<Search :countries="countries" :country="country" :lastSearchObj="lastSearchObj" :numberOfProducts="(searchedProducts || []).length" @search="submitSearch" @countryChanged="country = $event" ref="search" />
				<Products class="addTbl mt-4" :lastSearchObj="lastSearchObj" :products="searchedProducts" :addedProductIds="productAdded()" :tabs="tabs" :selectedTab="selectedTab" :units="units" @tabChanged="tabChanged" @productSelected="productSelected" @clearPreviouslySelectedProduct="selectedProduct = null" :isVisible="isVisible" @addProduct="$emit('productPicked', $event)" @removeProduct="$emit('productRemoved', $event)" />
				<div class="card pageWrapper mt-3" v-if="selectedProduct">
					<h6 class="boxTtl">
						<b class="mr-1">{{ getTranslation('I00.00011780', 'Selected product') }}:</b>
						<span>{{ selectedProduct.name }}</span>
					</h6>
					<ChosenProduct :minDate="minDate" :maxDate="maxDate" :class="{ disabled: !isValid }" :value="selectedProduct" :units="units" :simplePick="simplePick" :withConsumption="propToBool(withConsumption)" :withProductType="propToBool(withProductType)" :validations="validations && validations(selectedProduct)" @productChanged="checkModelValidity" />
					<label class="mx-3 mb-3 alert alert-danger" v-if="!isModelValid && errorMessage">{{ errorMessage }}</label>
				</div>
				<div class="card pageWrapper mt-3" v-else>
					<h6 class="boxTtl">
						<b class="mr-1">{{ getTranslation('I00.00011780', 'Selected product') }}</b>
					</h6>
					<div class="emptyTxt text-center p-4">
						<h4 class="mb-2">{{ getTranslation('I00.00055910', 'No selected item') }}</h4>
						<h6 class="mb-0">{{ getTranslation('I00.00055920', 'You don’t have any items here.') }}</h6>
					</div>
				</div>
			</div>
			<div class="card-footer" v-if="withFooter">
				<div class="text-right">
					<ButtonCancel @click="$emit('cancel')" />
					<Button class="primary" :class="{ disabled: !selectedProduct }" @click="pickProduct">{{ okButtonText || getTranslation('I00.00013100', 'Add') }}</Button>
					<Button class="primary" v-if="$listeners.addProduct" :class="{ disabled: !selectedProduct }" @click="addProduct">{{ getTranslation('I00.00013100', 'Add') }}</Button>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import axios from '../../axiosOld-DONOTUSE';
import Search from './add/Search';
import Products from './add/Products';
import ChosenProduct from './add/ChosenProduct';
import Button from '../common/button/button/Button';

import { errorDebug, isNullOrEmpty, camelCaseObj } from '../../libraries/common';
import { propToBool, checkIsValid } from '../../libraries/vue';

export default {
  components: {
    Search,
    Products,
    ChosenProduct,
    Button,
  },
  props: ['inventoryYear', 'hideGlobalTab', 'simplePick', 'withConsumption', 'withProductType', 'validations', 'okButtonText', 'isVisible', 'addedProductsIds', 'withFooter', 'minDate', 'maxDate'],
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
      sortFnc: data => data,
      isValid: true,
      errorMessage: null,
      $modelValidators: []
    };
  },
  methods: {
    propToBool: propToBool,
    checkModelValidity() {
      this.$nextTick(() => this.$nextTick(() => {
        if (this.validations && !checkIsValid(this)) {
          var val = this.validations(this.selectedProduct).find(f => !f.fnc()) || { message: () => null };
          this.errorMessage = val.message();
        }
      }));
    },
    tabChanged(tab) {
      this.selectedTab = tab;
      if (!isNullOrEmpty(this.lastSearchObj.search_word))
        this.submitSearch(this.lastSearchObj);
    },
    productAdded() {
      return this.addedProductsIds || null
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
      axios.post('/InventoryAdd/SearchJson', obj)
        .then((data) => {
          this.loading = false;
          this.searchedProducts = data.data.Products;
        }).catch(errorDebug);
    },
    productSelected(event) {
      if (this.validations) {
        var val = this.validations(event).find(f => !f.fnc()) || { message: () => null };
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
    }
  },
  computed: {
    tabs() {
      return [
        { text: this.getTranslation("I00.00011860", "Only own products"), id: 0, value: this.appSettings.permissions.inventory.full },
        { text: this.getTranslation("I00.00038120", "Global products"), id: 1, value: this.appSettings.permissions.additionalTabs.full && !propToBool(this.hideGlobalTab) },
      ].filter(f => f.value);
    },
    searchHelper() {
      return {
        '-1': {
          empty: this.getTranslation('I00.00011840', 'The search returned no results. If you want search on other than the product name...'),
          args: ['Name', 'ArtNo', 'SupplierArtNo', 'SdsNo'],
        },
        '0': { args: ['Name', 'ArtNo', 'SupplierName', 'SupplierArtNo', 'RKods'], },
        '1': { args: ['Name'], },
        '2': { args: ['ArtNo'], },
        '3': { args: ['SupplierName'], },
        '4': { args: ['SupplierArtNo'], },
        '5': { args: ['SdsNo'], },
        '6': { args: ['BarCode'], },
        '7': {}
      }
    },
    isModelValid() {
      return this.isValid && this.$data.$modelValidators.all(f => f.isValid);
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisInventoryAdd'] = this;

    axios.get('/InventoryAdd/GetCountries')
      .then((response) => {
        this.countries = response.data;
        this.country = this.countries[0];
      })
      .catch(errorDebug);
    axios.get('/InventoryAdd/GetUnits')
      .then((response) => this.units = camelCaseObj(response.data))
      .catch(errorDebug);
  },
  watch: {
    isVisible() {
      if (this.isVisible && this.$refs.search) {
        this.$refs.search.focus();
      } else {
        this.selectedProduct = null;
        if (this.$refs.search)
          this.$refs.search.resetSearch();

        this.searchedProducts = [];
        this.selectedTab = 0;
        this.lastSearchObj = {};
      }
    }
  },
}
</script>