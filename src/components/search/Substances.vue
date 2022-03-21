<template>
	<DataTable tableClass="tblFix" :tableData="data" noHeader :perPage="perPage" @update:per-page="$emit('update:per-page', $event)">
		<template #head>
			<tr>
				<Th prop="name" sort export defaultSort>{{ getTranslation('I00.00011590', 'Name') }}</Th>
				<Th :prop="getSynonyms" sort export v-if="hasSynonyms">{{ getTranslation('I00.00004890', 'Synonyms') }}</Th>
				<Th prop="Eg" sort export>{{ getTranslation('I00.00008780', 'Eg') }}</Th>
				<Th prop="Cas" sort export>{{ getTranslation('I00.00015710', 'Cas') }}</Th>
				<Th class="w-20" prop="prodCount" sort export>{{ getTranslation('I00.00007770', 'Number of products') }}</Th>
			</tr>
		</template>
		<template #body="{ item }">
			<tr>
				<td>
					<span :class="{ higlhlight: spl.isMatch }" v-for="(spl, ind) in splitSentance(item.name)" :key="ind">{{ spl.word }}</span>
				</td>
				<td v-if="hasSynonyms">
					<span :class="{ higlhlight: spl.isMatch }" v-for="(spl, ind) in splitSentance(getSynonyms(item))" :key="ind">{{ spl.word }}</span>
				</td>
				<td>
					<span :class="{ higlhlight: spl.isMatch }" v-for="(spl, ind) in splitSentance(item.eg)" :key="ind">{{ spl.word }}</span>
				</td>
				<td>
					<span :class="{ higlhlight: spl.isMatch }" v-for="(spl, ind) in splitSentance(item.cas)" :key="ind">{{ spl.word }}</span>
				</td>
				<td class="w-20">
					<span>{{ item.prodCount }}</span>
				</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
import { idToSlashedString, isNullOrEmpty } from '../../libraries/common'
import { splitSentance } from '../../libraries/string'
export default {
  props: ['data', 'perPage'],
  methods: {
    getSynonyms(item) {
      if (item.synonymName) {
        return item.synonymName;
      }
      return "";
    },
    splitSentance(sentance) {
      return splitSentance(sentance, this.$route.query.searchWord);
    },
    idToSlashedString: idToSlashedString,
  },
  computed: {
    hasSynonyms() {
      return this.data.any(f => !isNullOrEmpty(this.getSynonyms(f)));
    }
  }
}
</script>