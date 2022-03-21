<template>
	<MainLoader v-if="!data" />
	<div v-else>
		<TabsWithMenu class="card pageWrapper" :tabs="steps" prop="name" :value="activeStep" @input="tabChanged">
			<template #menu>
				<span @click="openModal()" class="icons icon-plus" v-tooltip="getTranslation('I00.00014710', 'New')"></span>
			</template>
			<DataTable :tableData="tableData" :perPage.sync="perPage" :title="getTranslation('I00.00012050', 'Applications')" excelTitle :key="activeStep">
				<template #head>
					<tr>
						<Th class="iconCol" :prop="(f) => f.closedReason.capitalize()" sort export v-if="steps[activeStep].showStatus">{{ getTranslation('I00.00011030', 'Status') }}</Th>
						<Th :prop="productName" sort export>{{ getTranslation('I00.00006920', 'Product name') }}</Th>
						<Th class="w-30" :prop="(f) => f.usagePlace.name" sort export>{{ getTranslation('I00.00002940', 'Department') }}</Th>
						<Th class="dateCol" :prop="(f) => parseDate(f.createdDate)" sort="createdDate" export defaultSort="desc">{{ getTranslation('I00.00013500', 'Application date') }}</Th>
					</tr>
				</template>
				<template #body="{ item }">
					<tr>
						<td class="iconCol" v-if="steps[activeStep].showStatus">
							<span class="status" :class="item.closedReason.capitalize()" :title="item.closedReason.capitalize()">&nbsp;</span>
						</td>
						<td>
							<router-link :to="{ name: 'applicationReview', params: { requestId: item.id } }">{{ productName(item) }}</router-link>
						</td>
						<td class="w-30">
							<HoverElement>
								{{ item.usagePlace.name }}
								<template #hover>
									{{ findNodeNamePath(item.usagePlace.orgID) }}
								</template>
							</HoverElement>
						</td>
						<td class="dateCol">
							<router-link :to="{ name: 'applicationReview', params: { requestId: item.id } }">{{ parseDate(item.createdDate) }}</router-link>
						</td>
					</tr>
				</template>
			</DataTable>
		</TabsWithMenu>
		<ModalDialog additional-class="appForm wp-800" :title="getTranslation('I00.00055080', 'New application')" v-if="showModal" @close="closeModal">
			<ApplicationRequest v-if="canSee.application()"></ApplicationRequest>
		</ModalDialog>
	</div>
</template>

<script>
import axios from '../../axios';
import { errorDebug, ticker } from '../../libraries/common';
import { parseDate } from '../../libraries/date';
import { findNodeNamePath } from '../../libraries/tree';
import TabsWithMenu from '../../components/common/tabs/TabsWithMenu';
import HoverElement from '../../components/common/others/HoverElement';
import ModalDialog from '../../components/common/modal/ModalDialog.vue';
import ApplicationRequest from '../../views/applications/ApplicationRequest.vue';
import { canSee } from '../../libraries/permissions';

export default {
  name: 'ApplicationList',
  components: {
    TabsWithMenu,
    HoverElement,
    ModalDialog,
    ApplicationRequest
  },
  data() {
    return {
      data: null,
      perPage: 20,
      showModal: false
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    productName(item) {
      return item.product ? item.product.name : item.reqProductName;
    },
    tabChanged(event) {
      this.$router.replace({ name: this.$route.name, params: { ...this.$route.params, tab: this.steps[event].tab } });
    },
    nodeSelected(node) {
      ticker.clearMessages();
      this.data = null;

      axios.post(`ApplicationRequestList/Show?org=${node.orgID.id}&org_mdbid=${node.orgID.id_mdbID}`)
        .then(response => this.data = response.data)
        .catch(errorDebug);
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
    activeStep() {
      var component = this.steps.find(f => f.tab === this.$route.params.tab);
      return component ? this.steps.indexOf(component) : 0;
    },
    tableData() {
      return this.steps[this.activeStep].tableData();
    },
    canSee: canSee
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisApplications'] = this;
    if (this.sideTree.getSelectedDepartment()) {
      this.nodeSelected(this.sideTree.getSelectedDepartment());
    }
    this.getTranslation('I00.00012130', 'All');

    this.$root.$on('AplicationList', () => {
      this.closeModal();
    });
  },
}
</script>