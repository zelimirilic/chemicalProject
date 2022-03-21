<template>
	<div>
		<div class="specialType input-group mb-3" v-for="(item, ind) in items" :key="ind">
			<Select class="additionalOpt" :value="item" @input="modifyItem($event, ind)" :items="itemsForSelect(item)" :prop="(f) => getTranslation(f.columnPhrase)" />
			<div class="input-group-append"><span class="input-group-text icons icon-delete" @click="removeItem(item)"></span></div>
		</div>
		<Select class="additionalOpt" :class="{ disabled: items.length > 4 }" :value="emptyItem" @input="addItem" :items="itemsForSelect(emptyItem)" :prop="(f) => getTranslation(f.columnPhrase)" />
		<div class="pt-4 text-right">
			<ButtonOk @click="$emit('input', items)" />
			<ButtonCancel @click="$emit('cancel')" />
		</div>
	</div>
</template>

<script>
import AdditionalColumnsPicker from './AdditionalColumnsPicker';
import Select from '../../common/form/select/Select_v3'

export default {
  extends: AdditionalColumnsPicker,
  name: 'AdditionalColumnsPicker',
  components: {
    Select
  }
}
</script>