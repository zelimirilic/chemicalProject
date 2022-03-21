<template>
	<div>
		<InputGroup class="mb-3" :text="getTranslation('I00.00054520', 'Department text')" :placeholder="getTranslation('I00.00054520', 'Department text')" v-model="selected.props.department.text" />
		<CheckBoxGroup class="mb-3" :text="getTranslation('I00.00054530', 'Department required')" v-model="selected.props.department.required" @input="!selected.props.department.required ? (selected.props.consumption.required = false) : ''" :class="{ disabled: selected.props.dataProp === 'usage' }" />
		<InputGroup class="mb-3" :text="getTranslation('I00.00054540', 'Consumption text')" :placeholder="getTranslation('I00.00054540', 'Consumption text')" v-model="selected.props.consumption.text" />
		<CheckBoxGroup class="mb-3" :text="getTranslation('I00.00054550', 'Consumption required')" v-model="selected.props.consumption.required" :class="{ disabled: !selected.props.department.required }" />
		<SelectGroup text="Class:" :items="Object.keys(widthTranslator)" v-model="selected.props.className" :prop="(f) => widthTranslator[f]" />
		<CheckBoxGroup class="mb-3" :text="getTranslation('I00.00057270', 'Show on iSafe')" v-model="selected.props.iSafe" v-if="selected.props.iSafe !== undefined" />
	</div>
</template>

<script>
import { widthTranslator } from '../../../libraries/applicationFormData'
export default {
  props: ['selected'],
  data() {
    return {
      widthTranslator,
    }
  }
}
</script>