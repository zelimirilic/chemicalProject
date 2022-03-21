<template>
	<DataTable :tableData="data" :perPage="20" :title="title" ref="dt" noHeader noSearch>
		<template #head>
			<tr>
				<Th class="w-40" prop="Title" sort>{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="w-60" prop="Name" sort>{{ getTranslation('I00.00046590', 'Status') }}</Th>
			</tr>
		</template>
		<template #body="data">
			<tr>
				<td class="w-40">
					{{ data.item.Setting }}
				</td>
				<td class="wp-60">
					{{ translateType(data.item) }}
				</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
export default {
  props: ['data', 'title'],
  methods: {
    translateType(item) {
      return item.Value + (['2', '3'].indexOf(item.SettingType) === -1 ? (' - ' + this.translator[item.Value]) : '');
    }
  },
  computed: {
    translator() {
      return {
        1: this.getTranslation('I00.00051260', 'Enabled'),
        0: this.getTranslation('I00.00051270', 'Disabled'),
      };
    }
  },
  mounted() {
    this.getTranslation('I00.00012130', 'All');
  },
};
</script>