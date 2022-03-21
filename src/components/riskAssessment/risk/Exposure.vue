<template>
	<div class="scrollWrap pb-4">
		<RiskDetail :risk="risk" showProductLink></RiskDetail>

		<CardBox class="mt-5 no-gutters" additionalClass="lightGrayBg borderT" v-for="(exposure, ind) in risk.exposureScenarios" :text="getActivityItem(exposure.productVariant.id).name" :key="ind">
			<div class="multyCol row no-gutters">
				<RiskCompliance :exposure="getCompliance(exposure).generalExposureScenario" :options="options" :title="getTranslation('I00.00047460', 'Compliance General')" v-if="getCompliance(exposure).generalExposureScenario" readOnly></RiskCompliance>
				<RiskCompliance :exposure="getCompliance(exposure).specificExposureScenario" :options="options" :title="getTranslation('I00.00047470', 'Compliance Specific')" v-if="getCompliance(exposure).specificExposureScenario" readOnly></RiskCompliance>
				<RiskCompliance :exposure="exposure" :hasCompliances="hasCompliances(exposure)" :options="options" :title="getTranslation('I00.00047450', 'Activity Compliance')" :readOnly="!hasWriteRights()"></RiskCompliance>
			</div>
		</CardBox>
	</div>
</template>

<script>
import RiskCompliance from './components/RiskCompliance';
import RiskDetail from './components/RiskDetail';
import { idsAreEqual } from '../../../libraries/common';

export default {
  components: {
    RiskCompliance,
    RiskDetail,
  },
  data() {
    return {
      checkedList: [],
      isGettingData: false,
      checkedProducts: [],
      status: ''
    }
  },
  props: ['title', 'close', 'risk', 'common', 'options', 'raProductComplianceList'],
  methods: {
    getCompliance(exposure) {
      if (!this.raProductComplianceList) return {};
      var id = exposure.productVariant.id;

      return this.raProductComplianceList
        .find(f => idsAreEqual(f.raCompliance.productVariant.id, id)) || {};
    },
    hasCompliances(exposure) {
      var compliance = this.getCompliance(exposure);
      return (compliance.generalExposureScenario || compliance.specificExposureScenario) != null;
    },
    getProductIds() {
      return this.risk.activity.activityItems.map(f => f.prodID);
    },
    getActivityItem(id) {
      return this.risk.activity.activityItems.find(f => idsAreEqual(id, f.prodID));
    }
  },
  activated() {
    this.$emit('checkIsValid');
  }
};
</script>