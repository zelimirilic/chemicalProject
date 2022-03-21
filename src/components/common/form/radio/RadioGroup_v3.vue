<template>
	<div class="form-group">
		<label class="form-control-label" v-if="text != null">
			{{ text }}
			<sup class="icons astera" v-if="propToBool(required)"></sup>
		</label>
		<Radio :class="{ notValid: !isValid }" v-for="(item, ind) in items" :value="item === value" :key="ind" @input="onInput(item)">
			<slot>{{ propFnc(item) }}</slot>
		</Radio>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
	</div>
</template>

<script>
import RadioGroup from './RadioGroup';
import Radio from './Radio_v3';

export default {
  extends: RadioGroup,
  name: 'RadioGroup',
  components: {
    Radio
  }
}
</script>