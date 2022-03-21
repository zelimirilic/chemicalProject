<template>
	<div @click.stop @keydown="$emit('keydown', $event)" @keyup="$emit('keyup', $event)">
		<slot></slot>
		<div class="options bg-white" :style="optionsStyle" v-show="value" ref="optionsParent">
			<slot name="dropdown"></slot>
		</div>
	</div>
</template>
<script>

import { getAllParentNodes } from '../../../../libraries/common';
export default {
  props: ['value'],
  data() {
    return {
      hoverIndex: -1,
      overflowParent: null,
      optionsPosition: null,
      optionsHeight: 0,
      isUp: false,
    }
  },
  methods: {
    hideOptions() {
      setTimeout(() => this.$emit('input', false), 150);
    },
    caculateOrientation() {
      var overflowBndBox = this.overflowParent.getBoundingClientRect();
      var bndBox = this.$el.getBoundingClientRect();
      this.isUp = overflowBndBox.bottom < bndBox.bottom + this.optionsHeight;
    },
    caculatePosition() {
      var overflowBndBox = this.overflowParent.getBoundingClientRect();
      var bndBox = this.$el.getBoundingClientRect();

      if (this.isUp) {
        this.optionsPosition = { top: `${-this.optionsHeight}px` };
      } else if (overflowBndBox.top > bndBox.top - this.optionsHeight) {
        this.optionsPosition = null;
      }
    },
  },
  computed: {
    optionsStyle() {
      if (!this.value) return;
      var wid = this.$store.getters.state.windowWidth; // eslint-disable-line
      var hei = this.$store.getters.state.windowHeight; // eslint-disable-line

      var bndBox = this.$el.getBoundingClientRect();
      return {
        width: bndBox.width + 'px',
        ...this.optionsPosition,
      }
    },
    isDropdownVisible() {
      return !!this.value;
    },
  },
  watch: {
    isDropdownVisible() {
      this.$nextTick(() => {
        this.optionsHeight = this.$refs.optionsParent.offsetHeight;
        this.caculateOrientation();
      });
    },
    value() {
      this.optionsPosition = null;
      this.$nextTick(() => {
        this.optionsHeight = this.$refs.optionsParent.offsetHeight;
        this.caculatePosition();
      });
    }
  },
  mounted() {
    this.overflowParent = getAllParentNodes(this.$el).head().find(f => window.getComputedStyle(f).overflowY === 'auto');

    if (this.overflowParent)
      this.overflowParent.addEventListener('scroll', this.changeScrollPosition);
    window.addEventListener('click', this.hideOptions);
  },
  beforeDestroy() {
    if (this.overflowParent)
      this.overflowParent.removeEventListener('scroll', this.changeScrollPosition);
    window.removeEventListener('click', this.hideOptions);
  }
}
</script>