<template>
	<section class="orange" v-if="symbols.length || (baseProductPerosnalProtection && baseProductPerosnalProtection.length > 1 && !personalProtectionEquipment) || personalProtectionEquipment">
		<div class="header d-flex align-items-center">
			<h3>
				<span class="icons icon-shield mr-2"></span>
				<span>
					<b>{{ getTranslation('I00.00019690', 'Personal protection') }}</b>
				</span>
			</h3>
		</div>
		<Pictograms :symbols="symbols" />

		<div class="d-flex mt-2" v-if="personalProtectionEquipment">
			<div>
				<div class="d-table" v-for="(item, ind) in getValue(personalProtectionEquipment)" :key="item.id + ind">
					<p class="subtitleTxt" v-if="item.title">{{ formatString(item.title) + ':' }}</p>
					<div class="txtField">{{ formatString(item.text) }}</div>
				</div>
			</div>
		</div>

		<template v-if="baseProductPerosnalProtection && !personalProtectionEquipment">
			<div class="d-flex mt-2" v-for="(item, ind) in baseProductPerosnalProtection" :key="ind">
				<p class="titleTxt">{{ formatString(getSubtitle(item)) }}</p>
				<div class="txtField">{{ formatString(removeSubtitle(item)) }}</div>
			</div>
		</template>
	</section>
</template>

<script>
import { isNullOrEmpty, formatString } from '../../../libraries/common';
import Pictograms from '../../../components/common/safetySheet/Pictograms';
export default {
  components: {
    Pictograms
  },
  props: ['symbols', 'personalProtectionEquipment', 'baseProductPerosnalProtection'],
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