<template>
	<DataTable :tableData="data" :title="title" :excelTitle="excelTitle" :perPage="perPage" @update:per-page="$emit('update:per-page', $event)">
		<template #head>
			<tr>
				<Th class="w-20" prop="ArtNo" sort export>{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="w-40" prop="Name" sort defaultSort export>{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="w-60" prop="Publisher" sort export>{{ getTranslation('I00.00004110', 'Supplier') }}</Th>
			</tr>
		</template>
		<template #body="data">
			<tr>
				<td class="w-20">
					<router-link :to="`/product/${data.item.ID}_${data.item.ID_mdbID}`">
						<span>{{ data.item.ArtNo }}</span>
					</router-link>
				</td>
				<td class="wp-40">
					<router-link :to="`/product/${data.item.ID}_${data.item.ID_mdbID}`">
						<span>{{ data.item.Name }}</span>
					</router-link>
				</td>
				<td class="wp-60">
					{{ data.item.Publisher }}
				</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
export default {
  props: ['data', 'title', 'excelTitle', 'perPage'],
};
</script>