<template>
	<Accordion :text="getTranslation('I00.00013050', 'Products')" v-model="productsOpened" @input="saveToStorage($event)">
		<SmallLoader @mounted="getProducts" v-if="!productsData" />
		<DataTable :tableData="productsData" :excelTitle="excelTitle" :perPage="perPage" noHeader accordion v-else>
			<template #head>
				<tr>
					<Th class="IconColumn HideOnPrint skipForSorting ignoreInExportToExcel"></Th>
					<Th class="prodNo" prop="artNo" name="artNo" sort export>{{ getTranslation('I00.00015350', 'Product number') }}</Th>
					<Th prop="name" name="name" sort export defaultSort>{{ getTranslation('I00.00006920', 'Product name') }}</Th>
					<Th class="width20 skipForSorting" prop="supplier" name="supplier" sort export>{{ getTranslation('I00.00004110', 'Supplier') }}</Th>
					<Th class="dangerSymbol" :export="imageResult">{{ getTranslation('I00.00006610', 'Danger symbols') }}</Th>
					<Th class="width15" prop="productType" name="productType" sort export v-if="appSettings.showProductTypeOnDepartments">{{ getTranslation('I00.00012550', 'Product type') }}</Th>
					<Th class="IconColumn" sort export v-if="!appSettings.hideTrafficLight">{{ getTranslation('I00.00049950', 'Trafic lights') }}</Th>
				</tr>
			</template>
			<template #body="{ item }">
				<tr>
					<td class="IconColumn HideOnPrint">
						<img :src="appSettings.imageFolder + item.imagePath" alt="" />
					</td>
					<td class="prodNo">
						<a :href="item.link">{{ item.artNo }}</a>
					</td>
					<td>
						<a :href="item.link">{{ item.name }}</a>
					</td>
					<td class="width20">
						<span>{{ item.supplier }}</span>
					</td>
					<td class="dangerSymbol wrap">
						<DangerSymbols :dat="item" />
					</td>
					<td class="width15" v-if="appSettings.showProductTypeOnDepartments">
						<span>{{ item.productType }}</span>
					</td>
					<td class="IconColumn" v-if="!appSettings.hideTrafficLight">
						<span class="trafficLight middled" :class="getTrafficClass(item.statusValue)" :title="item.status"></span>
					</td>
				</tr>
			</template>
		</DataTable>
	</Accordion>
</template>

<script>
import DataTable from '../../components/common/dataTable/DataTable_v3';
import DangerSymbols from '../../components/riskAssessment/DangerSymbols_V3';
import Th from '../../components/common/dataTable/Th_v3';
import Accordion from '../../components/common/accordion/Accordion_v3';
import SmallLoader from '../../components/common/loaders/SmallLoader_v3';
import axios from '../../axios';
import { camelCaseObj, errorDebug, tryParse } from '../../libraries/common';
import { genericDangerSymbolsResult } from '../../libraries/exportToExcel_v3';
import { getDangerSymbols } from '../../libraries/reports';


export default {
  components: {
    DataTable,
    Th,
    Accordion,
    SmallLoader,
    DangerSymbols
  },
  data() {
    return {
      productsOpened: false,
      productsData: null,
      iconClass: {
        '0': 'gray',
        '1': 'green',
        '2': 'yellow',
        '3': 'red',
        '4': 'yellow',
      }
    }
  },
  props: ['excelTitle', 'perPage'],
  methods: {
    getProducts() {
      var node = window.SideTree.GetSelectedNode();
      return axios.postWithCancelToken('/Departments/GetProducts', { orgid: node.KeyID, org_mdbid: node.KeyID_mdbID })
        .then(response => {
          this.productsData = camelCaseObj(JSON.parse(response.data));
        })
        .catch(errorDebug);
    },
    saveToStorage(event) {
      var sectionsLocalStorage = tryParse(localStorage.getItem('DepartmentHiddenBoxes')) || {};
      sectionsLocalStorage['productsBox'] = !event;
      localStorage.setItem('DepartmentHiddenBoxes', JSON.stringify(sectionsLocalStorage));
    },
    getTrafficClass(value) {
      return (this.iconClass[value] || this.iconClass[0]);
    },
    imageResult(item) {
      return genericDangerSymbolsResult(['vattenfallDangerSymbols', 'oldLawNotVattenfallDangerSymbols', 'newLawDangerSymbols'], item);
    },
    getDangerSymbols: getDangerSymbols,
  },
  mounted() {
    var sectionsLocalStorage = tryParse(localStorage.getItem('DepartmentHiddenBoxes')) || {};
    this.productsOpened = !sectionsLocalStorage['productsBox'];
  },
};
</script>