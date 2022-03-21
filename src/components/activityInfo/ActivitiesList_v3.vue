<template>
	<Accordion :text="getTranslation('I00.00025640', 'Activities')" v-model="activitiesOpened" @input="saveToStorage($event)">
		<SmallLoader @mounted="getActivities" v-if="!activitiesData" />
		<DataTable :tableData="activitiesData" :excelTitle="excelTitle" :perPage="perPage" noHeader accordion v-else>
			<template #head>
				<tr>
					<Th class="IconColumn HideOnPrint skipForSorting ignoreInExportToExcel"></Th>
					<Th class="width15" prop="name" name="name" sort export>{{ getTranslation('I00.00025650', 'Activity') }}</Th>
					<Th class="width25" prop="productNames" name="productNames" sort :export="exportToExcel.joinByNewLine('productNames')" defaultSort>{{ getTranslation('I00.00013050', 'Products') }}</Th>
					<Th class="width20 skipForSorting" prop="additionalRiskSourceName" name="additionalRiskSourceName" sort export>{{ getTranslation('I00.00021860', 'RiskSources') }}</Th>
					<Th class="dangerSymbol skipForSorting" :export="imageResult">{{ getTranslation('I00.00006610', 'Danger symbols') }}</Th>
					<Th class="width10" prop="risk" name="risk" sort export>{{ getTranslation('I00.00006170', 'Risk') }}</Th>
					<Th class="width15" prop="nodeNamePath" name="nodeNamePath" sort export>{{ getTranslation('I00.00026380', 'Department') }}</Th>
				</tr>
			</template>
			<template #body="{ item }">
				<tr>
					<td class="IconColumn HideOnPrint">
						<img :src="appSettings.imageFolder + item.imagePath" alt="" />
					</td>
					<td class="width15">
						<a :href="item.link">{{ item.name }}</a>
					</td>
					<td class="width25">
						<div class="d-flex prodLst AmountRow" v-for="(prodName, index) in getArticles(item.productNames)" :key="index">
							<div class="mb-1">
								<a :href="item.link">{{ prodName }}</a>
							</div>
						</div>
						<p class="moreInfo icon-details" v-if="item.productNames.length > 3" @click="toggleAllProducts(item.productNames)"></p>
					</td>
					<td class="width20">
						<a :href="item.link">{{ getAdditionalRiskSourceName(item.additionalRiskSourceName) }}</a>
					</td>
					<td class="dangerSymbol">
						<DangerSymbols :dat="item" />
					</td>
					<td class="width10 wrap">
						<span>{{ item.risk }}</span>
					</td>
					<td class="width15">
						<HoverElement>
							{{ item.nodeNamePath }}
							<template #hover>{{ findNodeNamePath(item.nodeNamePath) }}</template>
						</HoverElement>
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
import HoverElement from '../../components/common/others/HoverElement_v3';
import Accordion from '../../components/common/accordion/Accordion_v3';
import SmallLoader from '../../components/common/loaders/SmallLoader_v3';
import axios from '../../axios';
import { camelCaseObj, errorDebug, isNullOrEmpty, tryParse } from '../../libraries/common';
import { genericDangerSymbolsResult } from '../../libraries/exportToExcel_v3';
import { getDangerSymbols } from '../../libraries/reports';


export default {
  components: {
    DataTable,
    Th,
    HoverElement,
    Accordion,
    SmallLoader,
    DangerSymbols
  },
  data() {
    return {
      activitiesOpened: false,
      activitiesData: null,
    }
  },
  props: ['excelTitle', 'perPage'],
  methods: {
    getActivities() {
      var node = window.SideTree.GetSelectedNode();
      return axios.postWithCancelToken('/Departments/GetActivitiesList', { org_id: node.KeyID, org_mdbid: node.KeyID_mdbID })
        .then(response => {
          this.activitiesData = camelCaseObj(response.data);
        })
        .catch(errorDebug);
    },
    saveToStorage(event) {
      var sectionsLocalStorage = tryParse(localStorage.getItem('DepartmentHiddenBoxes')) || {};
      sectionsLocalStorage['activitiesBox'] = !event;
      localStorage.setItem('DepartmentHiddenBoxes', JSON.stringify(sectionsLocalStorage));
    },
    getAdditionalRiskSourceName(value) {
      return !isNullOrEmpty(value) ? value : "-";
    },
    findNodeNamePath(data) {
      return data.split('\\').last().trim();
    },
    getArticles(item) {
      return item.filter(function (f, ind) { return item.opened || ind < 3; });
    },
    toggleAllProducts: function (item) {
      this.$set(item, 'opened', !item.opened);
    },
    imageResult(item) {
      return genericDangerSymbolsResult(['vattenfallDangerSymbols', 'oldLawNotVattenfallDangerSymbols', 'newLawDangerSymbols'], item);
    },
    getDangerSymbols: getDangerSymbols,
  },
  mounted() {
    var sectionsLocalStorage = tryParse(localStorage.getItem('DepartmentHiddenBoxes')) || {};
    this.activitiesOpened = !sectionsLocalStorage['activitiesBox'];
  },
};
</script>