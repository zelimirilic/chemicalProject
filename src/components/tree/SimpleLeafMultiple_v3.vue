<template>
	<span @click="$emit('click')">
		<span :class="{ disabled: item.disabled }">
			<i class="eqtree-icon eqtree-themeicon eqtree-themeicon-custom"></i>
			<i class="pl-2" :class="item.icon" v-if="item.icon" />
			<A :treeid="idStr" class="" :title="item.name">{{ item.name }}</A>
			<sup class="astera" v-if="starred">*</sup>
		</span>
		<CheckBox class="ml-2" :value="listOfSelectedItems && listOfSelectedItems.filter((x) => x.orgID.id === item.orgID.id).length > 0" />
	</span>
</template>

<script>
import { idToString } from '../../libraries/common_v3';
import CheckBox from '../common/form/checkBox/CheckBox_v3';
export default {
  props: ['item', 'starred', 'listOfSelectedItems'],
  components: {
    CheckBox,
  },
  computed: {
    idStr() {
      return idToString(this.item.orgID);
    }
  }
}
</script> 