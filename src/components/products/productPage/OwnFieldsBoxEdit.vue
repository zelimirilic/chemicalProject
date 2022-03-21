<template>
	<AccordionBoxEdit additionalClass="no-gutters" :noRow="true" @cancel="$emit('cancel')" @save="checkRequirements()" :isChanged="isChanged" :isModelValid="isModelValid">
		<SmallLoader v-if="loader" />
		<template v-else>
			<table class="table dataTable">
				<thead>
					<tr>
						<th>{{ getTranslation('I00.00020000', 'Name') }}</th>
						<th class="w-50">{{ getTranslation('I00.00005460', 'Value') }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(ownField, ind) in currentData" :key="ind">
						<td class="bold">{{ ownField.caption }}</td>
						<td class="w-50">
							<Input :value="ownField.value != null ? ownField.value : ownField.departmentValue" @input="$set(ownField, 'value', $event)" v-if="!tryParseArray(ownField.departmentValue)" />
							<Select :items="getItems(ownField)" :value="ownField.value" @input="$set(ownField, 'value', $event)" v-else />
						</td>
					</tr>
				</tbody>
			</table>
		</template>
	</AccordionBoxEdit>
</template>

<script>
import AccordionBoxEdit from './AccordionBoxEdit';
import { hashCode, tryParseArray } from '../../../libraries/common';
import { checkIsValid } from '../../../libraries/vue';

export default {
  components: {
    AccordionBoxEdit
  },
  props: ['value', 'loader'],
  data() {
    return {
      currentData: this.value.map(f => ({ ...f, hashCode: () => hashCode(f) })),
      $modelValidators: [],
    };
  },
  methods: {
    checkRequirements() {
      if (!checkIsValid(this)) return;
      this.$emit('save', this.currentData);
    },
    getItems(item) {
      var items = [null].concat(tryParseArray(item.departmentValue));
      if (item.value && !items.any(f => f === item.value))
        items.push(item.value);
      return items;
    },
    tryParseArray: tryParseArray,
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    isChanged() {
      return this.currentData.any(f => f.hashCode() !== hashCode(f));
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisOwnFieldsEdit'] = this;
  }
};
</script>