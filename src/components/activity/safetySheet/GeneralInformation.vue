<template>
	<section>
		<div class="header d-flex align-items-center">
			<h3>
				<span :class="`icons ${headerIcon || 'icon-atom'} mr-2`"></span>
				<span>
					<b>{{ title }}</b>
				</span>
			</h3>
		</div>
		<slot></slot>
		<div class="d-flex mt-2">
			<div v-if="risk.generalInformation">
				<div class="d-table" v-for="(item, ind) in getValue(risk.generalInformation)" :key="item.id + ind">
					<p class="subtitleTxt" v-if="item.title">{{ formatString(item.title) + ':' }}</p>
					<div class="txtField">{{ formatString(item.text) }}</div>
				</div>
			</div>
			<div v-else>-</div>
		</div>
		<div v-if="!haveSubTitle(risk.handlingDescription)" class="d-flex mt-2">
			<p class="titleTxt">{{ getTranslation('I00.00054600', 'Description of activity') }}:</p>
			<div v-if="risk.handlingDescription">
				<div class="d-table" v-for="(item, ind) in getValue(risk.handlingDescription)" :key="item.id + ind">
					<p class="subtitleTxt" v-if="item.title">{{ formatString(item.title) + ':' }}</p>
					<div class="txtField">{{ formatString(item.text) }}</div>
				</div>
			</div>
			<div v-else>-</div>
		</div>
		<div v-else class="d-flex mt-2">
			<div v-if="risk.handlingDescription">
				<p class="titleTxt">{{ getTranslation('I00.00054600', 'Description of activity') }}:</p>
				<div class="d-table" v-for="(item, ind) in getValue(risk.handlingDescription)" :key="item.id + ind">
					<p class="subtitleTxt" v-if="item.title">{{ formatString(item.title) + ':' }}</p>
					<div class="txtField">{{ formatString(item.text) }}</div>
				</div>
			</div>
			<div v-else>-</div>
		</div>
	</section>
</template>

<script>
import { isNullOrEmpty, formatString } from '../../../libraries/common';
export default {
  props: ['title', 'headerIcon', 'risk', 'productNotes', 'noProdSelected'],
  methods: {
    formatString: formatString,
    getValue(value) {
      if (isNullOrEmpty(value)) return null;
      var sectionData = value.split("\n");
      return sectionData.filter(f => f).map((str, index) => ({ title: (str.includes(":") ? str.split(":").first() : null), text: str.substring(str.indexOf(':') + 1), id: index + 1 }));
    },
    haveSubTitle(value) {
      if (isNullOrEmpty(value)) return false;
      return value.includes(":");
    }

  }
}
</script>