<template>
	<section v-if="sectionData">
		<div class="header d-flex align-items-center">
			<h3>
				<span :class="`icons ${headerIcon || 'icon-atom'} mr-2`"></span>
				<span>
					<b>{{ title }}</b>
				</span>
			</h3>
			<h3 v-if="emergencyNumber" class="ml-auto">
				<span class="icons icon-phone mr-2"></span>
				<span>
					<b>{{ emergencyNumber }}</b>
				</span>
			</h3>
		</div>
		<slot></slot>
		<div v-for="(item, ind) in sectionData.children.filter((g) => g.item.type != 'Images')" :key="item.item.title + ind">
			<h4 class="italic" v-if="item.item.type == 'GroupTitle'">{{ item.item.data }}</h4>
			<div class="d-flex mt-2" v-else>
				<p class="titleTxt">{{ formatString(item.item.title) }}:</p>
				<div class="txtField" v-if="item.item.data.includes(': ') && item.item.data.includes('<br/>')">
					<div class="d-table" v-for="(item, index) in getValue(item.item.data)" :key="index">
						<p class="subtitleTxt" v-if="item.title">{{ formatString(item.title) }}:</p>
						<div class="txtField">{{ formatString(item.text) }}</div>
					</div>
				</div>
				<div class="txtField" v-else>{{ formatString(item.item.data) }}</div>
			</div>
		</div>
	</section>
</template>

<script>
import { isNullOrEmpty, formatString } from '../../../libraries/common';
export default {
  props: ['data', 'section', 'headerIcon'],
  methods: {
    formatString: formatString,
    getValue(value) {
      if (isNullOrEmpty(value)) return null;
      var sectionData = value.split("<br/>");
      return sectionData.filter(f => f).map((str, index) => ({ title: (str.includes(":") ? str.split(":").first() : null), text: str.includes(":") ? str.substring(str.indexOf(':') + 1) : str, id: index + 1 }));
    }
  },
  computed: {
    sectionData() {
      return (this.data || []).find(f => f.item.section === this.section);
    },
    title() {
      return this.sectionData.children.first().item.sectionTitle.split('.').tail().join('.').trim();
    },
    emergencyNumber() {
      return (this.sectionData.item.sectionTitleImage.emergencyNumber || '').split(':').tail().join(':');
    },
  }
}
</script>