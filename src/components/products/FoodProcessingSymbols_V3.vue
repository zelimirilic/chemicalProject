<template>
	<div>
		<div v-if="dat.any()">
			<div>
				<img v-for="(arr, ind) in dat.filter((x) => x.length <= 4)" :key="ind + arr" class="iconPx24 m-1" :src="getSymbol(arr)" :title="arr" :alt="arr" />
				<p v-for="(arr, ind) in dat.filter((x) => x.length > 4)" :key="ind + arr">{{ arr }}</p>
			</div>
		</div>
		<template v-else>-</template>
	</div>
</template>

<script>
export default {
  props: ['dat'],
  methods: {
    getSymbol(symbol) {
      return (this.$store.state.allSymbols.find((x) => x.possibleNames.any((y) => y == symbol)).src).replace('png', 'svg');
    },
  },
}
</script>