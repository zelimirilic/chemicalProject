<template>
	<component :is="component" :contenteditable="true" @keyup="emitInput" v-text="localValue" />
</template>

<script>
import Editable from './Editable.vue';

export default {
  extends: Editable,
  name: 'Editable'
}
</script>
