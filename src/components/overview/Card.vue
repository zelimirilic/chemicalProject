<template>
	<div>
		<div class="card-block">
			<h4>
				<A @click="$emit('click', $event)">{{ status }}</A>
			</h4>
		</div>
		<div class="card-footer">
			<A class="wrap" @click="$emit('click', $event)">{{ text }}</A>
		</div>
	</div>
</template>

<script>

export default {
  props: ['status', 'text']
};
</script>