<template>
	<component :is="component" :contenteditable="true" @keyup="emitInput" v-text="localValue" />
</template>

<script>
export default {
  props: ['component', 'value'],
  data(self) {
    return {
      localValue: self.value,
    };
  },
  methods: {
    emitInput(event) {
      return this.$emit('input', event.target.innerText);
    },
  },
}
</script>