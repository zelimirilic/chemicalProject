<template>
	<div class="row align-items-center">
		<div class="col-auto">
			<div class="specialType input-group">
				<div class="input-group-prepend noColor" @click="submitSearch">
					<span class="input-group-text icons icon-search" :class="{ disabled: searchButtonDisabled }"></span>
				</div>
				<div class="searchForm form-inline">
					<Input v-model="searchWord" @keydown.enter="submitSearch" focus ref="input" />
					<Select :items="searchData" prop="text" v-model="searchCategory" compareByHash />
				</div>
			</div>
		</div>
		<div class="col-2">
			<Select :items="countries" :class="{ disabled: !countries }" prop="CountryName" :value="country" @input="$emit('countryChanged', $event)" />
			<!-- <Animation smallAnimation v-if="!countries.any()"/> -->
		</div>
	</div>
</template>

<script>
import { isNullOrEmpty } from '../../../libraries/common';

export default {
  props: ['inventoryYear', 'numberOfProducts', 'countries', 'country'],
  data() {
    return {
      searchCategory: null,
      searchWord: '',
      lastSearchObj: {},
    };
  },
  methods: {
    compareProperties: function (obj1, obj2, props) {
      return !props.any(prop => obj1[prop] !== obj2[prop]);
    },
    submitSearch() {
      if (!this.searchButtonDisabled) {
        this.lastSearchObj = this.searchObject;
        this.$emit('search', this.searchObject);
      }
    },
    resetSearch() {
      this.searchWord = '';
      this.searchCategory = this.searchData[0];
      this.country = this.countries[0];

      this.lastSearchObj = {};
    },
    focus() {
      this.$nextTick(() => this.$refs.input.$el.focus())
    },
  },
  computed: {
    searchData() {
      var data = [
        {
          value: -1,
          text: this.getTranslation('I00.00049760', 'All product names, product No\'s, Supplier product No\'s and SDS product No\'s'),
          empty: this.getTranslation("I00.00011840", "The search returned no results. If you want search on other than the product name..."),
          args: ['Name', 'ArtNo', 'SupplierArtNo', 'SdsNo']
        },
        { value: 1, text: this.getTranslation('I00.00002880', 'Prod no.'), args: ['ArtNo'], },
        { value: 2, text: this.getTranslation('I00.00004270', 'Name'), args: ['Name'], },
        { value: 3, text: this.getTranslation('I00.00004110', 'Supplier'), args: ['SupplierName'], },
        { value: 4, text: this.getTranslation('I00.00011760', 'Supplier prod no.'), args: ['SupplierArtNo'], },
        { value: 5, text: this.getTranslation('I00.00050430', 'Sds prod no.'), args: ['SdsNo'], },
        { value: 0, text: this.getTranslation('I00.00008990', 'Search all fields'), args: ['Name', 'ArtNo', 'SupplierName', 'SupplierArtNo', 'RKods'], },
      ];

      if (!this.appSettings.inventoryAdd_SearchBarCode) {
        data = data.filter(f => f.value !== 6);
      }
      return data;
    },
    searchButtonDisabled() {
      if (this.searchWord.length === 0 || isNullOrEmpty(this.searchWord))
        return true;
      return !this.countries || this.compareProperties(this.searchObject,
        this.lastSearchObj,
        [
          'search_word', 'search_category', 'search_word2', 'search_category2', 'server_search',
          'country', 'inventory_add', 'check_for_limit_of_search_to_approved_products'
        ]);
    },
    searchObject() {
      var obj = {
        search_word: this.searchWord,
        search_category: (this.searchCategory || {}).value,
        server_search: true,
        country: (this.country || {}).IsoCountryCode,
        check_for_limit_of_search_to_approved_products: true, // didn't check what is this for
        inventory_add: false,
      };
      obj.simple_search = obj.search_category === -1;
      return obj;
    },
  },
  translationsLoaded() {
    this.searchCategory = this.searchData[0];
  }
}
</script>