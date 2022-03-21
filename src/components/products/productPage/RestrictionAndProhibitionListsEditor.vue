<template>
	<div>
		<RestrictionAndProhibitionListsBox :restrictionLists="restrictionLists" :hasSunsetDate="hasSunsetDate" :isLocalProduct="isLocalProduct(product)" :showLoader="showLoader" @edit="isEditing = true" v-show="!isEditing" />
		<RestrictionAndProhibitionListsBoxEdit :list="userDefinedList" :productLists="productLists" @input="saveRestrictionLists" @cancel="cancel" v-if="isEditing" />
	</div>
</template>

<script>
import RestrictionAndProhibitionListsBox from './RestrictionAndProhibitionListsBox';
import RestrictionAndProhibitionListsBoxEdit from './RestrictionAndProhibitionListsBoxEdit';

import { errorDebug, deepClone, idToString } from '../../../libraries/common';
import axios from '../../../axios';
import { isLocalProduct } from '../../../libraries/product';

export default {
  components: {
    RestrictionAndProhibitionListsBox,
    RestrictionAndProhibitionListsBoxEdit,
  },
  props: ['product'],
  data() {
    return {
      restrictionLists: null,
      userDefinedList: null,
      productLists: null,
      hasSunsetDate: false,
      isEditing: false,
      showLoader: true
    };
  },
  methods: {
    nodeSelected() {
      this.getLists();
    },
    getLists() {
      return axios.postWithCancelToken('/ProductPage/GetLists', { productId: this.product.id })
        .then(response => {
          this.restrictionLists = response.data.filter(f => !f.isExcluded);
          this.userDefinedList = this.restrictionLists.filter(f => f.userDefined);
          this.hasSunsetDate = this.restrictionLists.any(f => f.sunsetDate != null);
          this.showLoader = false;
        })
        .catch(errorDebug);
    },
    saveRestrictionLists(lists) {
      var helper = lists.map(f => ({
        ...f,
        symbolCode: idToString(f.id),
        symbolList: 'lists'
      }));
      this.showLoader = true;
      this.isEditing = false;
      return axios.post('/LocalProduct/SaveProductLists', { helper: helper, productId: this.product.id })
        .then(response => {
          if (response.data) this.getLists();
        }).catch(errorDebug);
    },
    cancel() {
      this.isEditing = false;
      this.userDefinedList = deepClone(this.restrictionLists.filter((f) => f.userDefined));
    },
    deepClone,
    isLocalProduct,
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisRestrictionsAndProhibitionListsEditor'] = this;
    axios.post('/LocalProduct/GetProductLists')
      .then(response => this.productLists = response.data);
    if (this.sideTree.getSelectedDepartment()) {
      this.getLists();
    }
  }
}
</script>