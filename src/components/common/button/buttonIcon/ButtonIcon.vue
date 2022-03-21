<template>
	<div class="input-group-append px-0" v-tooltip="title" v-if="propToBool(withBorder)">
		<span class="input-group-text icons" :class="iconClass" @click="$emit('click', $event)"></span>
	</div>
	<span class="noEvents" v-tooltip="title" v-else>
		<A class="icons" :class="iconClass" @click="$emit('click', $event)"><slot></slot></A>
	</span>
</template>

<script>
import { propToBool } from '../../../../libraries/vue'
export default {
  props: ['title', 'iconClass', 'withBorder'],
  methods: {
    propToBool
  }
}
</script>