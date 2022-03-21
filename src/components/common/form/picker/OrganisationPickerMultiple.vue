<template>
	<div withReadOnlyMode>
		<label class="form-control-label" v-if="text != null">
			{{ text }}
			<sup class="astera" v-if="propToBool(required)">*</sup>
		</label>
		<div class="specialType input-group" :class="{ notValid: !isValid }" @click="openModal()">
			<input class="form-control readOnly" :class="{ notValid: !isValid }" :value="((organisation || {}).item || {}).name" :placeholder="getTranslation('I00.00005390', 'Select department')" />
			<div class="input-group-append" v-tooltip="getTranslation('I00.00013180', 'Departments')"><span class="input-group-text icons icon-department"></span></div>
		</div>
		<div class="multiSelTree hideElm mxhp-156 mt-3 scrollBar" :class="{ oneElm: listOfSelectedItems.length <= 1 }">
			<div class="statements d-flex align-items-center" v-for="(item, index) in listOfSelectedItems" :key="index">
				<div class="col">
					<span v-tooltip.left="nodeNamePath(item)">{{ item.item.name }}</span>
				</div>
			</div>
		</div>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
		<ModalDialog additional-class="w-50 maxvh-50" :withFooter="true" :title="getTranslation('I00.00015720', 'Choose department')" @close="showModalTree = false" v-if="showModalTree" hideClose>
			<TreeModalDialogMultiple :value="organisation" :data="data" @input="onItemSelected" :listOfSelectedItems="listOfSelectedItems" @addItem="addItem" @cancel="cancel()" />
		</ModalDialog>
	</div>
</template>

<script>
import { propToBool, setAllValidationParents, removeAllValidationParents } from '../../../../libraries/vue';
import { checkIsValid } from '../../../../libraries/forms';
import TreeModalDialogMultiple from '../../../tree/TreeModalDialogMultiple';
import { idsAreEqual } from '../../../../libraries/common';
import { nodeNamePath } from '../../../../libraries/tree';
export default {
  components: {
    TreeModalDialogMultiple
  },
  props: ['value', 'data', 'text', 'required', 'validations', 'department', 'dat'],
  data() {
    return {
      isValid: true,
      propToBool: propToBool,
      errorMessage: null,
      showModalTree: false,
      listOfSelectedItems: [],
      listOfSelectedItemsCopy: []
    }
  },
  methods: {
    onItemSelected(event) {
      this.showModalTree = false;
      this.$emit('input', event.item.orgID);
      this.$emit('listOfSelectedItems', this.listOfSelectedItems);
      this.$nextTick(() => this.checkIsValid());
      this.listOfSelectedItemsCopy = [];
    },
    addItem(item) {
      this.selectedItem = item;
      if (this.listOfSelectedItems.length > 0 && this.listOfSelectedItems.filter(x => x.item.orgID.id === item.item.orgID.id).length > 0)
        this.listOfSelectedItems = this.listOfSelectedItems.filter(x => x.item.orgID.id !== item.item.orgID.id);
      else
        this.listOfSelectedItems.push(item);
    },
    openModal() {
      this.listOfSelectedItemsCopy = [...this.listOfSelectedItems];
      this.showModalTree = true;
    },
    cancel() {
      this.showModalTree = false;
      this.listOfSelectedItems = [...this.listOfSelectedItemsCopy];
    },
    checkIsValid: checkIsValid,
    nodeNamePath: nodeNamePath
  },
  mounted() {
    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }

    if (this.department.dataProp === 'usagePlace' && this.dat.usagePlaces !== null && this.dat.usagePlaces !== undefined)
      this.dat.usagePlaces.forEach(x => this.listOfSelectedItems.push(this.sideTree.getAllData().find(y => y.item.orgID.id === x.orgID.id && y.item.orgID.orgID_mdbID === x.orgID.orgID_mdbID)));
    else if (this.department.dataProp === 'storagePlace' && this.dat.storagePlaces !== null && this.dat.storagePlaces !== undefined)
      this.dat.storagePlaces.forEach(x => this.listOfSelectedItems.push(this.sideTree.getAllData().find(y => y.item.orgID.id === x.orgID.id && y.item.orgID.orgID_mdbID === x.orgID.orgID_mdbID)));
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