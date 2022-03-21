<template>
	<DataTable tableWrapClass="borderTRBL" :tableData="data" :perPage.sync="perPage" :title="title" noHeader noExcel>
		<template #head>
			<tr>
				<Th prop="mainText" sort defaultSort>{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th prop="emailText" sort>{{ getTranslation('I00.00008030', 'Email') }}</Th>
			</tr>
		</template>
		<template #body="data">
			<tr>
				<td>
					<span class="icons icon-plus circle mr-3" @click="addPerson(data.item)"></span>
					<A @click="addPerson(data.item)">{{ data.item.mainText }}</A>
				</td>
				<td>
					<A @click="addPerson(data.item)">{{ data.item.emailText }}</A>
				</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
export default {
  props: ['data', 'title'],
  data() {
    return {
      perPage: 20,
    };
  },
  methods: {
    addPerson(item) {
      this.$emit('add', item);
    }
  },
  mounted() {
    this.getTranslation('I00.00012130', 'All');
  },
};
</script>