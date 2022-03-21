<template>
	<div class="customSelect" @click.stop.prevent @keydown.down.stop.prevent="go(1)" @keydown.up="go(-1)" @keydown.enter.stop.prevent="selectHoverItem">
		<div class="specialType input-group flex-nowrap">
			<div class="input-group-prepand" @click="setSearchTextFromValue(-1)" v-tooltip="getTranslation('I00.00004930', 'Search')">
				<span class="input-group-text icons icon-producttype"></span>
			</div>
			<div class="form-inline mr-auto">
				<template v-for="(val, ind) in currentValue">
					<span class="py-1" :class="{ hover: ind <= searchHoverIndex }" @mouseenter="searchHoverIndex = ind" @mousemove="searchHoverIndex = ind" @mouseleave="searchHoverIndex = -1" @click="setSearchTextFromValue(ind)" :key="ind">{{ val }}</span>
					<span class="p-1" :class="{ hover: ind <= searchHoverIndex }" @mouseenter="searchHoverIndex = ind" @mousemove="searchHoverIndex = ind" @mouseleave="searchHoverIndex = -1" @click="setSearchTextFromValue(ind)" v-if="ind < currentValue.length - 1" :key="`spl${ind}`">{{ splitter }}</span>
				</template>
				<template v-if="searchText">
					<span class="p-1" :class="{ hover: currentValue.length - 1 <= searchHoverIndex }" @mouseenter="searchHoverIndex = currentValue.length - 1" @mousemove="searchHoverIndex = currentValue.length - 1" @mouseleave="searchHoverIndex = -1" @click="setSearchTextFromValue(currentValue.length - 1)" v-if="currentValue.length">{{ splitter }}</span>
					<input class="form-control" v-model="searchText[searchText.length - 1]" :style="`width:${calculatedWidth}px;`" @input="hoverIndex = -1" @keydown.delete="textDeleted" @keydown.esc="searchText = null" :focus="focus($refs.searchInp)" ref="searchInp" />
				</template>
				<input ref="inp" v-show="false" />
			</div>
			<div class="input-group-append noColor" @click="setSearchTextFromValue((propFnc(value) || []).length)" v-if="!searchText">
				<span class="input-group-text icons icon-arrowup arrowDown" />
			</div>
			<div class="input-group-append noColor" @click="searchText = null" v-else>
				<span class="input-group-text icons icon-arrowup" />
			</div>
			<slot name="menuBtns"></slot>
		</div>
		<div class="options bg-white rounded" :style="optionsStyle" ref="optionsParent" v-show="searchText">
			<div class="option" :class="{ hover: hoverIndex === ind }" v-for="(item, ind) in filteredItems" @click="optionSelected(item)" @mouseenter="hoverIndex = ind" @mousemove="hoverIndex = ind" :key="ind" ref="options">
				<slot :item="item">{{ propFnc(item).join(splitter) }}</slot>
			</div>
		</div>
	</div>
</template>
<script>
import { setAllValidationParents, removeAllValidationParents, propToFnc } from '../../../../libraries/vue';
import { getTextWidth } from '../../../../libraries/string';
import { getAllParentNodes } from '../../../../libraries/common';
export default {
  props: ['value', 'items', 'prop', 'disabledItems', 'splitter'],
  data() {
    return {
      selectedIndex: null,
      searchText: null,
      css: null,
      searchHoverIndex: -1,
      hoverIndex: -1,
      optionsHeight: 0,
      scrollValue: null,
      overflowParent: null,
      optionsPosition: null,
    }
  },
  methods: {
    setSearchTextFromValue(ind) {
      this.searchText = (this.propFnc(this.value) || []).take(ind + 1).concat('');
    },
    focus() {
      this.$nextTick(() => this.$refs.searchInp.focus());
    },
    optionSelected(item) {
      this.searchText = null;
      this.hoverIndex = -1;
      this.$emit('input', item);
    },
    selectHoverItem() {
      if (this.hoverIndex > -1)
        this.optionSelected(this.filteredItems[this.hoverIndex]);
    },
    finishSearch() {
      this.searchText = null;
      this.hoverIndex = -1;
      this.optionsPosition = null;
    },
    textDeleted(event) {
      if (event.code === 'Backspace' && this.searchText.last() === '') {
        this.searchText = this.searchText.length > 1 ? this.searchText.head() : [''];
        event.stopPropagation();
        event.preventDefault();
      }
    },
    betweenZeroAndFilteredLength(num) {
      return Math.max(0, Math.min(num, this.filteredItems.length - 1))
    },
    go(num) {
      if (!this.$refs.options.length) return;
      var par = this.$refs.optionsParent;

      this.hoverIndex = this.betweenZeroAndFilteredLength(this.hoverIndex + num);

      var currentOption = this.$refs.options[this.hoverIndex];

      if (currentOption.offsetTop < par.scrollTop) {
        par.scrollTo(0, currentOption.offsetTop);
      } else if (currentOption.offsetTop + currentOption.offsetHeight > par.offsetHeight + par.scrollTop) {
        par.scrollTo(0, currentOption.offsetTop + currentOption.offsetHeight - par.offsetHeight);
      }
    },
    changeScrollPosition(event) {
      this.scrollValue = event.target.scrollTop;
    },
    caculateOptionsPosition() {
      var overflowBndBox = this.overflowParent.getBoundingClientRect();
      var bndBox = this.$el.getBoundingClientRect();

      if (overflowBndBox.bottom < bndBox.bottom + this.optionsHeight) {
        this.optionsPosition = { top: `${-this.optionsHeight - 1}px` };
      } else if (overflowBndBox.top > bndBox.top - this.optionsHeight) {
        this.optionsPosition = null;
      }
    },
  },
  computed: {
    propFnc() {
      return propToFnc(this.prop);
    },
    optionsStyle() {
      if (!this.searchText) return;

      var wid = this.$store.getters.state.windowWidth; // eslint-disable-line
      var hei = this.$store.getters.state.windowHeight; // eslint-disable-line

      this.caculateOptionsPosition();

      var bndBox = this.$el.getBoundingClientRect();
      return {
        width: bndBox.width + 'px',
        ...this.optionsPosition,
      }
    },
    filteredItems() {
      var searchText = (this.searchText || []).head().join('').toLowerCase();
      var addSearchText = (this.searchText || ['']).last().toLowerCase();

      return this.items.filter(f => {
        var str = this.propFnc(f).join('').toLowerCase();
        return str.startsWith(searchText) && str.substring(searchText.length).indexOf(addSearchText) > -1;
      });
    },
    calculatedWidth() {
      return Math.max(getTextWidth(this.searchText.last(), this.css.font) + 10, 100);
    },
    currentValue() {
      return !this.searchText ? (this.propFnc(this.value) || '') : this.searchText.head();
    },
  },
  watch: {
    filteredItems() {
      this.optionsPosition = null;
      this.$nextTick(() => this.optionsHeight = this.$refs.optionsParent.offsetHeight);
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisSearchSelect'] = this;

    this.overflowParent = getAllParentNodes(this.$el).head().find(f => window.getComputedStyle(f).overflowY === 'auto');

    if (this.overflowParent)
      this.overflowParent.addEventListener('scroll', this.changeScrollPosition);
    window.addEventListener('click', this.finishSearch);
    if (this.validations) {
      setAllValidationParents(this);
    }
    this.css = window.getComputedStyle(this.$refs.inp, null);
  },
  beforeDestroy() {
    if (this.overflowParent)
      this.overflowParent.removeEventListener('scroll', this.changeScrollPosition);
    window.removeEventListener('click', this.finishSearch);
    removeAllValidationParents(this);
  },
}
</script>
