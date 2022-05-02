<template>
	<div class="card white">
		<div class="card-header align-items-center">
			<h5>{{ getTranslation('I00.00057550', 'Condition group') }} {{ index + 1 }}</h5>
			<button class="btn ml-auto" :title="getTranslation('I00.00057600', 'Close condition group')" @click="$emit('removeConditionGroup', groupId)" v-if="!isFirst"><span class="icons icon-close xsmallIcn"></span></button>
		</div>
		<div class="card-body p-3">
			<p class="form-header">{{ getTranslation('I00.00057560', 'Search match:') }}</p>
			<div class="form-inline mt-2">
				<div class="custom-check radio mr-2">
					<input type="radio" class="custom-input" :name="'logicalOperator' + groupId" :id="'logicalOperatorAnd' + groupId" v-model="logicalOperatorEqualsAnd" :value="true" />
					<label class="custom-label" :for="'logicalOperatorAnd' + groupId">{{ getTranslation('I00.00057520', 'All Conditions (AND)') }}</label>
				</div>
				<div class="custom-check radio">
					<input type="radio" class="custom-input" :name="'logicalOperator' + groupId" :id="'logicalOperatorOr' + groupId" v-model="logicalOperatorEqualsAnd" :value="false" />
					<label class="custom-label" :for="'logicalOperatorOr' + groupId">{{ getTranslation('I00.00057530', 'All Conditions (OR)') }}</label>
				</div>
			</div>
			<Condition :items="items" :groupId="groupId" :conditionId="item.key" @conditionChanged="conditionChanged($event)" @addCondition="addCondition()" @removeCondition="removeCondition($event)" v-for="(item, index) in conditions.filter(f => !f.deleted)" :key="'Condition_' + groupId + '_' + item.key" :isLast="index + 1 == conditions.filter(f => !f.deleted).length" />
		</div>
	</div>
</template>

<script>
import Condition from './Condition_v3';

export default {
	components: {
		Condition
	},
	props: ['items', 'groupId', 'conditions', 'isFirst', 'index'],
	data() {
		return {
			logicalOperatorEqualsAnd: true,
			uniqueKey: 1
		};
	},
	methods: {
		conditionChanged(event) {
			this.conditions.find(f => f.key === event.key).condition = event.condition;
			this.conditions.find(f => f.key === event.key).operator = event.operator;
			this.conditions.find(f => f.key === event.key).value = event.value;
		},
		addCondition() {
			this.conditions.push({ key: this.uniqueKey++, condition: null, operator: null, value: null, deleted: false });
		},
		removeCondition(event) {
			this.conditions.find(f => f.key === event).deleted = true;
		}
	}
};
</script>
