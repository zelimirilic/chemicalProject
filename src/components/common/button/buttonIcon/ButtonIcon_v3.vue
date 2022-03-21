<template>
	<div class="input-group-append px-0" :title="title" v-if="propToBool(withBorder)">
		<span class="input-group-text icons" :class="iconClass" @click="$emit('click', $event)"></span>
	</div>
	<span class="noEvents" :title="title" v-else>
		<A class="icons" :class="iconClass" @click="$emit('click', $event)"><slot></slot></A>
	</span>
</template>
<script>
import ButtonIcon from './ButtonIcon';

export default {
  extends: ButtonIcon,
  name: 'ButtonIcon',
}
</script>