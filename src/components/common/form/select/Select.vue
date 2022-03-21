<template>
	<select class="form-control" :value="items.indexOf(getVal())" @click="$emit('click', $event)" @change="itemChanged">
		<option v-for="(it, index) in items" :value="index" :disabled="isDisabled(it)" :key="index">{{ propFnc(it) }}</option>
	</select>
</template>
<script>
import { hashCode } from '../../../../libraries/common';
import { propToBool, setAllValidationParents, removeAllValidationParents, propToFnc } from '../../../../libraries/vue';
export default {
  props: ['value', 'items', 'prop', 'compareByHash', 'disabledItems'],
  data() {
    return {
      selectedIndex: null,
    }
  },
  methods: {
    itemChanged(event) {
      this.$emit('input', this.items[event.target.selectedIndex]);
      this.$el.selectedIndex = this.items.indexOf(this.getVal());
    },
    isDisabled(it) {
      if (!this.disabledItems) return false;

      if (propToBool(this.compareByHash)) {
        var selected = this.disabledItems.find((f) => hashCode(f) === hashCode(it));
        return this.disabledItems.indexOf(selected) > -1;
      }
      return this.disabledItems.indexOf(it) > -1;
    },
    getVal() {
      return propToBool(this.compareByHash) ? this.items.find(f => hashCode(f) === (this.value && hashCode(this.value))) : this.value;
    }
  },
  computed: {
    propFnc() {
      return propToFnc(this.prop);
    },
  },
  watch: {
    value() {
      this.selectedIndex = this.items.indexOf(this.getVal());
      this.$el.selectedIndex = this.selectedIndex;
    },
    items() {
      var ind = this.items.indexOf(this.getVal());
      if (ind === -1 && this.getVal()) {
        // this.$emit('input', this.items[this.selectedIndex]);
      } else {
        this.selectedIndex = ind;
        this.$nextTick(() => this.$el.selectedIndex = ind);
      }
    },
  },
  mounted() {
    setTimeout(() => this.$el.selectedIndex = this.items.indexOf(this.getVal()), 10);
    if (this.validations) {
      setAllValidationParents(this);
    }
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  },
}
</script>
