<template>
	<div>
		<div class="symbolsBox" v-for="key in Object.keys(dangerSymbols).sort().reverse()" :key="key">
			<template v-if="dangerSymbols[key].length">
				<div class="text-center" v-for="symbol in dangerSymbols[key]" :key="symbol.title">
					<img :src="`${symbol.link}`" alt="" class="img-fluid iconPx48 mx-2 my-1" />
					<p class="mt-1 small">{{ symbol.title }}</p>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
export default {
  props: ['data'],
  methods:
  {
    getPropValue(prop) {
      var it = this.headerChildren.find(f => f.item.type == prop);
      return it ? it.item.data : '';
    },
  },
  computed: {
    headerChildren() {
      return this.data.find(f => f.item.type === 'SSHeader').children;
    },
    dangerSymbols() {
      return this.getPropValue('dangerSymbols').split('|')
        .filter(f => f).map(f => f.split(';'))
        .groupBy(f => f[3])
        .reduce((acc, f) => { acc[f.key] = acc[f.key] || {}; acc[f.key] = f.items.map(g => ({ link: g[2], title: g[0] })); return acc; }, {});
    }
  }
}
</script>