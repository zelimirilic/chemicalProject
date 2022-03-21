<template>
	<div class="overflow" :class="{ sticky: needSticky, nTopMargin: noMargin }" :style="style">
		<slot></slot>
	</div>
</template>

<script>
import { getAllParentNodes } from '../../../libraries/common';
export default {
  props: ['marginTop', 'addHeight', 'noMargin'],
  data() {
    return {
      scrollParent: null,
      scrollParentBndBox: {},
      scrollValue: null,
      myTop: null,
      style: null
    };
  },
  methods: {
    calculateDimensions() {
      this.scrollValue = this.scrollParent.scrollTop;

      var parBndBox = this.scrollParent.getBoundingClientRect();
      Object.keys(JSON.parse(JSON.stringify(parBndBox))).forEach(key => this.$set(this.scrollParentBndBox, key, parBndBox[key]));

      var myBndBox = this.$el.getBoundingClientRect();
      this.myTop = myBndBox.top;

      if (!this.myTop) return;
      var styleCandidate = {
        maxHeight: (parBndBox.height - (this.parentsPadding.bottom + this.marginTop + 1)) + 'px',
      };
      if (this.needSticky) {
        var top = (this.marginTop || 0) + parBndBox.top;
        Object.assign(styleCandidate, {
          top: top + 'px',
          width: this.$el.offsetWidth + 'px',
        })
      }
      this.style = styleCandidate;
    }
  },
  computed: {
    needSticky() {
      return this.scrollValue && this.scrollValue >= this.parentsPadding.top - this.marginTop;
    },
    topToParent() {
      return this.myTop - this.scrollParentBndBox.top;
    },
    parentsStyles() {
      var pars = getAllParentNodes(this.$el);
      return pars.filter((f, ind) => ind <= pars.indexOf(this.scrollParent))
        .map(f => window.getComputedStyle(f));
    },
    parentsPadding() {
      return this.parentsStyles
        .reduce((acc, f) => {
          ['Top', 'Bottom', 'Left', 'Right']
            .forEach(key => acc[key.toLowerCase()] = (acc[key.toLowerCase()] || 0) + parseInt(f['padding' + key].replace('.px')));
          return acc;
        }, {});
    },
  },
  watch: {
    '$store.state.windowHeight'() {
      this.calculateDimensions();
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisSticky'] = this;

    this.scrollParent = getAllParentNodes(this.$el)
      .find(f => window.getComputedStyle(f).overflowY === 'auto');
    this.scrollParent.addEventListener('scroll', this.calculateDimensions);

    this.$nextTick(() => this.$nextTick(() => this.calculateDimensions()));
  },
  beforeDestroy() {
    this.scrollParent.removeEventListener('scroll', this.calculateDimensions);
  },
}
</script>