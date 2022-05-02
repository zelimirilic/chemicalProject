<template>
	<TabsWithMenu class="card pageWrapper" :value="selectedIndex" :tabs="tabs" @input="tabChanged">
		<template #menu>
			<span class="icons icon-plus" @click="$emit('addProduct')" v-tooltip="getTranslation('I00.00010750', 'Add product')" v-if="showAddProduct"></span>
      <span class="icons icon-excel" :class="{ disabled: prodData == null || exportAllDisabled }" @click="exportAllToExcel()" :title="getTranslation('I00.00045690', 'Export All')" v-if="selectedIndex === 1"></span>
			<template v-if="appSettings.useReportsAdditionalColumns && selectedColumns">
				<span class="icons icon-columns" :class="{ disabledTooltip: !($store.getters.state.reportsAdditionalColumns || []).length }" @click="($store.getters.state.reportsAdditionalColumns || []).length ? (showAdditionalColumns = true) : ''" v-tooltip="getTranslation('I00.00048130', 'Add columns')"></span>
				<span class="icons icon-save" :class="{ disabledTooltip: disableSaveOnFireAndADR || !isReportChanged }" @click="!disableSaveOnFireAndADR ? (customReport ? saveCustomReport(customReport) : modalOpen()) : ''" v-tooltip="getTranslation('I00.00004810', 'Save')"></span>
				<span class="icons icon-saveas" @click="modalOpen()" v-tooltip="getTranslation('I00.00047590', 'Save as')"></span>
				<span v-if="isForDelete" class="icons icon-delete" @click="showDeleteCustomReport = true" v-tooltip="getTranslation('I00.00054690', 'Delete custom report')"></span>
			</template>
		</template>
		<slot name="filterSlot"></slot>
		<template v-if="prodData && !isSaving">
			<slot :item="item" :excelTitle="nodeNamePath(item.department)" :index="ind" v-for="(item, ind) in prodData.take(displayedTables)"></slot>
			<slot :item="{ products: [] }" v-if="!prodData.length"></slot>
		</template>
		<div v-infinite-scroll="loadMore">
			<SmallLoader v-if="prodData == null || prodData.length > displayedTables || isSaving" />
		</div>
		<slot name="otherSlot"></slot>
		<ModalDialog additional-class="wp-400" :title="getTranslation('I00.00048420', 'Select additional columns')" hideClose v-if="showAdditionalColumns">
			<AdditionalColumnsPicker :value="selectedColumns" @input="columnsChanged" @cancel="showAdditionalColumns = false" />
		</ModalDialog>
		<ModalDialog additional-class="wp-400" :title="getTranslation('I00.00047610', 'Save custom filter')" hideClose v-if="showSaveCustomReport">
			<SaveCustomReport @input="saveCustomReport" @cancel="modalClose()" />
		</ModalDialog>
		<ModalDialog additional-class="wp-400" :title="titleForDelete()" hideClose v-if="showDeleteCustomReport">
			<SmallLoader v-if="isDeleting" />
			<template v-else>
				<p>{{ getTranslation('I00.00054700', 'Are you sure you want to delete this report?') }}</p>
				<div class="pt-4 text-right">
					<ButtonOk @click="deleteCustomReport" />
					<ButtonCancel @click="showDeleteCustomReport = false" />
				</div>
			</template>
		</ModalDialog>
	</TabsWithMenu>
</template>

<script>
import TabsWithMenu from '../common/tabs/TabsWithMenu';
import AdditionalColumnsPicker from './components/AdditionalColumnsPicker';
import SaveCustomReport from './components/SaveCustomReport';
import { nodeNameWithParent, nodeNamePath } from '../../libraries/tree';
import { getAllChildren } from '../../libraries/vue';
import { exportAllToExcel } from '../../libraries/exportToExcel';
import axios from '../../axios';
import { ticker, errorDebug, camelCaseObj, idsAreEqual, deepClone, hashCode } from '../../libraries/common';

export default {
  components: {
    TabsWithMenu,
    AdditionalColumnsPicker,
    SaveCustomReport,
  },
  props: ['prodData', 'selectedColumns', 'hiddenColumns', 'filterChangedValue'],
  data() {
    return {
      displayedTables: 0,
      fetchOptions: ['singlenode', 'withchildren', 'addnodes'],
      tabLinks: ['department', 'departments', 'summary'],
      exportAllDisabled: false,
      showAdditionalColumns: false,
      showSaveCustomReport: false,
      showDeleteCustomReport: false,
      isSaving: false,
      reportRoute: null,
      isDeleting: false
    };
  },
  methods: {
    loadAdditionalColumns() {
      this.$store.getters.state.reportsAdditionalColumns = [];
      axios.post('/OrgProdList/GetAdditionalColumns')
        .then(reponse => this.$store.getters.state.reportsAdditionalColumns = camelCaseObj(reponse.data).map(f => ({
          ...f,
          name: f.name.camelCase(),
          type: f.type.camelCase(),
        })));
    },
    modalOpen() {
      this.showSaveCustomReport = true;
      this.$store.state.modalTreeFlag = true;
    },
    modalClose() {
      this.showSaveCustomReport = false;
      this.$store.state.modalTreeFlag = false;
    },
    nodeSelected() {
      this.tabChanged(this.selectedIndex);
      this.emitChange();
      this.loadAdditionalColumns();
    },
    titleForDelete() {
      return this.customReport ? this.getTranslation('I00.00054690', 'Delete custom report') + ': ' + this.customReport.filterName : "";
    },
    tabChanged(event) {
      if (this.tabLinks[event] !== this.$route.params.tab)
        this.$router.replace({ name: this.$route.name, params: { tab: this.tabLinks[event] }, query: { ...(this.$route.query || {}) } });
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
    },
		exportAllToExcel() {
			var dts = this.getAllDataTables();

			var headers = JSON.stringify(dts[0].excelHeaders());
			var message = this.getTranslation('I00.00048970', 'Please wait while the document is being created.');
			var excelData = dts
				.map(dt => ({
					headers: headers,
					data: dt.excelDataFnc(dt.sortedData),
					title: dt.excelTitle
				}))
				.pushMany(
					this.prodData.takeFromTo(dts.length, this.prodData.length).map(data => ({
						headers: headers,
						data: dts[0].excelDataFnc(data.products),
						title: nodeNamePath(data.department)
					}))
				);

			this.exportAllDisabled = true;
      // call func from exportToExcel.js
			exportAllToExcel(
				excelData.map(f => f.headers),
				excelData.map(f => JSON.stringify(f.data)),
				excelData.map(f => f.title),
				message
			).then(() => (this.exportAllDisabled = false));
		},
    columnsChanged(event) {
      this.showAdditionalColumns = false;
      this.$emit('columnsChanged', event);
    },
    deleteCustomReport() {
      this.isDeleting = true;
      var customReportId = this.customReport.id;
      axios.post('/OrgProdList/DeleteFilterQuery', { deleteFilter: { ID: customReportId } })
        .then(response => {
          if (response.data) {
            this.$store.state.deleteReportFlag = true;
            this.$router.replace({ name: this.$route.name, params: { ...this.$route.params } });
            this.reportRoute = this.$route;
            this.emitColumns();
            this.$store.getters.state.customReports = this.$store.getters.state.customReports.filter(x => x.id != customReportId);
            ticker.addInfoMessage(this.getTranslation('I00.00054710', 'Successfully deleted report.'));
          } else {
            ticker.addWarningMessage(this.getTranslation('I00.00054720', 'Deleted action failed!'));
          }
        })
        .catch(errorDebug)
        .then(() => { this.showDeleteCustomReport = false; this.isDeleting = false; this.$store.state.deleteReportFlag = false; });

    },
    saveCustomReport(report) {
      var options = [];
      this.$store.getters.state.subSearches.forEach((f) => {
        options.push({ name: f.item.name, text: f.text, orgId: f.orgId });
      });

      this.isSaving = true;
      this.showSaveCustomReport = false;
      this.$store.state.modalTreeFlag = false;
      this.$store.state.savedNewReportFlag = false;
      var saveObj = {
        ...report,
        filterObject: JSON.stringify({
          route: {
            name: this.$route.name,
            params: this.$route.params,
          },
          filterQuery: options
        }),
        // options: JSON.stringify(options),
        additionalColumns: JSON.stringify(this.selectedColumns),
        hiddenColumns: JSON.stringify(this.hiddenColumns),
      };
      axios.post('/OrgProdList/SaveFilterQuery', { saveObj: saveObj })
        .then(response => {
          this.isSaving = false;
          if (!response.data.saved) {
            ticker.addWarningMessage(this.getTranslation('I00.00053850', 'A report with that name already exists, please enter a different name'));
          } else {
            this.$store.state.savedNewReportFlag = true;
            ticker.addInfoMessage(this.getTranslation('I00.00047810', 'The filter is saved.'));
            var data = camelCaseObj(response.data.filterData);
            var report = camelCaseObj({
              ...data,
              additionalColumns: JSON.parse(data.additionalColumns || 'null'),
              hiddenColumns: JSON.parse(data.hiddenColumns || 'null'),
              options: JSON.parse(data.options || 'null'),
              filterObject: JSON.parse(data.filterObject),
              department: data.department != null ? this.sideTree.getAllData().find(f => idsAreEqual(f.item.orgID, data.department.orgID)) : null,
            });

            if (this.$route.query.id != report.id) {
              this.$router.replace({ name: this.$route.name, params: { ...this.$route.params }, query: { id: report.id } });
              this.$store.getters.state.customReports.push(report);
              this.reportRoute = this.$route;
            } else {
              var existingReport = this.$store.getters.state.customReports.find(f => f.id === report.id);
              Object.assign(existingReport, report);
              this.$store.state.savedNewReportFlag = false;
            }

            this.$store.state.subSearches = [];
            this.$store.state.filledSubSearches = this.$store.state.subSearches;
            this.$emit('fillFilters', report.filterObject.filterQuery);
          }
        })
        .catch(errorDebug);
    },
    emitColumns() {
      if (!this.$route.query.id) {
        this.$emit('columnsChanged', []);
        this.$emit('hide-columns', []);
      } else {
        var report = deepClone(this.$store.getters.state.customReports.find(f => f.id == this.$route.query.id));
        this.$emit('columnsChanged', report.additionalColumns);
        if (report.filterObject.filterQuery)
          this.$emit('fillFilters', report.filterObject.filterQuery);
        if (report.hiddenColumns)
          this.$emit('hide-columns', report.hiddenColumns);
      }
    }
  },
  computed: {
    tabs() {
      return [this.getTranslation('I00.00008460', 'Selected dep.'), this.getTranslation('I00.00007150', 'Departments'), this.getTranslation('I00.00007050', 'Summarise')];
    },
    selectedIndex() {
      return Math.max(this.tabLinks.indexOf(this.$route.params.tab), 0);
    },
    showAddProduct() {
      return this.$listeners.addProduct;
    },
    customReport() {
      return this.$store.getters.state.customReports.find(f => f.id == (this.$route.query || {}).id);
    },
    isForDelete() {
      return this.customReport ? this.customReport.isEditable : false;
    },
    disableSaveOnFireAndADR() {
      if (!this.$route.fullPath.includes('id'))
        return true;

      return false;
    },
    isReportChanged() {
      var isChanged = false;
      if (this.$route.query.id) {

        var options = [];
        this.$store.getters.state.subSearches.forEach((f) => {
          options.push({ name: f.item.name, text: f.text });
        });
        var report = this.$store.getters.state.customReports.find(f => f.id == this.$route.query.id);
        var filters = [];
        report.filterObject.filterQuery.forEach((f) => {
          filters.push({ name: f.name, text: f.text });
        });

        isChanged = (hashCode([report.additionalColumns.map(f => ({ id: f.id, name: f.name })), report.hiddenColumns]) !== hashCode([this.selectedColumns.map(f => ({ id: f.id, name: f.name })), this.hiddenColumns])
          || this.filterChangedValue);
      } else
        isChanged = this.selectedColumns ? (this.selectedColumns.concat(this.hiddenColumns).length || this.filterChangedValue) : false;

      return isChanged
    },
    subSearches() {
      return this.$store == null || this.$store.getters.state.subSearches.filter((f) => f.orgId == this.orgId);
    },
  },
  watch: {
    '$route.params.tab'() {
      this.emitChange();
    },
    '$route.query.id'() {
      this.emitColumns();
    },
    isReportChanged() {
      this.$store.getters.state.saveStatus = this.isReportChanged;
      if (this.$route.query.id && this.isReportChanged) this.$store.state.savedNewReportFlag = false;
    }
  },
  beforeMount() {
    this.getTranslation('I00.00047810', 'The filter is saved.');
    this.getTranslation('I00.00053850', 'A report with that name already exists, please enter a different name');
  },
  mounted() {
    this.reportRoute = this.$route;
    this.$store.getters.state.saveStatus = false;
  },
  translationsLoaded() {
    if (process.env.NODE_ENV === 'development') window['thisReports'] = this;
    if (this.$route.query.id)
      this.emitColumns()

    this.emitChange();
    this.loadAdditionalColumns();

    if (!this.$store.getters.state.allDefinedSymbols) {
      this.$store.getters.state.allDefinedSymbols = [];
      axios.get('/OrgProdList/GetAllDefinedSymbols')
        .then(response => {
          var data = response.data.map(f => ({
            ...f,
            src: f.imageURL,
          }));
          this.$store.getters.state.allDefinedSymbols = data;
          this.$store.getters.state.ghsPictograms = data.filter(f => f.symbolRaV3Value.startsWith('ghs'));
          this.$store.getters.state.kifPictograms = data.filter(f => !f.symbolRaV3Value.startsWith('ghs'));
        });
    }
  }
};
</script>
