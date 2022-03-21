<template>
	<DataTable :tableData="logs" noHeader noTopPagination noSearch :perPage="20">
		<template #head>
			<tr>
				<Th class="w-15" prop="status" sort>{{ getTranslation('I00.00046590', 'Status') }}</Th>
				<Th class="w-20" :sort="(log) => getTranslation(log.description)" v-if="hasDifferentLogs">{{ getTranslation('I00.00019780', 'Category') }}</Th>
				<Th prop="user.name" sort>{{ getTranslation('I00.00020000', 'Name') }}</Th>
				<Th class="fullDate" :prop="(item) => parseDateTime(item.date)" sort="date" defaultSort="desc">{{ getTranslation('I00.00008620', 'Date') }}</Th>
			</tr>
		</template>
		<template #body="{ item }">
			<tr>
				<td class="w-15">{{ item.status.capitalize() }}</td>
				<td class="w-20" v-if="hasDifferentLogs">{{ getTranslation(item.description, 'Description') }}</td>
				<td>{{ item.user.name }}</td>
				<td class="fullDate">{{ parseDateTime(item.date) }}</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
import { parseDateTime } from '../../libraries/date';

export default {
  props: ['logs'],
  methods: {
    parseDateTime: parseDateTime
  },
  computed: {
    hasDifferentLogs() {
      return this.logs.unique(f => f.category).length > 1;
    }
  },
  mounted() {
    this.getTranslation('I00.00012130', 'All');
  },
};
</script>