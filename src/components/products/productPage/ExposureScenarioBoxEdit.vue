<template>
	<InformationBoxEdit additionalClass="p-4" :title="getTranslation('I00.00030190', 'Exposure scenario')" @cancel="$emit('cancel')" @save="save" :isChanged="isChanged" :isModelValid="isModelValid" :loader="loader">
		<div class="col-6">
			<SelectGroup class="mb-0" :text="getTranslation('I00.00046670', 'The exposure scenario for the product has been handled')" :items="decisions" :prop="(f) => getTranslation(f.status_text)" :value="decision" @input="$set(compliance, 'status', $event.status_value)" required />
		</div>
		<div class="col-3">
			<DateGroup :blockDate="true" :text="getTranslation('I00.00046600', 'Received info date')" v-model="compliance.receivedInfoDate" />
		</div>
		<TextAreaGroup class="col-12 mt-3" :text="getTranslation('I00.00020550', 'Comment')" v-model="compliance.complianceNote" :validations="[maxLength(2000)]" required />
		<!-- <div class="col-12">
			<a class="" :href="compliance.url" target="_blank">{{ getTranslation('I00.00030190', 'Exposure scenario') }}</a>
			<span class="icons icon-opentab small align-baseline ml-2"></span>
		</div> -->
	</InformationBoxEdit>
</template>

<script>
import { validators } from '../../../libraries/forms';
import InformationBoxEdit from './InformationBoxEdit';
import { hashCode } from '../../../libraries/common';
import { checkIsValid } from '../../../libraries/vue';

export default {
  components: {
    InformationBoxEdit
  },
  props: ['loader', 'value', 'decisions'],
  data(self) {
    return {
      minDate: null,
      maxDate: null,
      changeMonth: true,
      changeYear: true,
      compliance: { ...self.value },
      startHash: hashCode(self.value),
      $modelValidators: [],
    };
  },
  methods: {
    save() {
      if (!checkIsValid(this)) return;
      this.$emit('input', this.compliance);
    },
    maxLength: validators.maxLength,
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    isChanged() {
      return hashCode(this.compliance) !== this.startHash;
    },
    decision() {
      return this.decisions.find(x => x.status_value === this.compliance.status);
    }
  },
};
</script>