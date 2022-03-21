<template>
	<div class="mainGrayBox">
		<div class="mhp-20" v-if="tableData == null">
			<!-- <Animation /> -->
		</div>
		<template v-else>
			<template v-if="tableData.length">
				<div class="mainGrayBoxTtl d-flex align-items-center justify-content-center" v-if="!propToBool(noHeader)">
					<h5 class="">{{ title }}</h5>
					<a href="#:" class="icons excIcon excel-export-icon ml-auto HideOnPrint" v-if="!propToBool(accordion)" @click="exportToExcel()" :title="getTranslation('I00.00018680', 'Export to excel')"></a>
				</div>
				<div class="mainGrayBoxTbl">
					<div :class="tableWrapClass">
						<div class="d-flex align-items-center m-3" v-if="propToBool(showProtectionSymbols) && orgProtectionSymbols && orgProtectionSymbols.symbols.any()">
							<img class="iconSizeLarge xxlRightMargin" v-for="(arr, ind) in orgProtectionSymbols.symbols" :key="ind + arr" :src="getSymbol(arr)" :title="arr.symbolText" :alt="arr.symbolText" />
						</div>
						<div class="d-flex justify-content-between align-items-center mr-2 my-3" v-if="(hasPagination && !propToBool(noTopPagination)) || !propToBool(noSearch)">
							<Pagination v-model="selectedPage" :dat="sortedData" :perPage="perPage" v-if="hasPagination && !propToBool(noTopPagination)" />
							<div class="d-flex align-items-center ml-auto" v-if="hasSearchBoxWithPagination">
								<template v-if="!propToBool(noSearch)">
									<div class="input-group widthPx300 roundedInpWrap searchWrap small" alwaysOn>
										<input type="text" class="form-control" :placeholder="getTranslation('I00.00008990', 'Search all fields')" v-model="searchText" @input="selectedPage = 1" alwaysOn />
										<button class="input-group-append" @click="searchText = ''"><span class="input-group-text icon-delete small"></span></button>
									</div>
									<div class="ml-5">
										<!-- <span class="icons" :class="{ 'icon-columnedit': !isEditing, 'icon-columncheck': isEditing }" @click="toggleIsEditing" v-if="this.hiddenColumns" />
										<button class="btn icons icon-filter" :class="{ active: showColumnSearch }" type="button" @click="toggleSubSearch"></button>
										<a href="#:" class="icons excIcon excel-export-icon ml-4 HideOnPrint" v-if="propToBool(accordion)" @click="exportToExcel()" :title="getTranslation('I00.00018680', 'Export to excel')"></a> -->
										<template v-if="showEdit">
											<span class="icons icon-edit mr-3" @click="$emit('edit', !edit)" :title="getTranslation('I00.00006260', 'Edit')" v-if="!edit"></span>
											<template v-else>
												<span class="icons icon-restore mr-2" :title="getTranslation('I00.00026430', 'Restore')" @click="$emit('cancel')"></span>
												<span class="icons icon-save mr-3" :title="getTranslation('I00.00004810', 'Save')" @click="$emit('save')"></span>
											</template>
										</template>
										<!-- <span class="icons" :class="{ 'icon-columnedit': !isEditing, 'icon-columncheck': isEditing }" @click="toggleIsEditing" v-if="this.hiddenColumns" /> -->
										<button class="btn icons icon-filter mr-2" :class="{ active: showColumnSearch }" type="button" @click="toggleSubSearch"></button>
										<a href="#:" class="icons excIcon excel-export-icon ml-4 HideOnPrint" v-if="propToBool(accordion)" @click="exportToExcel()" :title="getTranslation('I00.00018680', 'Export to excel')"></a>
									</div>
								</template>
							</div>
						</div>

						<table class="ResultTable table dataTable" :class="tableClass">
							<thead ref="head">
								<slot name="head"></slot>
								<tr v-if="showColumnSearch">
									<th v-for="(item, ind) in firstHeadChildren" :key="ind" v-show="isEditing || !(hiddenColumns || []).includes((item || {}).name)">
										<div class="form-group m-0 lPaddingY">
											<Input class="form-control" :placeholder="(item || {}).placeholder" :value="(findSubSearch(item) || {}).text" @input="changeSubSearch(item, $event.target.value)" v-if="(firstHeadChildrenProps || [])[ind] && !showSelectFilter((firstHeadChildrenPropNames || [])[ind])" alwayson />
											<select class="form-control" :value="(findSubSearch(item) || {}).text" @input="changeSubSearch(item, $event.target.value)" v-if="(firstHeadChildrenProps || [])[ind] && showSelectFilter((firstHeadChildrenPropNames || [])[ind])">
												<option v-for="(x, ind) in selectFilterValues[(firstHeadChildrenPropNames || [])[ind]]" :key="ind" :value="x">{{ x }}</option>
											</select>
										</div>
									</th>
								</tr>
								<tr v-if="showColumnSearch && propToBool(secondHeaderFilter)">
									<th v-for="(item, ind) in secondHeadChildren" :key="ind" v-show="isEditing || !(hiddenColumns || []).includes((item || {}).name)">
										<div class="form-group m-0 lPaddingY">
											<Input class="form-control" :placeholder="(item || {}).placeholder" :value="(findSubSearch(item) || {}).text" @input="changeSubSearch(item, $event.target.value)" v-if="(secondHeadChildrenProps || [])[ind] && !showSelectFilter((secondHeadChildrenPropNames || [])[ind])" alwayson />
											<select class="form-control" :value="(findSubSearch(item) || {}).text" @input="changeSubSearch(item, $event.target.value)" v-if="(secondHeadChildrenProps || [])[ind] && showSelectFilter((secondHeadChildrenPropNames || [])[ind])">
												<option v-for="(x, ind) in selectFilterValues[(secondHeadChildrenPropNames || [])[ind]]" :key="ind" :value="x">{{ x }}</option>
											</select>
										</div>
									</th>
								</tr>
							</thead>
							<tbody ref="body">
								<slot name="body" :item="item" :index="tableData.indexOf(item)" v-for="item in pagedData"></slot>
							</tbody>
						</table>
						<div class="tableInfo d-flex align-items-center mr-2 my-3" v-if="!propToBool(noFooter) || hasPagination">
							<Pagination v-model="selectedPage" :dat="sortedData" :perPage="perPage" v-if="hasPagination" />
							<div class="ml-auto mr-2" v-if="!propToBool(noFooter)">
								<b>{{ getTranslation('I00.00007750', 'Number of items') }}: {{ sortedData.length }}</b>
							</div>
						</div>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="mainGrayBoxTtl d-flex align-items-center justify-content-center" v-if="!propToBool(noHeader) && title">
					<h5 class="">{{ title }}</h5>
				</div>
				<div class="tblWrap" :class="tableWrapClass">
					<table class="table table-hover dataTable" :class="tableClass" v-if="propToBool(showHeadersWhenEmpty)">
						<thead ref="head">
							<slot name="head"></slot>
						</thead>
					</table>
					<template v-if="isSearchResult">
						<template name="startSearchText" v-if="!hasOuterSearchWord">
							<div class="emptyTxt text-center p-4 centered xxxlPadding">
								<h3 class="mb-2 sBottomPadding">{{ getTranslation('I00.00055890', 'Start searching') }}</h3>
								<p class="mb-0">{{ getTranslation('I00.00055900', 'Please start a search above to select a product.') }}</p>
							</div>
						</template>
						<template name="noResultsText" v-else>
							<div class="emptyTxt text-center p-4 centered xxxlPadding">
								<h3 class="mb-2 sBottomPadding">{{ getTranslation('I00.00055700', 'No results found') }}</h3>
								<p class="mb-0">{{ getTranslation('I00.00055710', 'Please try searching with another term.') }}</p>
							</div>
						</template>
					</template>
					<template name="emptyTableText" v-else>
						<div class="emptyTxt text-center p-4 centered xxxlPadding">
							<h3 class="mb-2 sBottomPadding">{{ getTranslation('I00.00055680', 'No items found') }}</h3>
							<p class="mb-0">{{ getTranslation('I00.00055690', 'You don’t have any items here.') }}</p>
						</div>
					</template>
				</div>
			</template>
		</template>
	</div>
</template>

<script>
import DataTable from './DataTable';
import Pagination from './Pagination_v3';
//import { getAllChildrens } from '../../../libraries/common';
import { propToBool } from '../../../libraries/vue';

export default {
  extends: DataTable,
  name: 'DataTable',
  components: {
    Pagination,
  },
  methods: {
    // getHeadChildren() {
    //   var els = getAllChildrens(this.$refs.head).filter(f => f.tagName === 'TH');
    //   return this.$children.mapMany(f => f.$children).filter(f => els.indexOf(f.$el) > -1);
    // },
    // sort(child, fnc) {
    //   var thEls = Array.from(child.$el.parentNode.children);
    //   var ths = this.$children.mapMany(f => f.$children).filter(f => f !== child && thEls.indexOf(f.$el) > -1);
    //   ths.forEach(f => f.reset());
    //   this.selectedPage = 1;
    //   this.sortFnc = fnc;
    // },
    propToBool
  }
}
</script>