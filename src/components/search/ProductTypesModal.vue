<template>
	<DataTable :tableData="data" :perPage="20" noHeader noSearch noFooter v-if="data && data.length > 0">
		<template #head>
			<tr>
				<Th class="prodNo" prop="name" sort export defaultSort>{{ getTranslation('I00.00015350', 'ArticleNumber') }}</Th>
				<Th class="w-40" prop="prodCount" sort export>{{ getTranslation('I00.00003590', 'ProductName') }}</Th>
				<Th prop="prodCount" sort export>{{ getTranslation('I00.00004110', 'Supplier') }}</Th>
			</tr>
		</template>
		<template #body="{ item }">
			<tr>
				<td class="prodNo">
					<router-link :to="`/product/${idToSlashedString({ Id: item.productId, Id_mdbID: item.productId_mdbID })}`">
						<span>{{ item.productArtNo }}</span>
					</router-link>
				</td>
				<td class="w-40">
					<router-link :to="`/product/${idToSlashedString({ Id: item.productId, Id_mdbID: item.productId_mdbID })}`">
						<span>{{ item.productName }}</span>
					</router-link>
				</td>
				<td>
					<router-link :to="`/product/${idToSlashedString({ Id: item.productId, Id_mdbID: item.productId_mdbID })}`">
						<span>{{ item.supplier }}</span>
					</router-link>
				</td>
			</tr>
		</template>
	</DataTable>
	<p v-else>{{ getTranslation('I00.00031040', 'No entries were found') }}</p>
</template>

<script>
import { idToSlashedString } from '../../libraries/common'
export default {
  props: ['data'],
  methods: {
    idToSlashedString: idToSlashedString,
  },
  mounted() {
    this.getTranslation('I00.00012130', 'All');
  },
}
</script>