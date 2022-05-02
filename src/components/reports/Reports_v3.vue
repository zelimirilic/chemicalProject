<template>
	<div>
		<TabsWithMenu class="card pageWrapper mt-5" :value="selectedIndex" :tabs="tabs" @input="tabChanged">
			<template #menu>
				<template v-if="appSettings.useReportsAdditionalColumns && selectedColumns">
					<span class="icons icon-columns" :class="{ disabled: !($store.getters.state.reportsAdditionalColumns || []).length }" :title="getTranslation('I00.00048130', 'Add columns')" @click="($store.getters.state.reportsAdditionalColumns || []).length ? (showAdditionalColumns = true) : ''"></span>
				</template>
			</template>
			<slot name="filterSlot"></slot>
			<template v-if="prodData && !isSaving">
				<slot :item="item" :excelTitle="getExcelTitlePath(item)" :index="ind" v-for="(item, ind) in prodData.take(displayedTables)"></slot>
				<slot :item="{ products: [] }" v-if="!prodData.length"></slot>
			</template>
			<div v-infinite-scroll="loadMore">
				<SmallLoader v-if="prodData == null || prodData.length > displayedTables || isSaving" />
			</div>
			<slot name="otherSlot"></slot>
			<ModalDialog additional-class="wp-400" :title="getTranslation('I00.00048420', 'Select additional columns')" hideClose v-if="showAdditionalColumns">
				<AdditionalColumnsPicker :value="selectedColumns" @input="columnsChanged" @cancel="showAdditionalColumns = false" />
			</ModalDialog>
		</TabsWithMenu>
		<div class="backToTop xxxlTopMargin rightAlign">
			<a class="mainButton btn Square" href="#nogo" @click="backToTop()"><span class="icons icon-arrowup"></span></a>
		</div>
	</div>
</template>

<script>

import SmallLoader from '../common/loaders/SmallLoader_v3';
import AdditionalColumnsPicker from './components/AdditionalColumnsPicker_v3';
import TabsWithMenu from '../common/tabs/TabsWithMenu_v3';
import { nodeNameWithParent, nodeNamePath } from '../../libraries/tree_v3';
import { getAllChildren, propToBool } from '../../libraries/vue';
import axios from '../../axios';
import { camelCaseObj, perPageItems } from '../../libraries/common';

export default {
  components: {
    SmallLoader,
    AdditionalColumnsPicker,
    TabsWithMenu
  },
  props: ['prodData', 'selectedColumns', 'hiddenColumns', 'perPage', 'withOutSummarise'],
  data() {
    return {
      displayedTables: 0,
      fetchOptions: ['singlenode', 'withchildren', 'addnodes'],
      tabLinks: ['department', 'departments', 'summary'],
      exportAllDisabled: false,
      showAdditionalColumns: false,
      showDeleteCustomReport: false,
      isSaving: false,
      reportRoute: null,
      selectedIndex: 0,
      perPageItems: perPageItems(),
      isDeleting: false
    };
  },
  methods: {
    propToBool,
    backToTop() {
      document.getElementById('MainContDiv').scroll({ top: 0, behavior: "smooth" });
    },
    getExcelTitlePath(item) {
      return item.department ? [...item.department.getParents().reverse().map(f => f.item.name), item.department.item.name].join(' \\ ') : "";
    },
    loadAdditionalColumns() {
      this.$store.getters.state.reportsAdditionalColumns = [];
      axios.post('/OrgProdList/GetAdditionalColumns')
        .then(reponse => this.$store.getters.state.reportsAdditionalColumns = camelCaseObj(reponse.data).map(f => ({
          ...f,
          name: f.name.camelCase(),
          type: f.type.camelCase(),
        })));
    },
    titleForDelete() {
      return this.getTranslation('I00.00054690', 'Delete custom report') + ': ' + this.customReport.filterName;
    },
    tabChanged(event) {
      this.selectedIndex = event;
    },
    columnsChanged(event) {
      this.showAdditionalColumns = false;
      this.$emit('columnsChanged', event);
    },
    emitChange() {
      this.displayedTables = 15;
      this.$emit('tabChanged', this.fetchOptions[this.selectedIndex]);
    },
    loadMore() {
      this.displayedTables += 15;
    },
    nodeNameWithParent: nodeNameWithParent,
    nodeNamePath: nodeNamePath,
    getAllDataTables() {
      return getAllChildren(this).filter(f => f.isDataTable);
    }
  },
  computed: {
    tabs() {
      return !propToBool(this.withOutSummarise) ? [this.getTranslation('I00.00008460', 'Selected dep.'), this.getTranslation('I00.00007150', 'Departments'), this.getTranslation('I00.00007050', 'Summarise')] : [this.getTranslation('I00.00008460', 'Selected dep.'), this.getTranslation('I00.00007150', 'Departments')] ;
    },
    showAddProduct() {
      return this.$listeners.addProduct;
    },
  },
  watch: {
    selectedIndex() {
      this.emitChange();
    },
  },
  beforeMount() {
    this.getTranslation('I00.00047810', 'The filter is saved.');
    this.getTranslation('I00.00053850', 'A report with that name already exists, please enter a different name');
  },
  translationsLoaded() {
    if (process.env.NODE_ENV === 'development') window['thisReports'] = this;

    this.emitChange();
    this.loadAdditionalColumns();

    if (!this.$store.getters.state.allDefinedSymbols) {
      this.$store.getters.state.allDefinedSymbols = [];
      axios.get('/OrgProdList/GetAllDefinedSymbols')
        .then(response => {
          var data = response.data.map(f => ({
            ...f,
            src: f.imageURL
          }));
          this.$store.getters.state.allDefinedSymbols = data;
          this.$store.getters.state.ghsPictograms = data.filter(f => f.symbolRaV3Value.startsWith('ghs'));
          this.$store.getters.state.kifPictograms = data.filter(f => !f.symbolRaV3Value.startsWith('ghs'));
        });
    }
  }
};
</script>
