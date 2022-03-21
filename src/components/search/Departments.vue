<template>
	<DataTable tableClass="tblFix" :tableData="data" noHeader :perPage="perPage" @update:per-page="$emit('update:per-page', $event)">
		<template #head>
			<tr>
				<Th prop="name" sort export defaultSort>{{ getTranslation('I00.00004270', 'Name') }}</Th>
			</tr>
		</template>
		<template #body="{ item }">
			<tr>
				<td class="w-20">
					<A @click="goToChemicalList(item.orgID)">
						<span>{{ item.name }}</span>
					</A>
				</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
import { idToSlashedString } from '../../libraries/common'
import { splitSentance } from '../../libraries/string'
import { idsAreEqual } from '../../libraries/common';
export default {
  props: ['data', 'perPage'],
  methods: {
    splitSentance(sentance) {
      return splitSentance(sentance, this.$route.query.searchWord);
    },
    idToSlashedString: idToSlashedString,

    goToChemicalList(orgId) {
      var find = this.sideTree.getAllData().find(f => idsAreEqual(f.item.orgID, orgId));
      this.$store.getters.treeStateClick(find);
      this.$router.push("/reports/chemical/department");
    }
  }
}
</script>