<template>
	<div class="dataTablesWrapper">
		<div class="mhp-20" v-if="tableData == null">
			<!-- <Animation /> -->
		</div>
		<template v-else>
			<template v-if="tableData.length > 0">
				<div class="headTtl d-flex justify-content-between align-items-center p-4 borderB" v-if="!propToBool(noHeader)">
					<h6 class="mb-0">{{ title }}</h6>
					<slot name="additionalRight"></slot>
				</div>
				<div class="modalInner d-flex justify-content-between align-items-center px-4 pt-4 pb-3" v-if="!propToBool(noSearch)">
					<div class="specialType input-group wp-200 mr-2" alwaysOn>
						<div class="input-group-prepend noColor">
							<span class="input-group-text icons icon-search disabled"></span>
						</div>
						<input type="text" class="form-control pl-0" :placeholder="getTranslation('I00.00008990', 'Search all fields')" v-model="searchText" @input="selectedPage = 1" alwaysOn />
					</div>
					<div class="d-flex align-items-center" v-if="$listeners['update:per-page']">
						<SelectGroup class="form-inline mr-2 mb-0" :items="perPageItems" prop="name" :value="perPageItems.find((f) => f.value === perPage)" @input="$emit('update:per-page', $event.value)" alwaysOn />
						<span class="bigTxt">{{ getTranslation('I00.00054570', 'items per page') }}</span>
					</div>
					<div class="ml-auto">
						<template v-if="showEdit">
							<span class="icons icon-edit mr-1" @click="$emit('edit', !edit)" v-tooltip="getTranslation('I00.00006260', 'Edit')" v-if="!edit"></span>
							<template v-else>
								<span class="icons icon-restore mr-1" v-tooltip="getTranslation('I00.00026430', 'Restore')" @click="$emit('cancel')"></span>
								<span class="icons icon-save mr-1" v-tooltip="getTranslation('I00.00004810', 'Save')" @click="$emit('save')"></span>
							</template>
						</template>
						<span class="icons mr-1" :class="{ 'icon-columnedit': !isEditing, 'icon-columncheck': isEditing }" v-tooltip="getTranslation('I00.00056080', 'Manage columns')" @click="toggleIsEditing" v-if="this.hiddenColumns" />
						<span class="icons icon-filter mr-1" :class="{ active: showColumnSearch }" v-tooltip="getTranslation('I00.00056960', 'Filter')" type="button" @click="toggleSubSearch"></span>
						<slot name="additonalIcons"></slot>
						<template v-if="!propToBool(noExcel)">
							<button class="btn" @click="exportToExcel()">
								<span class="icons icon-excel mr-2"></span>
								<span>{{ getTranslation('I00.00018680', 'Export to excel') }}</span>
							</button>
						</template>
					</div>
				</div>
				<div class="tblWrap" :class="tableWrapClass">
					<table class="table table-hover dataTable" :class="tableClass">
						<thead ref="head">
							<slot name="head"></slot>
							<tr v-if="showColumnSearch">
								<th v-for="(item, ind) in firstHeadChildren" :key="ind" v-show="isEditing || !(hiddenColumns || []).includes((item || {}).name)">
									<Input :value="(findSubSearch(item) || {}).text" :placeholder="(item || {}).placeholder" @input="changeSubSearch(item, $event)" v-if="(firstHeadChildrenProps || [])[ind] && !showSelectFilter((firstHeadChildrenPropNames || [])[ind])" alwayson />
									<select class="form-control" :value="(findSubSearch(item) || {}).text" @change="changeSubSearch(item, $event.target.value, true)" v-if="(firstHeadChildrenProps || [])[ind] && showSelectFilter((firstHeadChildrenPropNames || [])[ind])">
										<option v-for="(x, ind) in selectFilterValues[firstHeadChildrenPropNames[ind]]" :key="ind" :value="x">{{ x }}</option>
									</select>
								</th>
							</tr>
						</thead>
						<tbody ref="body">
							<template v-if="filteredData.length > 0">
								<slot name="body" :item="item" :index="tableData.indexOf(item)" v-for="item in pagedData"></slot>
							</template>
							<template v-else>
								<slot name="noResultsText">
									<tr>
										<td :colspan="(firstHeadChildrenProps || {}).length">
											<div class="emptyTxt text-center p-4">
												<p class="icons icon-noresult plainIcn bigIcn m-0 p-0"></p>
												<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055700', 'No results found') }}</h4>
												<h6 class="mb-0">{{ getTranslation('I00.00055710', 'Please try searching with another term.') }}</h6>
											</div>
										</td>
									</tr>
								</slot>
							</template>
						</tbody>
					</table>
				</div>
				<div class="tableInfo d-flex justify-content-between align-items-center p-4" v-if="!propToBool(noFooter) || hasPagination">
					<div class="mr-auto" v-if="!propToBool(noFooter)">
						<b>{{ sortedData.length }}</b>
						{{ getTranslation('I00.00055720', 'items found') }}
					</div>
					<Pagination v-model="selectedPage" :dat="sortedData" :perPage="perPage" v-if="hasPagination" />
				</div>
			</template>
			<template v-else>
				<h6 class="pt-4" v-if="!propToBool(noHeader) && title">{{ title }}</h6>
				<div class="tblWrap" :class="tableWrapClass">
					<table class="table table-hover dataTable" :class="tableClass" v-if="propToBool(showHeadersWhenEmpty)">
						<thead ref="head">
							<slot name="head"></slot>
						</thead>
					</table>
					<template v-if="isSearchResult">
						<slot name="startSearchText" v-if="!hasOuterSearchWord">
							<div class="emptyTxt text-center p-4">
								<h4 class="my-2">{{ getTranslation('I00.00055890', 'Start searching') }}</h4>
								<h6 class="mb-0">{{ getTranslation('I00.00055900', 'Please start a search above to select a product.') }}</h6>
							</div>
						</slot>
						<slot name="noResultsText" v-else>
							<div class="emptyTxt text-center p-4">
								<p class="icons icon-noresult plainIcn bigIcn m-0 p-0"></p>
								<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055700', 'No results found') }}</h4>
								<h6 class="mb-0">{{ getTranslation('I00.00055710', 'Please try searching with another term.') }}</h6>
							</div>
						</slot>
					</template>
					<slot name="emptyTableText" v-else>
						<div class="emptyTxt text-center p-4">
							<p class="icons icon-noitems plainIcn bigIcn m-0 p-0"></p>
							<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055680', 'No items found') }}</h4>
							<h6 class="mb-0">{{ getTranslation('I00.00055690', 'You don’t have any items here.') }}</h6>
						</div>
					</slot>
				</div>
			</template>
		</template>
	</div>
</template>

<script>
import Pagination from './Pagination';
import { getAllChildrens, perPageItems, getBrowser, hashCode } from '../../../libraries/common';
import { exportAllToExcel } from '../../../libraries/exportToExcel';
import { propToBool, propToFnc } from '../../../libraries/vue';
import { nodeNamePath } from '../../../libraries/tree';

export default {
  props: {
    tableData: {},
    perPage: { default: () => 20 },
    tableWrapClass: {},
    tableClass: {},
    title: {},
    excelTitle: {},
    noHeader: {},
    noSearch: {},
    noExcel: {},
    noFooter: {},
    noAccordion: {},
    accordion: {},
    noTopPagination: {},
    showHeadersWhenEmpty: {},
    secondHeaderFilter: {},
    hiddenColumns: {},
    edit: {},
    customFilters: null,
    orgId: null,
    selectFilterProps: {},
    selectFilterValues: {},
    isSearchResult: {},
    hasOuterSearchWord: {},
    showProtectionSymbols: {},
    orgProtectionSymbols: {},
    hasAdvancedFilter: {}
  },
  components: {
    Pagination,
  },
  data() {
    return {
      selectedPage: 1,
      sortFnc: data => data,
      searchText: '',
      filteredData: [],
      sortedData: [],
      showColumnSearch: false,
      firstHeadChildrenProps: null,
      firstHeadChildrenPropNames: null,
      secondHeadChildrenProps: null,
      secondHeadChildrenPropNames: null,
      isEditing: false,
      isDataTable: true,
      perPageItems: perPageItems(),
      browserName: getBrowser().name,
      filterChanged: false,
      exportDisabled: false,
    };
  },
  methods: {
    resetData() {
      if (this.$refs.head) {
        var els = getAllChildrens(this.$refs.head).filter(it => it.tagName === 'TH');
        var ths = this.$children.filter(f => els.indexOf(f.$el) > -1);
        ths.forEach(f => f.reset());
      }
      this.selectedPage = 1;
      this.searchText = null;
    },
    getSymbol(symbol) {
      return (this.$store.state.allSymbols.find((x) => x.possibleNames.any((y) => y == symbol.symbolCode)).src).replace('png', 'svg');
    },
    sort(child, fnc) {
      var thEls = Array.from(child.$el.parentNode.children);
      var ths = this.$children.filter(f => f !== child && thEls.indexOf(f.$el) > -1);
      ths.forEach(f => f.reset());
      this.selectedPage = 1;
      this.sortFnc = fnc;
    },
    showSelectFilter(prop) {
      return prop != null && this.selectFilterProps != null && this.selectFilterProps.includes(prop);

    },
    getHeadChildren() {
      var els = getAllChildrens(this.$refs.head).filter(f => f.tagName === 'TH');
      return propToBool(this.noAccordion) ? this.$children.mapMany(f => f.$children).filter(f => els.indexOf(f.$el) > -1) : this.$children.filter(f => els.indexOf(f.$el) > -1);
    },
    getExcelHeaders() {
      var headers = this.getHeadChildren().filter(f => !(this.hiddenColumns || []).includes(f.name)).groupBy(f => f.$el.parentNode);
      return headers.map(header => header.items.filter((cell, ind) => headers.any(h => h.items[ind].exportFnc)));
    },
    excelHeaders() {
      var children = this.getExcelHeaders();
      return children.map(f => f.map(g => g.excelTitle || g.$el.innerText));
    },
    excelDataFnc(data) {
      var children = this.getExcelHeaders();
      var excelData = data.mapMany(dat => children.mapMany(child => {
        var row = child.map(ch => (ch.exportFnc || (() => null))(dat));
        if (!Array.isArray(row[0]))
          return [row];
        else {
          return (1).rangeTo(row[0].length).map((_, ind) => row.map(f => (f || [])[ind]));
        }
      }));

      return excelData;
    },
		exportToExcel() {
			var headers = JSON.stringify(this.excelHeaders());
			var title = propToBool(this.excelTitle) === true ? nodeNamePath(this.sideTree.getSelectedNode()) : this.excelTitle;
			var message = this.getTranslation('I00.00048970', 'Please wait while the document is being created.');
			var excelData = [
				{
					headers: headers,
					data: this.excelDataFnc(this.sortedData),
					title: title
				}
			];

			this.exportDisabled = true;
      // call func from exportToExcel.js
			exportAllToExcel(
				excelData.map(f => f.headers),
				excelData.map(f => JSON.stringify(f.data)),
				excelData.map(f => f.title),
				message
			).then(() => (this.exportDisabled = false));
		},
    calculateFilteredData() {
      if (this.tableData) {
        this.selectedPage = 1;
        if (this.searchText || this.showColumnSearch) {
          var subSearches = this.subSearches.filter(f => f && f.text);

          var propFncs = this.hiddenColumns ? this.getHeadChildren().filter(x => !this.hiddenColumns.includes(x.name)).filter(f => f.prop)
            .map(f => propToFnc(f.prop)) : this.getHeadChildren().filter(f => f.prop).map(f => propToFnc(f.prop));
          this.filteredData = this.tableData.filter(f => {
            var bln = true;
            if (this.searchText) {
              var searchText = this.searchText.toLowerCase();
              bln = propFncs.find(propFnc => {
                var dat = propFnc(f);
                //console.log(dat);
                return dat && dat.toString().toLowerCase().indexOf(searchText) > -1;
              }) != null;
            }

            if (bln && this.showColumnSearch) {
              bln = subSearches.all(sub => {
                var dat = sub.fnc(f) || sub.fnc(f.additionalData ? f.additionalData : f) || sub.fnc(f.substances ? f.substances : f);
                if (Array.isArray(dat)) {
                  switch (sub.item.prop) {
                    case "usageAmount":
                      dat = dat.map(x => x.value.split('.').first() + x.unit).toString()
                      break;
                    case "pictograms":
                      var datArray = dat.map(x => x.value.toLowerCase());
                      var allSymbols = this.appSettings.allSymbols;
                      dat = datArray.map(f => (allSymbols.find(x => x.possibleNames.any(y => y == f)) || {}).descriptionTranslation).find(g => g == sub.text);
                      break;
                  }
                }
                //console.log(dat);
                return !sub.isFromDropDownFilter ? dat && dat.toString().toLowerCase().indexOf(sub.text.toLowerCase()) > -1 : dat && dat.toString().indexOf(sub.text) > -1;
              });
            }
            //console.log(bln);
            return bln;
          });
        }
        else
          this.filteredData = this.tableData;
      } else {
        this.filteredData = [];
      }
    },
    toggleSubSearch() {
      this.showColumnSearch = !this.showColumnSearch;
      if (!this.showColumnSearch) {
        this.calculateFilteredData();
        this.$store.state.subSearches = this.$store.state.subSearches.reduce((p, c) => (c.orgId !== this.orgId && p.push(c), p), []);
      }
    },
    findSubSearch(item) {
      return this.subSearches.find(f => f.item === item);
    },
    fillFilters() {
      var filters = this.customFilters;
      if (this.$route.params.tab == 'departments')
        filters = this.customFilters.filter((cf) => cf.orgId == this.orgId);

      filters.forEach(f => {
        var item = this.firstHeadChildren.find(el => {
          return f.name == el.name;
        });
        if (item)
          this.changeSubSearch(item, f.text);
      });
      if (this.subSearches.length)
        this.showColumnSearch = true;
    },
    changeSubSearch(item, text, isFromDropDownFilter) {
      var ch = this.findSubSearch(item);
      if (!ch) {
        ch = { orgId: this.orgId, item: item, fnc: propToFnc(item.prop) };
        this.$store.state.subSearches.push(ch);
      }

      ch.text = text;
      ch.isFromDropDownFilter = isFromDropDownFilter;
      this.calculateFilteredData();

      var options = [];
      this.$store.getters.state.subSearches.forEach((f) => {
        if (f.text != '')
          options.push({ name: f.item.name, text: f.text });
      });
      var filledOptions = [];
      this.$store.getters.state.filledSubSearches.forEach((f) => {
        filledOptions.push({ name: f.name, text: f.text });
      });
      this.filterChanged = (hashCode(options) !== hashCode(filledOptions))
      this.$emit('filteredTableData', this.filteredData);
      this.$emit('filterChanged', this.filterChanged);
      this.$nextTick(() => this.calculateFilteredData());
    },
    toggleColumn(name, show) {
      this.$emit('hide-columns', this.hiddenColumns.toggle(name, show));
    },
    toggleIsEditing() {
      this.isEditing = !this.isEditing;
      this.getHeadChildren().forEach(f => f.isEditing = this.isEditing);
      this.toggleBodyColumns();
    },
    toggleBodyColumns() {
      var notDestroyedChildrens = this.firstHeadChildren.filter(f => !f._isDestroyed);
      Array.from(this.$refs.body.children)
        .filter(f => f.tagName === 'TR')
        .forEach(f => Array.from(f.children)
          .forEach((g, ind) => {
            g.classList.remove('hiddenColumn');
            if (!this.isEditing && this.hiddenColumns.includes((notDestroyedChildrens[ind] || {}).name))
              g.classList.add('hiddenColumn');
          }));
    },
    propToBool: propToBool,
  },
  computed: {
    subSearches() {
      return this.$store == null || this.$store.getters.state.subSearches.filter((f) => f.orgId == this.orgId);
    },
    pagedData() {
      var page = this.selectedPage;
      var from = (page - 1) * this.perPage;
      var to = page * this.perPage;
      return this.sortedData.filter((f, ind) => ind >= from && ind < to);
    },
    hasPagination() {
      return this.sortedData.length > this.perPage;
    },
    hasSearchBoxWithPagination() {
      return !propToBool(this.noSearch) || this.hasPagination;
    },
    firstHeadChildren() {
      return getAllChildrens(this.$refs.head)
        .filter(f => f.tagName === 'TH' && ['none'].indexOf(window.getComputedStyle(f, null).display) === -1)
        .groupBy(f => f.parentNode).first().items
        .map(f => this.$children.find(ch => ch.$el === f));
    },
    secondHeadChildren() {
      return getAllChildrens(this.$refs.head)
        .filter(f => f.tagName === 'TH' && ['none'].indexOf(window.getComputedStyle(f, null).display) === -1)
        .groupBy(f => f.parentNode)[1].items
        .map(f => this.$children.find(ch => ch.$el === f));
    },
    showEdit() {
      return this.$listeners.edit;
    },
  },
  watch: {
    sortFnc() {
      this.sortedData = this.sortFnc(this.filteredData);
      this.$emit('sortedData', this.sortedData);
    },
    filteredData() {
      this.sortedData = this.sortFnc(this.filteredData);
      this.$emit('sortedData', this.sortedData);
    },
    tableData() {
      this.calculateFilteredData();
    },
    searchText() {
      this.calculateFilteredData();
    },
    customFilters() { this.fillFilters(); },
    subSearches() { this.calculateFilteredData(); },
    perPage() {
      this.selectedPage = 1;
    }
  },
  mounted() {
    if (this.$store)
      this.$store.state.subSearches = [];

    if (this.customFilters) {
      var filters = [];
      if (this.$route.query.id) {
        var report = this.$store.getters.state.customReports.find(f => f.id == this.$route.query.id);

        report.filterObject.filterQuery.forEach((f) => {
          filters.push({ name: f.name, text: f.text });
        });
      }
      this.$store.state.filledSubSearches = filters;

      this.fillFilters();
      var options = [];
      this.$store.getters.state.subSearches.forEach((f) => {
        options.push({ name: f.item.name, text: f.text });
      });
    }
		this.getTranslation('I00.00048970', 'Please wait while the document is being created.');
    if (process.env.NODE_ENV === 'development') window['thisDataTable'] = this;
    this.calculateFilteredData();
    this.$emit('filteredTableData', this.filteredData);
  },
  updated() {
    if (this.tableData.length && !this.firstHeadChildrenProps) {
      this.firstHeadChildrenProps = this.firstHeadChildren
        .map(f => (f && f.prop) != null);
      this.firstHeadChildrenPropNames = this.firstHeadChildren
        .map(f => (f && f.prop));
      if (propToBool(this.secondHeaderFilter)) {
        this.secondHeadChildrenProps = this.secondHeadChildren
          .map(f => (f && f.prop) != null);
        this.secondHeadChildrenPropNames = this.secondHeadChildren
          .map(f => (f && f.prop));
      }
    }

    if (this.hiddenColumns && this.tableData.length) {
      this.toggleBodyColumns();
      this.getHeadChildren().forEach(f => f.hiddenColumns = this.hiddenColumns);
    }
  },
}
</script>