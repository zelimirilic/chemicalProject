<template>
	<div>
		<InputGroup v-model="report.filterName" :text="getTranslation('I00.00048570', 'Filter Name')" required />
		<CheckBoxGroup class="mt-2" v-model="report.isForAllUsers">{{ getTranslation('I00.00047800', 'Use filter for all users') }}</CheckBoxGroup>
		<OrganisationPicker class="mt-3" :text="getTranslation('I00.00002940', 'Department')" :data="sideTree.getAllData()" :value="(report.department || {}).orgID" @input="report.department = { orgID: $event }" />
		<div class="pt-4 text-right">
			<ButtonOk :class="{ disabled: !isModelValid || !isChanged }" @click="emitValue" />
			<ButtonCancel @click="$emit('cancel')" />
		</div>
	</div>
</template>

<script>
import OrganisationPicker from '../../../components/common/form/picker/OrganisationPicker';
import { checkIsValid } from '../../../libraries/vue';
import { hashCode } from '../../../libraries/common';
export default {
  components: {
    OrganisationPicker,
  },
  data() {
    var report = {
      id: '',
      filterName: '',
      isForAllUsers: '',
      department: ''
    };
    return {
      report,
      startHash: hashCode(report),
      $modelValidators: [],
    };
  },
  methods: {
    emitValue() {
      if (!checkIsValid(this))
        return;
      this.$emit('input', this.report);
    },
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    isChanged() {
      return this.startHash !== hashCode(this.report);
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisSaveCustomReport'] = this;
  }
}
</script>