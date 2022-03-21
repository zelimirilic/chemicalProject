<template>
	<section v-if="data">
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
		<div class="d-flex mt-2" v-for="(item, ind) in sectionData" :key="item.id + ind">
			<p class="titleTxt" v-if="item.title">{{ format(item.title) + ':' }}</p>
			<p class="titleTxt" v-else-if="subSectionText">{{ subSectionText + ':' }}</p>
			<div class="txtField">{{ format(item.text) }}</div>
		</div>
	</section>
</template>

<script>
export default {
  props: ['data', 'headerIcon', 'title', 'emergencyNumber', 'subSectionText'],
  methods: {
    format(item) {
      var it = item.replace(/<br\s*[\\/]?>/gi, '\r\n');
      return it;
    }
  },
  computed: {
    sectionData() {
      return (this.data || []);
    }
  }
}
</script>