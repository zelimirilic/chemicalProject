<template>
	<div class="form-group mb-0">
		<label class="form-control-label" v-if="text">
			{{ text }}
			<sup class="icons astera" v-if="propToBool(required)"></sup>
		</label>
		<div class="dropdownGroup input-group align-items-center flex-nowrap">
			<SearchDropdown :value="value" :placeholder="placeholder" @input="onInput" @keyup="$emit('keyup', $event)" :prop="prop" :items="items"></SearchDropdown>
			<slot></slot>
		</div>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
	</div>
</template>
<script>
import SearchDropdownGroup from './SearchDropdownGroup';
import SearchDropdown from './SearchDropdown_v3';

export default {
  extends: SearchDropdownGroup,
  name: 'SearchDropdownGroup',
  components: {
    SearchDropdown
  }
}
</script>