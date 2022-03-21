<template>
	<div>
		<Accordion class="smallBox" accordionClass="p-4" :text="getTranslation('I00.00006950', 'Hazard statements')" v-model="hazardStatementsOpened">
			<div class="mxhp-80 scrollBar">
				<p class="mb-1" v-for="(item, ind) in translatedCodes(filterRCodes(product.productClassificationCode.rcodes).mapMany((f) => f)).sort()" :key="ind">
					{{ item }}
				</p>
			</div>
		</Accordion>
		<Accordion class="smallBox" accordionClass="p-4" :text="getTranslation('I00.00014450', 'Precautionary statements')" v-model="precautionaryStatementsOpened">
			<div class="mxhp-80 scrollBar">
				<p class="mb-1" v-for="(item, ind) in translatedCodes(filterSCodes(product.productClassificationCode.scodes).mapMany((f) => f)).sort()" :key="ind">
					{{ item }}
				</p>
			</div>
		</Accordion>
		<Accordion class="smallBox" accordionClass="p-4" :text="getTranslation('I00.00051950', 'Hazard class and category')" v-model="hazardClassOpened">
			<div class="mxhp-80 scrollBar">
				<p class="mb-1" v-for="(item, ind) in dangerClasses" :key="ind">
					{{ item }}
				</p>
			</div>
		</Accordion>
	</div>
</template>

<script>
import Accordion from '../../../components/common/accordion/Accordion';
import { translatedCodes, filterDangerClasses, filterSCodes, filterRCodes } from '../../../libraries/product';

export default {
  components: {
    Accordion
  },
  props: ['product'],
  data() {
    return {
      hazardStatementsOpened: false,
      hazardClassOpened: false,
      precautionaryStatementsOpened: false,
    };
  },
  methods: {
    translatedCodes: translatedCodes,
    filterRCodes: filterRCodes,
    filterSCodes: filterSCodes
  },
  computed: {
    dangerClasses() {
      return filterDangerClasses((this.product || {}).productClassificationCode.dangerClasses || [])
        .mapMany(f => f).map(f => this.getSystemTranslation(f.text, 'Danger class translation')).sort();
    }
  }
};
</script>