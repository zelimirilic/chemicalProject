<template>
	<DataTable tableClass="tblFix" :tableData="data" noHeader :perPage="perPage" @update:per-page="$emit('update:per-page', $event)">
		<template #head>
			<tr>
				<Th class="prodNo" prop="artNo" sort export>{{ getTranslation('I00.00002880', 'Product number') }}</Th>
				<Th prop="name" sort export defaultSort>{{ getTranslation('I00.00003590', 'TradeName') }}</Th>
				<Th :prop="getSynonyms" sort export v-if="hasSynonyms">{{ getTranslation('I00.00004890', 'Synonyms') }}</Th>
			</tr>
		</template>
		<template #body="{ item }">
			<tr>
				<td class="prodNo">
					<router-link :to="{ name: 'product', params: { id: idToSlashedString(item.id) } }">
						<span :class="{ higlhlight: spl.isMatch }" v-for="(spl, ind) in splitSentance(item.artNo)" :key="ind">{{ spl.word }}</span>
					</router-link>
				</td>
				<td>
					<router-link :to="{ name: 'product', params: { id: idToSlashedString(item.id) } }">
						<span :class="{ higlhlight: spl.isMatch }" v-for="(spl, ind) in splitSentance(item.name)" :key="ind">{{ spl.word }}</span>
					</router-link>
				</td>
				<td v-if="hasSynonyms">
					<router-link :to="{ name: 'product', params: { id: idToSlashedString(item.id) } }">
						<span :class="{ higlhlight: spl.isMatch }" v-for="(spl, ind) in splitSentance(getSynonyms(item))" :key="ind">{{ spl.word }}</span>
					</router-link>
				</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
import { idToSlashedString } from '../../libraries/common'
import { splitSentance } from '../../libraries/string'
export default {
  props: ['data', 'perPage'],
  methods: {
    getSynonyms(item) {
      return item.product.synonyms.map(f => f.name).join(', ');
    },
    splitSentance(sentance) {
      return splitSentance(sentance, this.$route.query.searchWord);
    },
    idToSlashedString: idToSlashedString,
  },
  computed: {
    hasSynonyms() {
      return this.data.any(f => this.getSynonyms(f).indexOf(this.$route.query.searchWord) > -1);
    }
  }
}
</script>