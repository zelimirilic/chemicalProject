<template>
	<Accordion v-if="sectionData" :text="getTranslation('I00.00025170', 'Contacts & responsibilities')" v-model="contactsOpened" @input="saveToStorage($event)">
		<DataTable :tableData="sectionData" :excelTitle="excelTitle" :perPage="perPage" noHeader accordion>
			<template #head>
				<tr>
					<Th class="width20" prop="name" name="name" sort export>{{ getTranslation('I00.00020000', 'Name') }}</Th>
					<Th class="width15" prop="responsibility" name="responsibility" sort export defaultSort>{{ getTranslation('I00.00025230', 'Responsibility') }}</Th>
					<Th prop="phone" name="phone" sort export>{{ getTranslation('I00.00025200', 'Phone') }}</Th>
					<Th prop="mobile" name="mobile" sort export>{{ getTranslation('I00.00025220', 'Mobile') }}</Th>
					<Th class="width10" prop="email" name="email" sort export>{{ getTranslation('I00.00008030', 'E-mail') }}</Th>
					<Th class="widthPx150" prop="from" name="from" sort export>{{ getTranslation('I00.00025210', 'From date') }}</Th>
					<Th class="width15" prop="department" name="department" sort export>{{ getTranslation('I00.00026380', 'Department') }}</Th>
				</tr>
			</template>
			<template #body="{ item }">
				<tr>
					<td class="width20">
						<span>{{ item.name }}</span>
					</td>
					<td class="width15">
						<span>{{ item.responsibility }}</span>
					</td>
					<td>
						<span>{{ item.phone }}</span>
					</td>
					<td>
						<span>{{ item.mobile }}</span>
					</td>
					<td class="width10">
						<span>{{ item.email }}</span>
					</td>
					<td class="widthPx150">
						<span>{{ item.from }}</span>
					</td>
					<td class="width15">
						<HoverElement>
							{{ item.department }}
							<template #hover>{{ findNodeNamePath(item.department) }}</template>
						</HoverElement>
					</td>
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
import axios from '../../axios';
import { camelCaseObj, errorDebug, tryParse } from '../../libraries/common';


export default {
  components: {
    DataTable,
    Th,
    HoverElement,
    Accordion
  },
  data() {
    return {
      contactsOpened: false,
      contactsData: null,
    }
  },
  props: ['excelTitle', 'perPage'],
  methods: {
    getContactsAndResponsibilities() {
      var node = window.SideTree.GetSelectedNode();
      return axios.postWithCancelToken('/Departments/GetContactAndResponsibilities', { orgid: node.KeyID, org_mdbid: node.KeyID_mdbID })
        .then(response => {
          this.contactsData = camelCaseObj(JSON.parse(response.data));
        })
        .catch(errorDebug);
    },
    saveToStorage(event) {
      var sectionsLocalStorage = tryParse(localStorage.getItem('DepartmentHiddenBoxes')) || {};
      sectionsLocalStorage['contactsBox'] = !event;
      localStorage.setItem('DepartmentHiddenBoxes', JSON.stringify(sectionsLocalStorage));
    },
    findNodeNamePath(data) {
      return data.split('\\').last().trim();
    },
  },
  computed: {
    sectionData() {
      return (this.contactsData || []).length > 0 ? this.contactsData : null;
    }
  },
  mounted() {
    var sectionsLocalStorage = tryParse(localStorage.getItem('DepartmentHiddenBoxes')) || {};
    this.contactsOpened = !sectionsLocalStorage['contactsBox'];
    this.getContactsAndResponsibilities();
  },
};
</script>