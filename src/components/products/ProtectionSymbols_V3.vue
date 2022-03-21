<template>
	<div>
		<div v-if="dat.any()">
			<div>
				<img v-for="(arr, ind) in dat" :key="ind + arr" class="iconPx24 m-1" :src="getSymbol(arr)" :title="arr.symbolText" :alt="arr.symbolText" />
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
      return (this.$store.state.allSymbols.find((x) => x.possibleNames.any((y) => y == symbol.symbolCode)).src).replace('png', 'svg');
    },
  },
}
</script>