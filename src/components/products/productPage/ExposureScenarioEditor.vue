<template>
	<div>
		<ExposureScenarioBox :compliance="compliance" :decisions="decisions" :showLoader="showLoader || !decisions" :noExposureScenario="noExposureScenario" @edit="isEditing = true" v-show="!isEditing" />
		<ExposureScenarioBoxEdit v-model="compliance" :decisions="decisions" @input="saveCompliance" @cancel="isEditing = false" v-if="isEditing" />
	</div>
</template>

<script>
import ExposureScenarioBox from './ExposureScenarioBox';
import ExposureScenarioBoxEdit from './ExposureScenarioBoxEdit';

import { errorDebug, hashCode } from '../../../libraries/common';
import axios from '../../../axios';
import moment from 'moment';

export default {
  components: {
    ExposureScenarioBox,
    ExposureScenarioBoxEdit,
  },
  props: ['product'],
  data() {
    return {
      compliance: null,
      decisions: null,
      noExposureScenario: false,
      isSaving: false,
      isEditing: false,
      showLoader: true,
    };
  },
  methods: {
    nodeSelected() {
      this.getCompliance();
    },
    getCompliance() {
      this.showLoader = true;
      axios.post('/ChemsoftExposureScenario/ExposureScenario', { productID: this.product.id.id, productID_mdbID: this.product.id.id_mdbID, orgID: this.sideTree.getSelectedDepartment().orgID.id, orgID_mdbID: this.sideTree.getSelectedDepartment().orgID.id_mdbID })
        .then(response => {
          if (response.data) {
            this.compliance = {
              ...response.data,
              receivedInfoDate: moment(response.data.receivedInfoDate),
            };
            this.noExposureScenario = false;
          } else this.noExposureScenario = true;
          this.showLoader = false;
        })
        .catch(errorDebug);
    },
    saveCompliance() {
      this.showLoader = true;
      this.isEditing = false;
      return axios.post('/ChemsoftExposureScenario/SaveExposureScenario', { ...this.compliance, productVariant: this.product, department: this.sideTree.getSelectedDepartment() })
        .then(response => {
          this.compliance = {
            ...response.data,
            receivedInfoDate: moment(response.data.receivedInfoDate),
          };
          this.showLoader = false;
        }).catch(errorDebug);
    },
  },
  computed: {
    isChanged() {
      return hashCode(this.product.productTypes) !== hashCode(this.typesForEdit);
    },
    filteredTypes() {
      return this.typesForEdit.filter((f) => !f.deleted);
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisExposureScenarioEditor'] = this;
    axios.post('/ChemsoftExposureScenario/Decisions')
      .then(response => this.decisions = response.data);

    if (this.sideTree.getSelectedDepartment()) {
      this.getCompliance();
    }
  }
}
</script>