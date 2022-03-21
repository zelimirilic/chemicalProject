<template>
	<div class="multySwitch" withReadOnlyMode>
		<slot></slot>
		<a class="circle" ref="badge"></a>
	</div>
</template>

<script>
import { propToBool } from '../../../../libraries/vue';
export default {
  methods: {
    width() {
      return `${100 / this.slots().length}%`;
    },
    redrawBadge() {
      var checked = this.slots().find(f => f.data && f.data.attrs && propToBool(f.data.attrs.checked));

      var activeIndex = this.slots().indexOf(checked);
      this.$refs.badge.style.left = `${100 / this.slots().length * activeIndex}%`;
      this.$refs.badge.style.width = this.width();
      this.$refs.badge.style.display = activeIndex < 0 ? 'none' : 'flex';

      this.$refs.badge.title = checked ? (checked.data.attrs.title || '') : '';
    },
    changeSlotsStyle() {
      var width = this.width();
      this.slots().forEach(slot => {
        slot.data = slot.data || {};
        slot.data.style = { ...(slot.data.style || {}), width: width };
        slot.data.class = { ...(slot.data.class || {}), switchClicked: propToBool((slot.data.attrs || {}).checked) };
      });
    },
    slots() {
      return this.$slots.default.filter(f => f.tag);
    }
  },
  beforeUpdate() {
    this.redrawBadge();
    this.changeSlotsStyle();
  },
  beforeMount() {
    this.changeSlotsStyle();
  },
  mounted() {
    this.redrawBadge();
  }
};
</script>