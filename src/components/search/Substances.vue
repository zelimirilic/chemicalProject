<template>
	<DataTable tableClass="tblFix" :tableData="data" noHeader :perPage="perPage" @update:per-page="$emit('update:per-page', $event)">
		<template #head>
			<tr>
				<Th prop="name" sort export defaultSort>{{ getTranslation('I00.00011590', 'Name') }}</Th>
				<Th :prop="getSynonyms" sort export v-if="hasSynonyms">{{ getTranslation('I00.00004890', 'Synonyms') }}</Th>
				<Th prop="Eg" sort export>{{ getTranslation('I00.00008780', 'Eg') }}</Th>
				<Th prop="Cas" sort export>{{ getTranslation('I00.00015710', 'Cas') }}</Th>
				<Th class="w-20" prop="prodCount" sort export>{{ getTranslation('I00.00007770', 'Number of products') }}</Th>
			</tr>
		</template>
		<template #body="{ item }">
			<tr>
				<td>
					<span :class="{ higlhlight: spl.isMatch }" v-for="(spl, ind) in splitSentance(item.name)" :key="ind">{{ spl.word }}</span>
				</td>
				<td v-if="hasSynonyms">
					<span :class="{ higlhlight: spl.isMatch }" v-for="(spl, ind) in splitSentance(getSynonyms(item))" :key="ind">{{ spl.word }}</span>
				</td>
				<td>
					<span :class="{ higlhlight: spl.isMatch }" v-for="(spl, ind) in splitSentance(item.eg)" :key="ind">{{ spl.word }}</span>
				</td>
				<td>
					<span :class="{ higlhlight: spl.isMatch }" v-for="(spl, ind) in splitSentance(item.cas)" :key="ind">{{ spl.word }}</span>
				</td>
				<td class="w-20">
					<a @click="openModal(item)">{{ item.prodCount }}</a>
				</td>
				<ModalDialog additional-class="appForm wp-800" :title="getTranslation('I00.00013050', 'Products')" v-if="showModal" @close="closeModal">
					<SubstanceModal :data="products"></SubstanceModal>
				</ModalDialog>
			</tr>
		</template>
	</DataTable>
</template>

<script>
import { idToSlashedString, isNullOrEmpty } from '../../libraries/common'
import { splitSentance } from '../../libraries/string'
import ModalDialog from '../common/modal/ModalDialog.vue';
import SubstanceModal from '../search/SubstanceModal.vue';
import axios from '../../axios';

export default {
  components: {
    ModalDialog,
    SubstanceModal,
  },
  data() {
    return {
      showModal: false,
      products: null
    }
  },
  props: ['data', 'perPage'],
  methods: {
    openModal(item) {
      this.postRequest(item.id.id, item.id.id_mdbID);
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    openProdType() {

    },
    postRequest(id, id_mdbID) {
      this.products = null;
      axios.cancelAll()
        .postWithCancelToken('/MyList/GetInventProdBySubID', { ...this.$route.query, orgId: this.sideTree.getSelectedDepartment().orgID, casAttID: id, cascasAttID_mdbID: id_mdbID })
        .then(response => {
          var data = response.data;
          Object.keys(data).forEach(key => this[key] = data[key]);
          this.products = data;
        });

    },
    getSynonyms(item) {
      if (item.synonymName) {
        return item.synonymName;
      }
      return "";
    },
    splitSentance(sentance) {
      return splitSentance(sentance, this.$route.query.searchWord);
    },
    idToSlashedString: idToSlashedString,
  },
  computed: {
    hasSynonyms() {
      return this.data.any(f => !isNullOrEmpty(this.getSynonyms(f)));
    }
  }
}
</script>