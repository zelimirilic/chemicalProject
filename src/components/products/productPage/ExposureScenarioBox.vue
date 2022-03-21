<template>
	<InformationBox additionalClass="p-4" :tooltipTtl="getTranslation('I00.00006260', 'Edit')" :title="getTranslation('I00.00030190', 'Exposure scenario')" :noEdit="!compliance || noExposureScenario" @edit="$emit('edit')">
		<SmallLoader v-if="showLoader" />
		<div class="col-12 emptyTxt text-center" v-else-if="noExposureScenario">
			<p class="icons icon-noitems plainIcn bigIcn m-0 p-0"></p>
			<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055680', 'No items found') }}</h4>
			<h6 class="mb-0">{{ getTranslation('I00.00055690', 'You don’t have any items here.') }}</h6>
		</div>
		<template v-else>
			<div class="col-6">
				<h6 class="labelTxt">{{ getTranslation('I00.00046670', 'I have read and implemented exposure scenario for this product') }}</h6>
				<div>{{ decision }}</div>
			</div>
			<div class="col-3">
				<h6 class="labelTxt">{{ getTranslation('I00.00046600', 'Received info date') }}</h6>
				<div>{{ parseDate(compliance.receivedInfoDate) }}</div>
			</div>
			<div class="col-12 mt-4">
				<h6 class="labelTxt">{{ getTranslation('I00.00020550', 'Comment') }}</h6>
				<div>{{ compliance.complianceNote }}</div>
			</div>
			<div class="col-12 mt-4">
				<h6 class="labelTxt">{{ getTranslation('I00.00055750', 'Resource') }}</h6>
				<a class="docBox" :href="compliance.exposureScenario.url">
					<span class="docType icon-sds"></span>
					<div>
						<p>{{ getTranslation('I00.00030190', 'Exposure scenario') }}</p>
						<p class="date">2017-09-28</p>
					</div>
				</a>
			</div>
		</template>
	</InformationBox>
</template>

<script>
import { parseDate } from '../../../libraries/date';
import InformationBox from './InformationBox';


export default {
  components: {
    InformationBox
  },
  props: ['compliance', 'showLoader', 'decisions', 'noExposureScenario'],
  methods: {
    parseDate,
  },
  computed: {
    decision() {
      return this.compliance.status && this.decisions.length ? this.getTranslation(this.decisions.find(x => x.status_value === this.compliance.status).status_text) : ''
    }
  },
};
</script>