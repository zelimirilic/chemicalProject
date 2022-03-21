<template>
	<div class="d-flex flex-column" withReadOnlyMode>
		<img class="iconPx45 mx-auto mb-2" :class="{ opacity: !value && !propToBool(readOnly), cursor: !propToBool(readOnly) }" :src="img" @click="toggleCheckbox" />
		<label class="wp-100 small text-center" :class="{ cursor: !propToBool(readOnly) }" @click="toggleCheckbox" v-if="text">{{ text }}</label>
		<div class="custom-check m-auto" v-if="!propToBool(readOnly)">
			<CheckBox :checked="value" />
			<label class="custom-label" @click="toggleCheckbox(!value)"></label>
		</div>
	</div>
</template>

<script>
import { propToBool } from '../../../../libraries/vue';
export default {
  props: ['readOnly', 'img', 'value', 'text'],
  methods: {
    toggleCheckbox() {
      this.$emit('input', !this.value);
    },
    propToBool: propToBool,
  },
};
</script>