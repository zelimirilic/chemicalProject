<template>
	<div>
		<SmallLoader v-if="!countries" />
		<template v-else>
			<div class="card-body">
				<Alerts additionalClass="sticky-top onPopup" :class="{ maxBottomMargin: showAlert }" v-if="!showProductRequestModal && !addedProductsIds" />
				<Search :countries="countries" :country="country" :lastSearchObj="lastSearchObj" :numberOfProducts="(searchedProducts || []).length" @search="submitSearch" @countryChanged="country = $event" ref="search" />
				<ProductsSimple class="addTbl mt-4" @productInfoMsg="productInfoMsg" :lastSearchObj="lastSearchObj" :products="searchedProducts" :addedProductIds="productAdded()" :tabs="tabs" :selectedTab="selectedTab" :units="units" @tabChanged="tabChanged" @productSelected="productSelected" :selectMultipleProducts="selectMultipleProducts" @addProduct="$emit('productPicked', $event)" @removeProduct="$emit('productRemoved', $event)" />
			</div>
			<div class="card-footer">
				<div class="text-right">
					<ButtonClose @click="close()" />
					<Button class="primary" @click="openProductRequestModal()" v-if="!appSettings.disableInventoryShowRequestButton && isProductApplication && shouldShowRequestButton === true">{{ getTranslation('I00.00010290', 'Request') }}</Button>
				</div>
			</div>
			<ModalDialog :title="getTranslation('I00.00044630', 'Product request')" @close="showProductRequestModal = false" :withFooter="true" additional-class="width40" v-if="showProductRequestModal">
				<ProductRequestForm :productRequestData="productRequestDataObj" @close="closeProductRequestModal()" @reset="resetProductRequestForm()" v-if="showProductRequestModal" />
			</ModalDialog>
		</template>
	</div>
</template>

<script>
import axios from '../../axiosOld-DONOTUSE';
import Search from './add/Search_v3.vue';
import ProductsSimple from './add/ProductsSimple_v3.vue';
import SmallLoader from '../common/loaders/SmallLoader_v3';
import ProductRequestForm from './add/ProductRequestForm_v3';
import Button from "../common/button/button/Button_v3";
import ButtonClose from "../common/button/button/ButtonClose_v3.vue";
import Alerts from '../../components/alert/Alerts.vue';
import { errorDebug, isNullOrEmpty, camelCaseObj, alert } from '../../libraries/common';
import { propToBool, checkIsValid } from '../../libraries/vue';

export default {
  components: {
    Search,
    ProductsSimple,
    SmallLoader,
    ProductRequestForm,
    Button,
    ButtonClose,
    Alerts
  },
  props: ['inventoryYear', 'hideGlobalTab', 'withConsumption', 'withProductType', 'validations', 'isVisible', 'addedProductsIds', 'selectMultipleProducts', 'isProductApplication', 'shouldShowRequestButton'],
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
      $modelValidators: [],
      showProductRequestModal: false,
      productRequestDataObj: null,
      showAlert: false
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
    getProductRequestData() {
      axios.post('/ProductRequest/Show', { countryCode: this.country.IsoCountryCode, returnJson: true })
        .then(response => {
          this.productRequestDataObj = camelCaseObj(response.data);
        })
        .catch(errorDebug);
    },
    openProductRequestModal() {
      alert.clearMessages();
      this.getProductRequestData();
      this.showProductRequestModal = true;
    },
    resetProductRequestForm() {
      this.showProductRequestModal = false;
      this.$nextTick(() => {
        this.openProductRequestModal();
      });
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
      this.addProduct();
      this.$nextTick(() => this.pickProduct());
    },
    pickProduct() {
      if (this.isValid) {
        this.$emit('productPicked', this.selectedProduct);
        this.selectedProduct = null;
      }
    },
    addProduct() {
      this.$emit('addProduct', this.selectedProduct, !this.isValid);
    },
    close() {
      this.$emit('cancel');
      this.showAlert = false;
    },
    closeProductRequestModal() {
      this.showProductRequestModal = false;
      alert.clearMessages();
    },
    productInfoMsg(msgType) {
      this.showAlert = true;
      alert.clearMessages();
      if (msgType)
        alert.addSuccessMessage(this.getTranslation("I00.00056860", "Product successfully added."));
      else
        alert.addSuccessMessage(this.getTranslation("I00.00056870", "Product successfully removed."));
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

    alert.clearMessages();

    this.getTranslation("I00.00056860", "Product successfully added.");
    this.getTranslation("I00.00056870", "Product successfully removed.");
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
  }
}
</script>