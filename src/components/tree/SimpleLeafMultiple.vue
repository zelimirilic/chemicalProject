<template>
	<span class="custom-check right" @click="$emit('click')" :class="{ depChecked: listOfSelectedItems && listOfSelectedItems.filter((x) => x.item.orgID.id === item.orgID.id).length > 0 }">
		<span class="custom-label" :class="{ disabled: item.disabled }">
			<i class="eqtree-icon eqtree-themeicon eqtree-themeicon-custom"></i>
			<i class="pl-2" :class="item.icon" v-if="item.icon" />
			<A :treeid="idStr" class="" :title="item.name">{{ item.name }}</A>
			<sup class="astera" v-if="starred">*</sup>
		</span>
	</span>
</template>

<script>
import { idToString } from '../../libraries/common';
export default {
  props: ['item', 'starred', 'listOfSelectedItems'],
  computed: {
    idStr() {
      return idToString(this.item.orgID);
    }
  }
}
</script> 