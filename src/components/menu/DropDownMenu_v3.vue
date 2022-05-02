<template>
	<component :is="component || 'div'" :class="`drop${drop || 'down'}`" @click="dropdownVisible = !dropdownVisible">
		<slot></slot>
		<div class="chemsoft-langmenu__dropdown" :class="{ [`chemsoft-langmenu__dropdown--${align}`]: align, [additionalClass]: additionalClass }" v-show="dropdownVisible">
			<slot name="items"></slot>
		</div>
	</component>
</template>
<script>

export default {
  props: ['items', 'prop', 'component', 'drop', 'align', 'additionalClass'],
  data() {
    return {
      dropdownVisible: false
    }
  },
  methods: {
    close(e) {
      if (!this.$el.contains(e.target)) {
        this.dropdownVisible = false
      }
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisDropdown'] = this;
    window.addEventListener('click', this.close);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.close)
  }
}
</script>