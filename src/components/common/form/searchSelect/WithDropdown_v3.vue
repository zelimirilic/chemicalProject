<template>
	<div @click.stop @keydown="$emit('keydown', $event)" @keyup="$emit('keyup', $event)">
		<slot></slot>
		<div class="options bg-white" :style="optionsStyle" v-show="value" ref="optionsParent">
			<slot name="dropdown"></slot>
		</div>
	</div>
</template>
<script>
import WithDropdown from './WithDropdown';

export default {
  extends: WithDropdown,
  name: 'WithDropdown'
}
</script>
