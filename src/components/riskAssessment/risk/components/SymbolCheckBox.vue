<template>
	<div class="d-flex flex-column mx-3" withReadOnlyMode>
		<img class="iconPx45 mx-auto mb-2 cursor" :class="{ opacity: !value && !propToBool(readOnly) }" :src="img" @click="toggleCheckbox" />
		<div class="custom-check m-auto" v-if="!propToBool(readOnly)">
			<CheckBox :checked="value" />
			<label class="custom-label" @click="toggleCheckbox(!value)"></label>
		</div>
	</div>
</template>

<script>
import { propToBool } from '../../../../libraries/vue';
export default {
  props: ['readOnly', 'img', 'value'],
  methods: {
    toggleCheckbox() {
      this.$emit('input', !this.value);
    },
    propToBool: propToBool,
  },
};
</script>