<template>
	<div class="col-xl col-12">
		<Subtitle :text="exposure ? title + ' - ' + exposure.complianceTypeTranslation : title">
			<div>
				<a class="icons icon-exposurescenario plainIcn ml-3" v-if="exposure.eslink || exposure.exposureScenario.url" :href="exposure.eslink || exposure.exposureScenario.url" target="_blank" :title="exposure.organisationPath"></a>
			</div>
		</Subtitle>
		<div class="col-xl col-12 px-4 py-3">
			<p class="noWrap d-flex mt-2">
				<b>{{ getTranslation('I00.00046670', 'The exposure scenario for the product has been handled:') }}</b>
				<span class="ml-2">{{ status.status_text }}</span>
			</p>
			<p class="noWrap d-flex mt-2">
				<b>{{ getTranslation('I00.00020550', 'Comment') }}:</b>
				<span class="ml-2">{{ exposure.complianceNote }}</span>
			</p>
		</div>
	</div>
</template>

<script>
import Subtitle from '../../../common/cardBox/Subtitle';

export default {
  components: {
    Subtitle
  },
  props: ['exposure', 'title', 'options'],
  computed: {
    status() {
      if (this.exposure.status && this.options && this.options.exposureStatusList) {
        var value = this.exposure.status.toLowerCase();
        return this.options.exposureStatusList.find(f => f.status_value.toLowerCase() === value);
      }
      return null;
    }
  }
};
</script>