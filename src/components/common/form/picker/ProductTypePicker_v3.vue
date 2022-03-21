<template>
	<SearchSelect :value="type" @input="$emit('input', $event.id)" :prop="(f) => (f || {}).nodeNamePath" splitter="\" :items="filteredItems">
		<template #menuBtns>
			<button class="input-group-append" :class="{ disabled: !value }" @click="$emit('add', value)" :title="getTranslation('I00.00013100', 'Add')" v-if="showAdd">
				<span class="input-group-text icons icon-plus"></span>
			</button>
		</template>
	</SearchSelect>
</template>

<script>
import ProductTypePicker from './ProductTypePicker';
import SearchSelect from '../searchSelect/SearchSelect_v3';

export default {
  extends: ProductTypePicker,
  name: 'ProductTypePicker',
  components: {
    SearchSelect
  }
}
</script>