<template>
	<div :class="{ subGroupInner: subGroup }">
		<div class="custom-check" withReadOnlyMode>
			<CheckBox :class="{ notValid: !isValid }" :value="value" @input="onInput" />
			<label class="custom-label" @click="onInput(!value)">
				{{ text }}
				<sup class="astera" v-if="propToBool(required)">*</sup>
			</label>
			<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
		</div>
	</div>
</template>

<script>
import CheckBoxGroup from './CheckBoxGroup';
import CheckBox from './CheckBox_v3';

export default {
  extends: CheckBoxGroup,
  name: 'CheckBoxGroup',
  components: {
    CheckBox
  },
}
</script>