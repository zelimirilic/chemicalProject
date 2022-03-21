<template>
	<div>
		<SmallLoader v-if="!value || isLoading" />
		<template v-else>
			<label class="form-control-label">{{ text }}</label>
			<DataTable class="table dataTable" :class="{ readOnly: !appSettings.permissions.organizationSpecificField.full }" :tableData="value || []" noHeader noSearch noFooter>
				<template #head>
					<tr>
						<th class="w-25">{{ getTranslation('I00.00020000', 'Name') }}</th>
						<th class="w-75">{{ getTranslation('I00.00005460', 'Value') }}</th>
					</tr>
				</template>
				<template #body="{ item, index }">
					<OwnFieldValueRow :value="item" :isReview="isReview" @input="itemChanged(index, $event)" ref="fields" />
				</template>
			</DataTable>
		</template>
	</div>
</template>

<script>
import OwnFields from './OwnFields';
import OwnFieldValueRow from './ownFields/OwnFieldValueRow_v3';
import DataTable from '../../../components/common/dataTable/DataTable_v3';
import SmallLoader from '../../../components/common/loaders/SmallLoader_v3';

export default {
  extends: OwnFields,
  name: 'OwnFields',
  components: {
    OwnFieldValueRow,
    DataTable,
    SmallLoader
  }
}
</script>