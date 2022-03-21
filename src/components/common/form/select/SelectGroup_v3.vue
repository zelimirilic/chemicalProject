<template>
	<div class="form-group">
		<label class="form-control-label pb-2" v-if="text">
			<b>{{ text }}</b>
			<sup class="icons astera" v-if="propToBool(required)"></sup>
		</label>
		<div class="input-group">
			<Select :class="{ notValid: !isValid }" :items="items" :value="value" @input="onInput" @click="$emit('click', $event)" :prop="prop" :disabledItems="disabledItems" :compareByHash="compareByHash" />
			<slot></slot>
		</div>
		<label class="notValid Box mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
	</div>
</template>

<script>
import SelectGroup from './SelectGroup';
import Select from './Select_v3';

export default {
  extends: SelectGroup,
  name: 'SelectGroup',
  components: {
    Select
  },
}
</script>