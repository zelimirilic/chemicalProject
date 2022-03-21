<template>
	<SearchSelect :value="type" @input="$emit('input', $event.id)" :prop="(f) => (f || {}).nodeNamePath" splitter="\" :items="filteredItems">
		<template #menuBtns>
			<div class="input-group-append" v-tooltip="getTranslation('I00.00013100', 'Add')" v-if="showAdd">
				<span class="input-group-text icons icon-plus" :class="{ disabled: !value }" @click="$emit('add', value)"></span>
			</div>
		</template>
	</SearchSelect>
</template>

<script>
import SearchSelect from '../searchSelect/SearchSelect';
import { propToBool, setAllValidationParents, removeAllValidationParents } from '../../../../libraries/vue';
import { checkIsValid } from '../../../../libraries/forms';
import { idsAreEqual } from '../../../../libraries/common';
import { getProductTypeTreeData, checkIfNodeIsUnderRoot } from '../../../../libraries/tree';
export default {
  components: {
    SearchSelect,
  },
  props: ['value', 'required', 'validations', 'removedItems'],
  data() {
    return {
      typeTreeItems: [],
    }
  },
  methods: {
    checkIsValid: checkIsValid
  },
  computed: {
    type() {
      return this.value ? (this.typeTreeItems || []).find(f => idsAreEqual(f.id, this.value)) : null;
    },
    filteredItems() {
      var items = this.typeTreeItems.filter(f => !(this.removedItems || []).any(g => idsAreEqual(f.id, g)));
      var rootItem = items.find(f => f.isRoot);

      if (rootItem != undefined)
        items = items.filter(f => f.isRoot || checkIfNodeIsUnderRoot(f, rootItem));

      return items;
    },
    showAdd() {
      return this.$listeners.add;
    },
  },
  mounted() {
    var nodeNamePath = node => [...node.getParents().reverse().tail(), node].map(f => f.item.name);
    getProductTypeTreeData()
      .then(response => this.typeTreeItems = response
        .map(f => ({ id: f.item.orgID, nodeNamePath: nodeNamePath(f), isRoot: f.item.isRoot }))
        .toArray().tail());

    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  },
};
</script>