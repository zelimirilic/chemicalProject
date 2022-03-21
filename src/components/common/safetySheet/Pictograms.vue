<template>
	<div v-if="symbols && symbols.length">
		<div class="symbolsBox">
			<div class="text-center" v-for="symbolItem in symbols" :key="symbolItem.symbol">
				<img :src="`${symbolItem.symbol}`" alt="" class="img-fluid iconPx48 m-2" />
				<p class="mx-2 small">{{ symbolItem.comment }}</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: "symbols-group",
  props: ['symbols'],
}
</script>