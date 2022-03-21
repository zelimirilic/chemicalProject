<template>
	<component :is="template" @click="click">
		<slot v-if="!clicked"></slot>
		<slot name="clicked" v-else></slot>
	</component>
</template>

<script>
export default {
  props: ['template'],
  data() {
    return {
      clicked: false
    };
  },
  methods: {
    click() {
      this.clicked = !this.clicked;
      this.$emit('clicked', this.clicked);
    }
  }
}
</script>