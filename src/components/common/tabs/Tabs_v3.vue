<template>
	<div>
		<div class="tab">
			<button type="button" class="tablinks" :class="{ active: ind === value }" :value="value" @click="selectTab(ind)" v-for="(tab, ind) in tabs" :key="ind">
				<span>{{ propFnc(tab) }}</span>
			</button>
		</div>
		<div class="tabcontent active" :class="tabcontent">
			<slot></slot>
		</div>
	</div>
</template>

<script>
import { propToFnc } from '../../../libraries/vue_v3';
export default {
  props: ['tabs', 'value', 'prop', 'tabcontent'],
  methods: {
    selectTab(event) {
      if (this.value !== event)
        this.$emit('input', event, this.value);
    },
  },
  computed: {
    propFnc() {
      return propToFnc(this.prop);
    },
  }
}
</script>