<template>
	<div>
		<template>
			<div class="card-body">
				<p v-if="warningMessage" class="alert alert-warning w-100 mb-3">{{ warningMessage }}</p>
				<p v-if="errorMessage" class="alert alert-danger w-100 mb-3">{{ errorMessage }}</p>
				<RiskSearch class="w-30" :lastSearchObj="lastSearchObj" :numberOfItems="(searchedItems || []).length" @search="submitSearch" ref="search" />
				<div class="card pageWrapper mt-4">
					<RiskSearchResult :lastSearchObj="lastSearchObj" :items="searchedItems" />
				</div>
			</div>
			<div class="card-footer" v-if="withFooter">
				<div class="text-right">
					<ButtonCancel @click="close()" />
					<Button class="primary" :title="getTranslation('I00.00028790', 'Choose')" @click="submitCopyRa()" />
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import axios from '../../../../axiosOld-DONOTUSE';
import RiskSearch from './RiskSearch.vue';
import RiskSearchResult from './RiskSearchResult.vue';
import { errorDebug } from '../../../../libraries/common';

export default {
  components: {
    RiskSearch,
    RiskSearchResult
  },
  props: ['id', 'validations', 'isVisible', 'addedProductsIds', 'withFooter'],
  data() {
    return {
      searchedItems: [],
      lastSearchObj: {},
      selectedItem: null,
      loading: false,
      errorMessage: null,
      warningMessage: this.getTranslation('I00.00053960', 'You have unsaved data. Are you sure you want to proceed?')
    };
  },
  methods: {
    submitSearch(event) {
      var obj = {
        ra_id: this.id,
        term: event.search_word
      };

      this.selectedItem = null;
      this.searchedItems = null;

      this.lastSearchObj = obj;
      this.loading = true;

      axios.post('/RiskAssessmentCopy/SearchRiskAssessments', obj)
        .then((data) => {
          this.loading = false;

          data.data.map((o) => {
            o.Selected = false;

            return o;
          });

          this.searchedItems = data.data;
        }).catch(errorDebug);
    },
    submitCopyRa() {
      if (!this.searchedItems || !this.searchedItems.find(x => x.Selected)) {
        this.errorMessage = this.getTranslation('I00.00027310', 'Please select activity from list.');
        return;
      }
      else {
        this.loading = true;
        var nod = this.sideTree.getSelectedDepartment();

        var obj = {
          chosen_product_ids: null,
          new_activity_id: this.searchedItems.find(x => x.Selected).ID,
          old_ra_id: null,
          risk_sources: null,
          risk_name: null,
          chosen_product_sds: null,
          orgId: nod.orgID.id,
          orgId_mdbId: nod.orgID.id_mdbID
        };

        axios.post('/RiskAssessmentCopy/CopyRa', obj)
          .then((data) => {
            this.loading = false;
            this.errorMessage = null;
            this.$emit('copied', data.data);
          }).catch(errorDebug);
      }
    },
    close() {
      this.$emit('cancel');
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisInventoryAdd'] = this;
  },
  watch: {
    isVisible() {
      if (this.isVisible && this.$refs.search) {
        this.$refs.search.focus();
      } else {
        this.selectedItem = null;
        if (this.$refs.search)
          this.$refs.search.resetSearch();

        this.searchedItems = [];
        this.lastSearchObj = {};
        this.errorMessage = null;
      }
    }
  }
}
</script>