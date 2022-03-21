<template>
	<a class="mainButton btn noImage" href="#:" @click="$emit('click', $event)" :title="title">
		<span>
			<slot>{{ title }}</slot>
		</span>
	</a>
</template>

<script>
import Button from './Button';

export default {
  extends: Button,
  name: 'Button'
}
</script>