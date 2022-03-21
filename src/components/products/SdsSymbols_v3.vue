<template>
	<div>
		<div v-if="dat.any()">
			<div class="left">
				<a class="mx-1" :class="'flags ' + getFlag(arr)" v-for="(arr, ind) in dat" :key="ind + arr" :href="arr.url" target="_blank"><span :title="arr.language"></span></a>
			</div>
		</div>
		<template v-else>-</template>
	</div>
</template>

<script>
import { isNullOrEmpty } from '../../libraries/common_v3';

export default {
  props: ['dat'],
  methods: {
    getFlag(item) {
      return isNullOrEmpty(item.countryLanguageID) ? 'language' + item.languageCode : 'flag' + item.countryLanguageID.split('-').last();
    }
  },
}
</script>