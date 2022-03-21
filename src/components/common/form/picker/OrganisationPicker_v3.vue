<template>
	<div withReadOnlyMode>
		<label class="form-control-label" v-if="text != null">
			{{ text }}
			<sup class="icons astera" v-if="propToBool(required)"></sup>
		</label>
		<div class="input-group" :class="{ notValid: !isValid }" @click="showModalTree = true">
			<input :value="((organisation || {}).item || {}).name" class="form-control readOnly" :class="{ notValid: !isValid }" />
			<div class="input-group-append"><span class="input-group-text icons icon-department"></span></div>
		</div>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
		<ModalDialog additional-class="wp-400 maxvh-50" :title="getTranslation('I00.00015720', 'Choose department')" @close="showModalTree = false" v-if="showModalTree" hideClose>
			<TreeModalDialog :value="organisation" :data="data" @input="onItemSelected" @cancel="showModalTree = false" />
		</ModalDialog>
	</div>
</template>

<script>
import { propToBool, setAllValidationParents, removeAllValidationParents } from '../../../../libraries/vue_v3';
import { checkIsValid } from '../../../../libraries/forms_v3';
import TreeModalDialog from '../../../tree/TreeModalDialog_v3';
import ModalDialog from '../../../common/modal/ModalDialog_v3';
import { idsAreEqual } from '../../../../libraries/common_v3';
export default {
  components: {
    TreeModalDialog,
    ModalDialog
  },
  props: ['value', 'data', 'text', 'required', 'validations'],
  data() {
    return {
      isValid: true,
      propToBool: propToBool,
      errorMessage: null,
      showModalTree: false,
    }
  },
  methods: {
    onItemSelected(event) {
      this.showModalTree = false;
      this.$emit('input', event.item.orgID);
      this.$nextTick(() => this.checkIsValid());
    },
    checkIsValid: checkIsValid
  },
  mounted() {
    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }
  },
  computed: {
    organisation() {
      return this.value && this.data ? this.data.find(f => idsAreEqual(f.item.orgID, this.value)) : null;
    }
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  },
};
</script>