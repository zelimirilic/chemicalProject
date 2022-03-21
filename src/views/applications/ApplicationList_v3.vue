<template>
	<MainLoader v-if="!data" />
	<div v-else>
		<TabsWithMenu class="card pageWrapper mt-5" :tabs="steps" prop="name" :value="activeStep" @input="activeStep = $event">
			<DataTable :tableData="tableData" :perPage.sync="perPage" :title="getTranslation('I00.00012050', 'Applications')" excelTitle :key="activeStep">
				<template #head>
					<tr>
						<Th class="IconColumn" :prop="(f) => f.closedReason.capitalize()" sort export v-if="steps[activeStep].showStatus">{{ getTranslation('I00.00011030', 'Status') }}</Th>
						<Th :prop="productName" sort export>{{ getTranslation('I00.00006920', 'Product name') }}</Th>
						<Th class="width30" :prop="(f) => f.usagePlace.name" sort export>{{ getTranslation('I00.00002940', 'Department') }}</Th>
						<Th class="dateCol" :prop="(f) => parseDate(f.createdDate)" sort="createdDate" export defaultSort="desc">{{ getTranslation('I00.00013500', 'Application date') }}</Th>
					</tr>
				</template>
				<template #body="{ item }">
					<tr>
						<td class="IconColumn" v-if="steps[activeStep].showStatus">
							<span class="status" :class="item.closedReason.capitalize() == 'Fulfilled' ? 'Done' : 'Rejected'" :title="getStatusTitle(item.closedReason.capitalize())">&nbsp;</span>
						</td>
						<td>
							<a @click="$emit('openreview', item.id)">{{ productName(item) }}</a>
						</td>
						<td class="width30">
							<HoverElement>
								{{ findNodeNamePath(item.usagePlace.orgID) }}
								<template #hover>
									{{ item.usagePlace.name }}
								</template>
							</HoverElement>
						</td>
						<td class="dateCol">
							<a @click="openReviewForm(item.id)">{{ parseDate(item.createdDate) }}</a>
						</td>
					</tr>
				</template>
			</DataTable>
		</TabsWithMenu>
	</div>
</template>

<script>
import axios from '../../axios';
import { errorDebug, ticker } from '../../libraries/common_v3';
import { parseDate } from '../../libraries/date_v3';
import { findNodeNamePath } from '../../libraries/tree_v3';
import TabsWithMenu from '../../components/common/tabs/TabsWithMenu_v3';
import HoverElement from '../../components/common/others/HoverElement_v3';
import DataTable from '../../components/common/dataTable/DataTable_v3';
import Th from '../../components/common/dataTable/Th_v3';
import MainLoader from '../../components/common/loaders/MainLoader_v3';

export default {
  name: 'ApplicationList',
  components: {
    TabsWithMenu,
    HoverElement,
    DataTable,
    Th,
    MainLoader
  },
  data() {
    return {
      data: null,
      perPage: 15,
      activeStep: 0
    };
  },
  methods: {
    productName(item) {
      return item.product ? item.product.name : item.reqProductName;
    },
    nodeSelected() {
      ticker.clearMessages();
      this.data = null;
      var node = window.SideTree.GetSelectedNode();
      axios.post(`ApplicationRequestList/Show?org=${node.KeyID}&org_mdbid=${node.KeyID_mdbID}`)
        .then(response => this.data = response.data)
        .catch(errorDebug);
    },
    getStatusTitle(closedReason) {
      return closedReason == "Fulfilled" ? this.getTranslation('Approved', 'I00.00013480') : this.getTranslation('Rejected', 'I00.00013490')
    },
    parseDate,
    findNodeNamePath,
  },
  computed: {
    steps() {
      return [{
        name: this.getTranslation('I00.00022650', 'Active'),
        tab: 'active',
        tableData: () => this.data.activeApplicationLists,
      }, {
        name: this.getTranslation('I00.00014700', 'Completed'),
        tab: 'completed',
        tableData: () => this.data.completedApplicationLists,
        showStatus: true
      }];
    },
    tableData() {
      return this.steps[this.activeStep].tableData();
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisApplications'] = this;
    if (this.sideTree.getSelectedDepartment()) {
      this.nodeSelected();
    }
  },
}
</script>