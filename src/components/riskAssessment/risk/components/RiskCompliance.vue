<template>
	<div class="col-xl col-12">
		<Subtitle :text="title">
			<div>
				<button class="btn" @click="clearCompliance" v-if="!propToBool(readOnly)" :title="getTranslation('I00.00008300', 'Clear')"><span class="icons icon-clean plainIcn"></span></button>
				<a class="icons icon-exposurescenario ml-1" v-if="exposure.eslink || exposure.exposureScenario.url" :href="exposure.eslink || exposure.exposureScenario.url" target="_blank" :title="exposure.organisationPath"></a>
			</div>
		</Subtitle>

		<div class="px-4 pt-4">
			<SelectGroup :class="{ readOnly: propToBool(readOnly) }" :items="options.exposureStatusList" :value="status" @input="onStatusChanged" :text="getTranslation('I00.00046670', 'The exposure scenario for the product has been handled:')" prop="status_text" :validations="selectValidations" ref="select" />
			<TextAreaGroup class="mb-2" :class="{ readOnly: propToBool(readOnly) }" :text="getTranslation('I00.00020550', 'Comment')" v-model="exposure.complianceNote" @input="() => $refs.select.checkIsValid" :validations="textBoxValidations" ref="textBox" />
		</div>
	</div>
</template>

<script>
import { propToBool } from '../../../../libraries/vue';
import { isNullOrEmpty } from '../../../../libraries/common';
import Subtitle from '../../../common/cardBox/Subtitle';

export default {
  components: {
    Subtitle
  },
  props: ['exposure', 'options', 'title', 'hasCompliances', 'readOnly'],
  data() {
    return {
      isValid: true,
    }
  },
  methods: {
    propToBool: propToBool,
    clearCompliance() {
      this.exposure.status = null;
      this.exposure.complianceNote = null;
    },
    onStatusChanged(event) {
      this.exposure.status = event.status_value;
      this.$refs.textBox.checkIsValid();
    },
    checkIsValid() {
      this.isValid = this.exposure == null || this.exposure.status == null || this.exposure.status.toLowerCase() !== 'under_investigation';
      return this.isValid;
    },
  },
  computed: {
    status() {
      if (this.exposure.status && this.options && this.options.exposureStatusList) {
        var value = this.exposure.status.toLowerCase();
        return this.options.exposureStatusList.find(f => f.status_value.toLowerCase() === value);
      }
      return null;
    },
    isNotEmptyFnc() {
      return {
        fnc: () => this.hasCompliances || !(isNullOrEmpty(this.exposure.status) && isNullOrEmpty(this.exposure.complianceNote)),
        message: () => this.getTranslation('I00.00020310', 'Missing required field')
      };
    },
    selectValidations() {
      if (propToBool(this.readOnly)) return [];
      return [this.isNotEmptyFnc, { fnc: () => !(this.exposure.status == null && !isNullOrEmpty(this.exposure.complianceNote)), message: () => this.getTranslation('I00.00020310', 'Missing required field') }];
    },
    textBoxValidations() {
      if (propToBool(this.readOnly)) return [];
      return [this.isNotEmptyFnc, { fnc: () => !(!isNullOrEmpty(this.exposure.status) && isNullOrEmpty(this.exposure.complianceNote)), message: () => this.getTranslation('I00.00020310', 'Missing required field') }];
    },
  },
};
</script>