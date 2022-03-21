<template>
	<div>
		<div class="tabWrapper d-flex justify-content-between">
			<div class="tab">
				<button type="button" class="tablinks" :class="{ active: ind === value }" :value="value" @click="selectTab(ind)" v-for="(tab, ind) in tabs" :key="ind">
					<slot name="tabSlot" :tab="tab" :index="ind"><span>{{ propFnc(tab) }}</span></slot>
				</button>
			</div>
			<div class="d-flex align-items-center actionLink">
				<slot name="menu"></slot>
			</div>
		</div>
		<div class="tabcontent active">
			<slot></slot>
		</div>
	</div>
</template>

<script>
import { propToFnc } from '../../../libraries/vue';
export default {
  props: ['tabs', 'value', 'prop'],
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