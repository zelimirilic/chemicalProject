<template>
	<DataTable class="whiteCard" :tableData="data" :title="title" :excelTitle="excelTitle" :perPage="perPage" @update:per-page="$emit('update:per-page', $event)">
		<template #additionalRight>
			<p class="mb-0">
				<strong>{{ getTranslation('I00.00040390', 'Revision') + ':' }}</strong>
				{{ revisionDate }}
			</p>
		</template>
		<template #head>
			<tr>
				<Th class="prodNo" prop="ArtNo" sort export>{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="prodName" prop="Name" sort defaultSort export>{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="supplier" prop="Publisher" sort export>{{ getTranslation('I00.00004110', 'Supplier') }}</Th>
				<Th class="consume" prop="Usage" sort export>{{ getTranslation('I00.00012480', 'Annual consumption') }}</Th>
				<Th class="consume" prop="Storage" sort export>{{ getTranslation('I00.00009610', 'Storage') }}</Th>
				<!-- <Th class="consume" :prop="getValueUnits('usage')" name="usage" :sort="getValues('usage')" export>{{ getTranslation('I00.00012480', 'Annual consumption') }}</Th>
				<Th :export="getUnits('usage')" name="usage" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
				<Th class="consume" :prop="getValueUnits('storage')" name="storage" :sort="getValues('storage')" export>{{ getTranslation('I00.00009610', 'Storage') }}</Th>
				<Th :export="getUnits('storage')" name="storage" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th> -->
			</tr>
		</template>
		<template #body="data">
			<tr>
				<td class="prodNo">
					<router-link :to="`/product/${idToSlashedString(data.item)}`">
						<span>{{ data.item.ArtNo }}</span>
					</router-link>
				</td>
				<td class="prodName">
					<router-link :to="`/product/${idToSlashedString(data.item)}`">
						<span>{{ data.item.Name }}</span>
					</router-link>
				</td>
				<td class="supplier">
					<span>{{ data.item.Publisher }}</span>
				</td>
				<td class="consume">
					<span>{{ data.item.Usage }}</span>
				</td>
				<td class="consume">
					<span>{{ data.item.Storage }}</span>
				</td>
				<!-- <td class="consume">
					<p class="row no-gutters" v-for="(arr, ind) in product.item.usage" :key="ind">
						<span class="col-xl-8 col-6 pr-1 text-right">{{ arr.value }}</span>
						<span class="col-xl-4 col-6 noWrap">{{ arr.unit }}</span>
					</p>
				</td>
				<td class="consume">
					<p class="row no-gutters" v-for="(arr, ind) in product.item.storage" :key="ind">
						<span class="col-xl-8 col-6 pr-1 text-right">{{ arr.value }}</span>
						<span class="col-xl-4 col-6 noWrap">{{ arr.unit }}</span>
					</p>
				</td> -->
			</tr>
		</template>
	</DataTable>
</template>

<script>
import { idToSlashedString } from '../../libraries/common';

export default {
  props: ['data', 'title', 'excelTitle', 'revisionDate', 'perPage'],
  methods: {
    idToSlashedString: idToSlashedString,
    // getValueUnits: (prop) => (product) => product[prop].map((f) => (f.value + '') + (f.unit || '')).join('\n'),
    // getValues: prop => product => product[prop].map(f => f.value).join('\n'),
    // getUnits: prop => product => product[prop].map(f => f.unit).join('\n')
  }
}
</script>