
<template>
	<span :class="{ disabled: item.disabled }" @click="$emit('click')">
		<i class="eqtree-icon eqtree-themeicon eqtree-themeicon-custom"></i>
		<i class="pr-1" :class="item.icon" v-if="item.icon" />
		<A :treeid="idStr" class="" :title="item.name">{{ item.name }}</A>
		<sup class="icons astera" v-if="starred"></sup>
	</span>
</template>

<script>
import { idToString } from '../../libraries/common_v3';
import A from '../../components/common/others/A_v3';
export default {
  components: {
    A,
  },
  props: ['item', 'starred'],
  computed: {
    idStr() {
      return idToString(this.item.orgID);
    },
  }
}
</script>