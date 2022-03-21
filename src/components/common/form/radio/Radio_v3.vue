<template>
	<div class="custom-check radio" withReadOnlyMode>
		<input type="radio" class="custom-input" :class="{ notValid: !isValid }" :checked="value" @change="onChange" />
		<label class="custom-label" :class="{ notValid: !isValid }" @click="value ? null : onChange(!value)">
			<slot>{{ text }}</slot>
		</label>
	</div>
</template>
<script>
import Radio from './Radio';

export default {
  extends: Radio,
  name: 'Radio'
}
</script>