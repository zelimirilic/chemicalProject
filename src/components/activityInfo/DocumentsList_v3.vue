<template>
	<Accordion :text="getTranslation('I00.00013090', 'Documents')" v-model="documentsOpened" @input="saveToStorage($event)">
		<SmallLoader @mounted="getDocuments" v-if="!documentsData" />
		<DataTable :tableData="documentsData" :excelTitle="excelTitle" :perPage="perPage" noHeader accordion v-else>
			<template #head>
				<tr>
					<Th class="IconColumn HideOnPrint skipForSorting ignoreInExportToExcel"></Th>
					<Th prop="linkName" name="linkName" sort export defaultSort>{{ getTranslation('I00.00013360', 'Document') }}</Th>
					<Th prop="departmentPathName" name="departmentPathName" sort export>{{ getTranslation('I00.00002940', 'Department') }}</Th>
					<Th class="IconColumn skipForSorting ignoreInExportToExcel"></Th>
				</tr>
			</template>
			<template #body="{ item }">
				<tr>
					<td class="IconColumn HideOnPrint">
						<img :src="appSettings.imageFolder + 'icons/icon-koppdoc.gif'" alt="" />
					</td>
					<td>
						<a :href="item.link">{{ item.linkName }}</a>
					</td>
					<td>
						<HoverElement>
							{{ item.departmentPathName }}
							<template #hover>{{ findNodeNamePath(item.departmentPathName) }}</template>
						</HoverElement>
					</td>
					<td class="IconColumn" v-html="item.languageImage"></td>
				</tr>
			</template>
		</DataTable>
	</Accordion>
</template>

<script>
import DataTable from '../../components/common/dataTable/DataTable_v3';
import Th from '../../components/common/dataTable/Th_v3';
import HoverElement from '../../components/common/others/HoverElement_v3';
import Accordion from '../../components/common/accordion/Accordion_v3';
import SmallLoader from '../../components/common/loaders/SmallLoader_v3';
import axios from '../../axios';
import { camelCaseObj, errorDebug, tryParse } from '../../libraries/common';


export default {
  components: {
    DataTable,
    Th,
    HoverElement,
    Accordion,
    SmallLoader
  },
  data() {
    return {
      documentsOpened: false,
      documentsData: null
    }
  },
  props: ['excelTitle', 'perPage'],
  methods: {
    getDocuments() {
      var node = window.SideTree.GetSelectedNode();
      return axios.postWithCancelToken('/Departments/GetDocumentsList', { org_id: node.KeyID, org_mdbid: node.KeyID_mdbID })
        .then(response => {
          this.documentsData = camelCaseObj(response.data);
        })
        .catch(errorDebug);
    },
    saveToStorage(event) {
      var sectionsLocalStorage = tryParse(localStorage.getItem('DepartmentHiddenBoxes')) || {};
      sectionsLocalStorage['documentsBox'] = !event;
      localStorage.setItem('DepartmentHiddenBoxes', JSON.stringify(sectionsLocalStorage));
    },
    findNodeNamePath(data) {
      return data.split('\\').last().trim();
    }
  },
  mounted() {
    var sectionsLocalStorage = tryParse(localStorage.getItem('DepartmentHiddenBoxes')) || {};
    this.documentsOpened = !sectionsLocalStorage['documentsBox'];
  },
};
</script>