<template>
	<component :is="component || 'li'" :class="`nav-item drop${drop || 'down'}`" @click="dropdownVisible ? hideDropdown() : showDropdown()">
		<slot></slot>
		<div class="dropdown-menu show" :class="{ [`dropdown-menu-${align}`]: align, [additionalClass]: additionalClass }" v-show="dropdownVisible">
			<slot name="items"></slot>
		</div>
	</component>
</template>
<script>
export default {
  props: ['items', 'prop', 'component', 'drop', 'align', 'additionalClass'],
  data() {
    return {
      dropdownVisible: false,
      hoverIndex: -1,
    }
  },
  methods: {
    showDropdown() {
      setTimeout(() => this.dropdownVisible = true, 200);
    },
    hideDropdown() {
      setTimeout(() => this.dropdownVisible = false, 150);
    },
    // onEnter() {
    //   this.showDropdown = false;
    // },
    // onEsc() {
    //   this.showDropdown = false;
    // },
    // slots() {
    //   return this.$slots.items.filter(f => f.tag);
    // },
    // betweenZeroAndSlotsLength(num) {
    //   return Math.max(0, Math.min(num, this.slots().length - 1))
    // },
    // changeSlotsStyle() {
    //   this.slots().forEach((slot, ind) => {
    //     slot.data = slot.data || {};
    //     slot.data.class = { ...(slot.data.class || {}), switchClicked: this.hoverIndex === ind };
    //   });
    // },
    // go(num) {
    //   if (this.slots().length) {
    //     var par = this.$refs.optionsParent;

    //     this.hoverIndex = this.betweenZeroAndSlotsLength(this.hoverIndex + num);
    //   }
    // },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisDropdown'] = this;
    window.addEventListener('click', this.hideDropdown);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hideDropdown);
  },
}
</script>