<template>
	<div class="statusWrap">
		<div class="statusLight" :class="value != null ? value.statusClass : ''">
			<div class="statusBgd"></div>
			<p class="icons"></p>
			<p class="statusTxt" v-if="value">{{ getWebTranslationOrValue(value.currentStatus) }}</p>
			<p class="statusTxt" v-else>{{ getWebTranslationOrValue('I00.00055300', 'Undefined') }}</p>
		</div>
	</div>
</template>

<script>
import axios from '../../../axios';
import { errorDebug, hashCode } from '../../../libraries/common';
export default {
  props: ['dat'],
  data() {
    return {
      value: null,
    };
  },
  methods: {
    getStatus() {
      if ((this.dat.product || {}).id) {
        axios.post('/TrafficLight/GetCurrentStatus', { productId: this.dat.product.id, orgId: (this.dat.usagePlace || this.sideTree.getSelectedDepartment()).orgID })
          .then(response => this.value = response.data)
          .catch(errorDebug);
      } else this.value = null;
    }
  },
  watch: {
    productIdHash() {
      this.getStatus();
    },
    usagePlaceIdHash() {
      this.getStatus();
    },
  },
  computed: {
    productIdHash() {
      return this.dat.product.id ? hashCode(this.dat.product.id) : 0;
    },
    usagePlaceIdHash() {
      return (this.dat.usagePlace || {}).orgID ? hashCode(this.dat.usagePlace.orgID) : 0;
    },
  },
  mounted() {
    this.getStatus();
  }
}
</script>