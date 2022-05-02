<template>
	<div withReadOnlyMode>
		<label class="form-control-label" v-if="text != null">
			{{ text }}
			<sup class="icons astera" v-if="propToBool(required)"></sup>
		</label>
		<div class="specialType input-group" :class="{ notValid: !isValid }" @click="openModal()">
			<input class="form-control readOnly" :class="{ notValid: !isValid }" :value="((organisation || {}).item || {}).name" :placeholder="getTranslation('I00.00005390', 'Select department')" />
			<div class="input-group-append" :title="getTranslation('I00.00013180', 'Departments')"><span class="input-group-text icons icon-department"></span></div>
		</div>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
		<ModalDialog additional-class="wp-640 maxvh-50" :withFooter="true" :title="getTranslation('I00.00015720', 'Choose department')" @close="showModalTree = false" v-if="showModalTree" hideClose>
			<TreeModalDialogMultiple :value="organisation" :data="data" @input="onItemSelected" :listOfSelectedItems="listOfSelectedItems" @addItem="addItem" @removeItem="removeItem" @cancel="cancel()" />
		</ModalDialog>
	</div>
</template>

<script>
import { propToBool, setAllValidationParents, removeAllValidationParents } from '../../../../libraries/vue';
import { checkIsValid } from '../../../../libraries/forms_v3';
import TreeModalDialogMultiple from '../../../tree/TreeModalDialogMultiple_v3';
import { idsAreEqual, getFnc } from '../../../../libraries/common_v3';
import { nodeNamePath } from '../../../../libraries/tree_v3';
import ModalDialog from '../../../common/modal/ModalDialog_v3';
export default {
  components: {
    TreeModalDialogMultiple,
    ModalDialog
  },
  props: ['value', 'data', 'text', 'required', 'validations', 'department', 'dat', 'consumption', 'listOfSelectedItems'],
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
      this.$emit('onItemSelected');
      this.$nextTick(() => this.checkIsValid());
    },
    addItem(item) {
      this.$emit('addItem', item);
    },
    removeItem(item) {
      this.$emit('removeItem', item);
    },
    setMultipleConsumption(event) {
      this.$emit('setMultipleConsumption', event);
    },
    openModal() {
      this.$emit('modalOpened');
      this.showModalTree = true;
    },
    cancel() {
      this.$emit('cancelModal');
      this.showModalTree = false;
    },
    checkIsValid: checkIsValid,
    nodeNamePath: nodeNamePath,
    getFnc
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