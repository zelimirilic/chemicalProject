<template>
	<AccordionBox :tooltipTtl="getTranslation('I00.00006260', 'Edit')" :noEdit="!isLocalProduct" @edit="$emit('edit')">
		<SmallLoader v-if="!substances" />
		<DataTable :tableData="substances" noHeader noSearch noFooter v-else>
			<template #head>
				<tr>
					<th class="prodName">{{ getTranslation('I00.00038130', 'Substance name') }}</th>
					<th class="prodNo casNo">{{ getTranslation('I00.00015710', 'CAS No.') }} / {{ getTranslation('I00.00008780', 'EC No.') }}</th>
					<th>{{ getTranslation('I00.00038150', 'Concentration') }}</th>
					<th>{{ getTranslation('I00.00014470', 'Classification') }}</th>
					<th v-if="isLocalProduct"></th>
				</tr>
			</template>
			<template #body="{ item }">
				<tr>
					<td class="w-40 bold">{{ item.substanceData.name }}</td>
					<td class="prodNo casNo">
						<p class="mb-0" v-if="item.substanceData.cas">{{ item.substanceData.cas }}</p>
						<p class="mb-0" v-if="item.substanceData.eg">{{ item.substanceData.eg }}</p>
					</td>
					<td>{{ item.countLowSign }} {{ item.countLow }} - {{ item.countHighSign }} {{ item.countHigh }}%</td>
					<td>{{ getClassification(item).join(', ') }}</td>
					<td v-if="isLocalProduct"><span class="icons icon-delete smallIcn mr-1 has-tooltip" @click="removeSubstance(item.substanceData.substanceID)"></span></td>
				</tr>
			</template>
		</DataTable>
	</AccordionBox>
</template>
<script>

import axios from '../../../axios';
import { errorDebug } from '../../../libraries/common';
import AccordionBox from './../../products/productPage/AccordionBox';

export default {
  components: {
    AccordionBox
  },
  props: ['substances', 'isLocalProduct', 'productId'],
  methods: {
    getClassification(substance) {
      var newClassification = (substance.clpphrases || []).concat(substance.hphrases || []);
      if (newClassification.any()) return newClassification;

      return (substance.dangerCodes || []).concat(substance.riskPhrases || []);
    },
    removeSubstance(substance) {
      this.confirm(this.getTranslation('I00.00056420', 'Delete substance'), this.getTranslation('I00.00056430', 'Are you sure you want to delete this substance?')).then(() => {
        axios.post('/ProductPage/DeleteSubstance', { productId: this.productId, substanceId: substance })
          .then(response => {
            if (response.data.isDeleted)
              this.$emit('reRenderCompositionList');
          }).catch(errorDebug);
      }).catch(errorDebug);
    }
  },
  mounted() {
    this.getTranslation('I00.00056420', 'Delete substance');
    this.getTranslation('I00.00056430', 'Are you sure you want to delete this substance?');
  }
};
</script>