<template>
	<AccordionBox :tooltipTtl="getTranslation('I00.00006260', 'Edit')" :noEdit="!isLocalProduct" @edit="$emit('edit')">
		<SmallLoader v-if="showLoader" />
		<DataTable :tableData="restrictionLists" noHeader noSearch noFooter v-else>
			<template #head>
				<tr>
					<th>{{ getTranslation('I00.00004130', 'Lists') }}</th>
					<th>{{ getTranslation('I00.00006070', 'Substances') }}</th>
					<th v-if="hasSunsetDate" class="dateCol">{{ getTranslation('I00.00049290', 'Sunset date') }}</th>
				</tr>
			</template>
			<template #body="{ item }">
				<tr>
					<td class="bold">{{ getTranslation(item.listText, 'Restriction list name') }}</td>
					<td>{{ item.substances || '-' }}</td>
					<td v-if="hasSunsetDate" class="dateCol">{{ item.sunsetDate }}</td>
				</tr>
			</template>
		</DataTable>
	</AccordionBox>
</template>

<script>
import AccordionBox from './AccordionBox';


export default {
  components: {
    AccordionBox
  },
  props: ['restrictionLists', 'isLocalProduct', 'hasSunsetDate', 'showLoader']
};
</script>