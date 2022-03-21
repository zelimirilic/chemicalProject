<template>
	<DataTable :tableData="data" :title="title" :excelTitle="excelTitle" :perPage="perPage" @update:per-page="$emit('update:per-page', $event)">
		<template #head>
			<tr>
				<Th class="w-20" prop="ArtNo" sort export>{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
				<Th class="w-40" prop="Name" sort defaultSort export>{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="w-30" prop="Supplier" sort export>{{ getTranslation('I00.00004110', 'Supplier') }}</Th>
				<Th v-if="checkPath()" class="w-20" :prop="(item) => getDepartmentNodeNamePathValue(item)" defaultSort sort export>{{ getTranslation('I00.00002940', 'Department') }}</Th>
			</tr>
		</template>
		<template #body="data">
			<tr>
				<td class="w-20">
					<router-link :to="`/product/${data.item.ProdId.ID}_${data.item.ProdId.ID_mdbID}`">
						<span>{{ data.item.ArtNo }}</span>
					</router-link>
				</td>
				<td class="wp-40">
					<router-link :to="`/product/${data.item.ProdId.ID}_${data.item.ProdId.ID_mdbID}`">
						<span>{{ data.item.Name }}</span>
					</router-link>
				</td>
				<td class="wp-30">
					{{ data.item.Supplier }}
				</td>
				<td v-if="data.item.OrganizationPath" class="wp-20">
					<HoverElement>
						{{ data.item.OrganizationName }}
						<template #hover>
							{{ getDepartmentNodeNamePath(data.item) }}
						</template>
					</HoverElement>
				</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
import HoverElement from '../../components/common/others/HoverElement';
import { nodeNamePath } from '../../libraries/tree';
import { camelCaseObj, idsAreEqual } from '../../libraries/common';

export default {
  props: ['data', 'title', 'excelTitle', 'sideTree', 'perPage'],
  components: {
    HoverElement
  },
  methods: {
    getDepartmentNodeNamePath(obj) {
      var item = camelCaseObj(obj);
      var nod = this.sideTree.getAllData().find(f => idsAreEqual(f.item.orgID, item.orgID));
      return nodeNamePath(nod);
    },
    checkPath() {
      return this.data.filter(f => f.OrganizationPath != null).length > 0;
    },
    getDepartmentNodeNamePathValue(item) {
      return this.getDepartmentNodeNamePath(item);
    }
  }
};
</script>