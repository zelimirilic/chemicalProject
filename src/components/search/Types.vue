<template>
	<div>
		<DataTable tableClass="tblFix" :tableData="data" noHeader :perPage="perPage" @update:per-page="$emit('update:per-page', $event)">
			<template #head>
				<tr>
					<Th prop="name" sort export defaultSort>{{ getTranslation('I00.00006430', 'Type') }}</Th>
					<Th class="w-20" prop="prodCount" sort export>{{ getTranslation('I00.00007770', 'Number of products') }}</Th>
				</tr>
			</template>
			<template #body="{ item }">
				<tr>
					<td>
						<A>
							<span :class="{ higlhlight: spl.isMatch }" v-for="(spl, ind) in splitSentance(item.name)" :key="ind" @click="setModalData(item)">{{ spl.word }}</span>
						</A>
					</td>
					<td class="w-20 text-center">
						<A>
							<span @click="setModalData(item)">{{ item.prodCount }}</span>
						</A>
					</td>
				</tr>
			</template>
		</DataTable>
		<ModalDialog additional-class="wp-900" :title="getTranslation('I00.00013050', 'Products')" @close="showModal = false" v-if="showModal">
			<ProductTypesModal :data="modalData"></ProductTypesModal>
		</ModalDialog>
	</div>
</template>

<script>
import axios from '../../axios';
import { idToSlashedString, errorDebug, camelCaseObj } from '../../libraries/common'
import { splitSentance } from '../../libraries/string'
import ProductTypesModal from '../search/ProductTypesModal'
export default {
  props: ['data', 'perPage'],
  data() {
    return {
      showModal: false,
      modalData: null
    };
  },
  components: {
    ProductTypesModal
  },
  methods: {
    splitSentance(sentance) {
      return splitSentance(sentance, this.$route.query.searchWord);
    },
    setModalData(item) {
      this.showModal = true;
      axios.post('/MyList/GetProductTypeProducts', { keyId: item.keyId, keyIdMdbId: item.keyId_mdbID, orgId: this.sideTree.getSelectedDepartment().orgID })
        .then(response => {
          var data = camelCaseObj(response.data);
          this.modalData = data.products;
        })
        .catch(errorDebug);
    },
    idToSlashedString: idToSlashedString,
  },

}
</script>