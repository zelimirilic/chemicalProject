<template>
	<section v-if="data">
		<div class="header d-flex align-items-center">
			<h3>
				<span :class="`icons ${headerIcon || 'icon-atom'} mr-2`"></span>
				<span>
					<b>{{ title }}</b>
				</span>
			</h3>
		</div>
		<slot></slot>
		<div v-for="(item, index) in data" :key="index" class="products d-flex">
			<p :class="{ 'mr-auto': getUfiNumber(item.prodID.id) }">{{ item.name }}</p>
			<p class="noWrap" v-if="getUfiNumber(item.prodID.id)">
				<b>{{ getTranslation('I00.00050690', 'Ufi code') }}:</b>
				{{ getUfiNumber(item.prodID.id) }}
			</p>
		</div>
	</section>
</template>

<script>
export default {
  props: ['data', 'additionalProductInfo', 'title', 'headerIcon'],
  methods: {
    getUfiNumber(id) {
      return ((this.additionalProductInfo || []).find(x => x.prodID.id == id) || {}).ufiCode;
    }
  }
}
</script>