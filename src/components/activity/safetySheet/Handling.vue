<template>
	<section v-if="riskHandling || (baseProductInfo && baseProductInfo.length > 1)">
		<div class="header d-flex align-items-center">
			<h3>
				<span :class="`icons ${headerIcon || 'icon-atom'} mr-2`"></span>
				<span>
					<b>{{ title }}</b>
				</span>
			</h3>
			<h3 v-if="emergencyNumber" class="ml-auto mb-0">
				<span class="icons icon-phone mr-2"></span>
				<span>
					<b>{{ emergencyNumber }}</b>
				</span>
			</h3>
		</div>

		<div class="d-flex mt-2" v-if="riskHandling">
			<div>
				<div class="d-table" v-for="(item, ind) in getValue(riskHandling)" :key="item.id + ind">
					<p class="subtitleTxt" v-if="item.title">{{ formatString(item.title) + ':' }}</p>
					<div class="txtField">{{ formatString(item.text) }}</div>
				</div>
			</div>
		</div>

		<template v-if="baseProductInfo && !riskHandling">
			<div class="d-flex mt-2" v-for="(item, ind) in baseProductInfo" :key="ind">
				<p class="titleTxt">{{ formatString(getSubtitle(item)) }}</p>
				<div class="txtField">{{ formatString(removeSubtitle(item)) }}</div>
			</div>
		</template>
	</section>
</template>

<script>
import { isNullOrEmpty, formatString } from '../../../libraries/common';
export default {
  props: ['riskHandling', 'headerIcon', 'title', 'emergencyNumber', 'baseProductInfo'],
  methods: {
    formatString: formatString,
    removeSubtitle(item) {
      return item ? item.substring(item.indexOf(":") + 1) : "";
    },
    getSubtitle(item) {
      return item ? item.substring(0, item.indexOf(':'), + 1) + ':' : "";
    },
    getValue(value) {
      if (isNullOrEmpty(value)) return null;
      var sectionData = value.split("\n");
      return sectionData.filter(f => f).map((str, index) => ({ title: (str.includes(":") ? str.split(":").first() : null), text: str.substring(str.indexOf(':') + 1), id: index + 1 }));
    }
  }
}
</script>