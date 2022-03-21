<template>
	<DataTable tableWrapClass="mxhp-400 borderTRBL" :tableData="risks" v-if="risks" noHeader noSearch noFooter>
		<template #head>
			<tr>
				<Th class="prodNo" prop="revisionNumber" sort export>{{ getTranslation('I00.00016310', 'Revision number') }}</Th>
				<Th class="w-60" prop="activityName" sort export>{{ getTranslation('I00.00006920', 'Trade name') }}</Th>
				<Th class="w-25" prop="signedBy" sort export>{{ getTranslation('I00.00012370', 'Signed by') }}</Th>
				<Th class="dateCol" :prop="(f) => parseDate(f.signedDate)" sort export>{{ getTranslation('I00.00012350', 'Signed') }}</Th>
			</tr>
		</template>
		<template #body="data">
			<tr>
				<td class="prodNo">
					<router-link :to="{ name: 'readOnlyRisk', params: { riskId: data.item.id, component: 'summary' } }">{{ data.item.revisionNumber }}</router-link>
				</td>
				<td class="wp-60">
					<router-link :to="{ name: 'readOnlyRisk', params: { riskId: data.item.id, component: 'summary' } }">{{ data.item.activityName }}</router-link>
				</td>
				<td class="w-25">
					<router-link :to="{ name: 'readOnlyRisk', params: { riskId: data.item.id, component: 'summary' } }">{{ data.item.signedBy }}</router-link>
				</td>
				<td class="dateCol noWrap">
					<router-link :to="{ name: 'readOnlyRisk', params: { riskId: data.item.id, component: 'summary' } }">{{ parseDate(data.item.signedDate) }}</router-link>
				</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
import { parseDate } from '../../../../libraries/date';

export default {
  props: ['risks'],
  methods: {
    parseDate: parseDate
  }
};
</script>