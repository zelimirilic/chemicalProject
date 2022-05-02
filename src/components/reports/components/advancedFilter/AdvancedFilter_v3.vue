<template>
	<div>
		<div class="card-top">
			<div class="col px-0">
				<p class="form-header">{{ getTranslation('I00.00057510', 'Search match of the following groups:') }}</p>
				<div class="form-inline mt-2">
					<div class="custom-check radio mr-2">
						<input type="radio" class="custom-input" name="globalLogicalOperator" id="globalLogicalOperatorAnd" v-model="globalLogicalOperatorEqualsAnd" :value="true" />
						<label class="custom-label" for="globalLogicalOperatorAnd">{{ getTranslation('I00.00057520', 'All Conditions (AND)') }}</label>
					</div>
					<div class="custom-check radio">
						<input type="radio" class="custom-input" name="globalLogicalOperator" id="globalLogicalOperatorOr" v-model="globalLogicalOperatorEqualsAnd" :value="false" />
						<label class="custom-label" for="globalLogicalOperatorOr">{{ getTranslation('I00.00057530', 'All Conditions (OR)') }}</label>
					</div>
				</div>
			</div>
			<div class="col-auto ml-auto px-0">
				<button class="btn btn-gray" @click="addConditionGroup">{{ getTranslation('I00.00057540', 'Add Condition Group') }}</button>
			</div>
		</div>
		<div class="card-body mxh-50 p-3">
			<ConditionGroup :items="items" :groupId="item.key" :conditions="item.conditions" @removeConditionGroup="removeConditionGroup($event)" v-for="(item, index) in conditionGroups.filter(f => !f.deleted)" :key="'ConditionGroup_' + item.key" :index="index" :isFirst="index === 0" />
		</div>
		<div class="card-footer">
			<button class="btn btn-plain mr-auto" @click="clearFilters">{{ getTranslation('I00.00057590', 'Clear filters') }}</button>
			<button class="btn btn-plain" @click="$emit('cancel')">{{ getTranslation('I00.00017780', 'Cancel') }}</button>
			<button class="btn primary ml-3" @click="search">{{ getTranslation('I00.00004930', 'Search') }}</button>
		</div>
	</div>
</template>

<script>
import ConditionGroup from './ConditionGroup_v3';

export default {
	components: {
		ConditionGroup
	},
	props: ['items'],
	data() {
		return {
			globalLogicalOperatorEqualsAnd: true,
			conditionGroups: [{ key: 0, deleted: false, conditions: [{ key: 0, condition: null, operator: null, value: null, deleted: false }] }],
			uniqueKey: 1
		};
	},
	methods: {
		addConditionGroup() {
			this.conditionGroups.push({ key: this.uniqueKey++, deleted: false, conditions: [{ key: 0, condition: null, operator: null, value: null, deleted: false }] });
		},
		removeConditionGroup(event) {
			this.conditionGroups.find(f => f.key === event).deleted = true;
		},
		clearFilters() {
			this.conditionGroups.map(f => (f.deleted = true));
			this.conditionGroups.push({ key: this.uniqueKey++, deleted: false, conditions: [{ key: 0, condition: null, operator: null, value: null, deleted: false }] });
		},
		search() {}
	}
};
</script>
