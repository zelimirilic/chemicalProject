<template>
	<span :class="{ disabled: item.disabled }" @click="$emit('click')">
		<i class="eqtree-icon eqtree-themeicon eqtree-themeicon-custom"></i>
		<i class="pl-2" :class="item.icon" v-if="item.icon" />
		<A :treeid="idStr" class="" :title="item.name">{{ item.name }}</A>
		<sup class="astera" v-if="starred">*</sup>
	</span>
</template>

<script>
import { idToString } from '../../libraries/common';
export default {
  props: ['item', 'starred'],
  computed: {
    idStr() {
      return idToString(this.item.orgID);
    },
  }
}
</script>