<template>
	<div class="d-flex condition">
		<SelectGroup class="wp-140 mr-2 mb-0" :text="getTranslation('I00.00057570', 'Column')" :items="items" v-model="selectedColumn" @input="$emit('conditionChanged', { key: conditionId, condition: selectedColumn, operator: selectedOperator, value: value })" />
		<SelectGroup class="wp-140 mr-2 mb-0" :text="getTranslation('I00.00057580', 'Operator')" :title="'You must select a column first'" :items="operators" v-model="selectedOperator" @input="$emit('conditionChanged', { key: conditionId, condition: selectedColumn, operator: selectedOperator, value: value })" />
		<InputGroup class="wp-180 mb-0" :text="getTranslation('I00.00005460', 'Value')" v-model="value" @input="$emit('conditionChanged', { key: conditionId, condition: selectedColumn, operator: selectedOperator, value: value })" />
		<button class="btn btn-plain" :title="getTranslation('I00.00057620', 'Delete rule')" @click="$emit('addCondition')" v-if="isLast"><span class="icons icon-add plainIcn mediumIcn"></span></button>
		<button class="btn btn-plain" :title="getTranslation('I00.00057630', 'Add new rule')" @click="$emit('removeCondition', conditionId)" v-else><span class="icons icon-trash plainIcn mediumIcn"></span></button>
	</div>
</template>

<script>
import SelectGroup from '../../../../components/common/form/select/SelectGroup_v3';
import InputGroup from '../../../../components/common/form/input/InputGroup_v3';

export default {
	components: {
		SelectGroup,
		InputGroup
	},
	props: ['items', 'groupId', 'conditionId', 'isLast'],
	data() {
		return {
			selectedColumn: null,
			selectedOperator: null,
			value: null,
			operators: ['Contains']
		};
	},
	methods: {},
	mounted() {}
};
</script>
