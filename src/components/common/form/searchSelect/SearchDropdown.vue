<template>
	<WithDropdown class="customSelect" :value="showDropdown && filteredItems.length" @input="hideDropdown" @keydown.down.prevent="go(1)" @keydown.up.prevent="go(-1)" @keydown.enter="selectHoverItem" @keydown.esc="onEsc()">
		<div class="specialType input-group flex-nowrap w-100">
			<input class="form-control" v-model="inputValue" @input="inputChanged(), (hoverIndex = -1)" @keyup.enter="onEnter()" @focus="onFocus()" @click="onFocus()" @blur="hideDropdown" ref="searchInp" />
			<div class="input-group-append noColor" @click="showDropdown = !showDropdown">
				<span class="input-group-text icons icon-arrowup" :class="{ arrowDown: !showDropdown }"></span>
			</div>
		</div>
		<template #dropdown>
			<div class="option" :class="{ hover: hoverIndex === ind }" v-for="(item, ind) in filteredItems" @click="itemSelected(item)" @mouseenter="hoverIndex = ind" @mousemove="hoverIndex = ind" :key="ind" ref="options">
				{{ propFnc(item) }}
			</div>
		</template>
	</WithDropdown>
</template>
<script>
import { checkIsValid } from '../../../../libraries/forms';
import { setAllValidationParents, removeAllValidationParents, propToBool, propToFnc } from '../../../../libraries/vue';
import WithDropdown from './WithDropdown.vue';
export default {
  components: {
    WithDropdown
  },
  props: ['items', 'prop', 'value', 'validations', 'required'],
  data() {
    return {
      showDropdown: false,
      inputValue: null,
      hoverIndex: -1,
      savedInputValue: null,
      isValid: true,
      keyEntered: false,
    }
  },
  methods: {
    hideDropdown() {
      setTimeout(() => {
        this.keyEntered = false;
        this.showDropdown = false
      }, 150);
    },
    checkIsValid: checkIsValid,
    focus() {
      this.$nextTick(() => this.$refs.searchInp.focus());
    },
    inputChanged() {
      this.keyEntered = true;
      this.showDropdown = true;
      this.$emit('input', this.prop ? { ...this.value, [this.prop]: this.inputValue } : this.inputValue);
      this.$nextTick(() => this.checkIsValid());
    },
    itemSelected(item) {
      this.showDropdown = false;
      this.keyEntered = false;
      this.inputValue = this.propFnc(item);
      this.$emit('input', item);
      this.$nextTick(() => this.checkIsValid());
    },
    onEnter() {
      this.showDropdown = false;
      this.keyEntered = false;
      this.savedInputValue = this.inputValue;
    },
    onFocus() {
      this.showDropdown = true;
      this.savedInputValue = this.inputValue;
    },
    onEsc() {
      this.inputValue = this.savedInputValue;
      this.showDropdown = false;
      this.keyEntered = false;
      this.$emit('input', this.prop ? { ...this.value, [this.prop]: this.inputValue } : this.inputValue);
      this.$nextTick(() => this.checkIsValid());
    },
    betweenZeroAndFilteredLength(num) {
      return Math.max(0, Math.min(num, this.filteredItems.length - 1))
    },
    go(num) {
      if (this.filteredItems !== undefined) {
        if (!this.$refs.options.length) return;
        this.hoverIndex = this.betweenZeroAndFilteredLength(this.hoverIndex + num);

        var currentOption = this.$refs.options[this.hoverIndex];
        var par = currentOption.parentNode;

        if (currentOption.offsetTop < par.scrollTop) {
          par.scrollTo(0, currentOption.offsetTop);
        } else if (currentOption.offsetTop + currentOption.offsetHeight > par.offsetHeight + par.scrollTop) {
          par.scrollTo(0, currentOption.offsetTop + currentOption.offsetHeight - par.offsetHeight);
        }
      }
    },
    selectHoverItem() {
      if (this.hoverIndex > -1)
        this.itemSelected(this.filteredItems[this.hoverIndex]);
    },
  },
  computed: {
    filteredItems() {
      return this.keyEntered ? this.items.filter(f => this.propFnc(f).toLowerCase().indexOf((this.inputValue || '').toLowerCase()) > -1) : this.items;
    },
    propFnc() {
      return propToFnc(this.prop);
    },
  },
  watch: {
    value() {
      this.inputValue = this.prop ? (this.value || {})[this.prop] : this.value;
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisSearchDropdown'] = this;
    this.inputValue = this.prop ? (this.value || {})[this.prop] : this.value;
    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  }
}
</script>