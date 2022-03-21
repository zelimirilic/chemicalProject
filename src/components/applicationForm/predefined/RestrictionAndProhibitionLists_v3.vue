<template>
	<div class="form-group mb-0">
		<label class="form-control-label">{{ text }}</label>
		<SmallLoader v-if="showLoader" />
		<DataTable class="mb-0" :tableData="restrictionLists" noHeader noSearch noFooter v-else>
			<template #head>
				<tr>
					<th>{{ getTranslation('I00.00004130', 'Lists') }}</th>
					<th>{{ getTranslation('I00.00006070', 'Substances') }}</th>
					<th v-if="hasSunsetDate" class="dateCol">{{ getTranslation('I00.00049290', 'Sunset date') }}</th>
				</tr>
			</template>
			<template #body="{ item }">
				<tr>
					<td>{{ getTranslation(item.listText, 'Restriction list name') }}</td>
					<td>{{ item.substances || '-' }}</td>
					<td v-if="hasSunsetDate" class="dateCol">{{ item.sunsetDate }}</td>
				</tr>
			</template>
		</DataTable>
	</div>
</template>

<script>
import RestrictionAndProhibitionLists from './RestrictionAndProhibitionLists';
import DataTable from '../../../components/common/dataTable/DataTable_v3';
import SmallLoader from '../../../components/common/loaders/SmallLoader_v3';


export default {
  extends: RestrictionAndProhibitionLists,
  name: 'RestrictionAndProhibitionLists',
  components: {
    DataTable,
    SmallLoader
  }
}
</script>