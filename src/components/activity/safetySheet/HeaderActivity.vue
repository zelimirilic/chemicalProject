<template>
	<header :class="getPropValue('productStopped')">
		<div class="d-flex justify-content-between align-items-end mb-4">
			<div>
				<h2 class="mb-1">{{ getTranslation('I00.00004780', 'Safety Sheet') }}</h2>
				<h6 class="italic">{{ getTranslation('I00.00002940', 'Department') }}: {{ getPropValue('department') }}</h6>
			</div>
			<div class="d-flex flex-row align-items-start ml-auto">
				<div v-if="!isSDSDate">
					<p class="subTtl dateTtl">
						<b>{{ getTranslation('I00.00016340', 'SDS date') }}:</b>
					</p>
					<p class="date noWrap">{{ getPropValue('sDSDate') }}</p>
				</div>
				<div class="ml-2">
					<p class="subTtl dateTtl">
						<b>{{ getTranslation('I00.00054650', 'Expiry date') }}:</b>
					</p>
					<p class="date noWrap">{{ parseDate(risk.validUntil) }}</p>
				</div>
				<div class="ml-2" v-if="risk.signedDate">
					<p class="subTtl dateTtl">
						<b>{{ getTranslation('I00.00054660', 'Signed date') }}:</b>
					</p>
					<p class="date noWrap">{{ parseDate(risk.signedDate) }}</p>
				</div>
				<div class="ml-2" v-if="!risk.signedDate && risk.createdDate">
					<p class="subTtl dateTtl">
						<b>{{ getTranslation('I00.00054670', 'Created date') }}:</b>
					</p>
					<p class="date noWrap" v-if="risk.createdDate">{{ parseDate(risk.createdDate) }}</p>
				</div>
			</div>
		</div>
		<div class="d-flex flex-row">
			<div class="w-50 prodDetails">
				<template v-if="baseProduct && !noProdSelected">
					<p class="subTtl">
						<b>{{ getTranslation('I00.00039830', 'Product') }}</b>
					</p>
					<h1>{{ baseProduct.name }}</h1>
				</template>
				<h6 v-if="getProdNumber">{{ getTranslation('I00.00015350', 'ArticleNumber') }}: {{ getProdNumber }}</h6>
				<template v-if="(ufiCode || baseProduct || supplierName) && !noProdSelected">
					<h6 v-if="ufiCode">{{ getTranslation('I00.00050690', 'UFI code') }}: {{ ufiCode }}</h6>
					<h6 v-if="supplierName || baseProduct">{{ supplierName }}</h6>
				</template>
				<div :class="{ 'mt-4': baseProduct && !noProdSelected }">
					<p class="subTtl">
						<b>{{ getTranslation('I00.00025650', 'Activity') }}</b>
					</p>
					<h6>{{ getPropValue('productName') }}</h6>
				</div>
				<div class="mt-2" v-if="risk.additionalRiskSource.length">
					<p class="subTtl">
						<b>{{ getTranslation('I00.00021780', 'Additional sources of risk') }}</b>
					</p>
					<div v-for="(item, index) in risk.additionalRiskSource" :key="index">
						<h6>{{ item }}</h6>
					</div>
				</div>
				<div class="d-inline-block borderRed mr-4 mt-3 pb-2" v-if="rphrases.length && !noProdSelected">
					<h6 class="rcodes" v-for="(item, ind) in rphrases" :key="ind">{{ item }}</h6>
				</div>
			</div>
			<div class="w-50">
				<DangerSymbols :data="data" />
				<Pictograms :symbols="getSymbols(['w'])" />
				<Pictograms :symbols="getSymbols(['ghs'])" />
				<Pictograms :symbols="getSymbols(['p'])" />
			</div>
		</div>
	</header>
</template>

<script>
import { parseDate } from '../../../libraries/date';
import DangerSymbols from '../../../components/common/safetySheet/DangerSymbols';
import Pictograms from '../../../components/common/safetySheet/Pictograms';
export default {
  components: {
    DangerSymbols,
    Pictograms
  },
  props: ['data', 'risk', 'ufiCode', 'rphrases', 'baseProduct', 'supplierName', 'noProdSelected'],
  methods: {
    getPropValue(prop) {
      var it = this.headerChildren.find(f => f.item.type == prop);
      return it ? it.item.data : '';
    },
    getSymbols(types) {
      return this.risk.symbols
        .filter(f => types.any(type => f.symbol.startsWith(type)))
        .map(f => ({ symbol: this.$store.state.allSymbols.find(x => x.possibleNames.any(y => y == f.symbol)).src, comment: f.comment }))
        .unique(q => q.symbol);
    },
    getDescription(phrase) {
      var str = (phrase || "").replace(/^[a-zA-Z]*[^A-Za-z0-9]*\d*/g, ' ');
      if (hasNumbers(str)) {
        var cumul = '';
        for (var i = 1; i < str.length - 1; i++) {
          if (isNumeric(str.charAt(i - 1)) && isLetter(str.charAt(i))) break;
          cumul += str.charAt(i)
        }
        str = str.replace(cumul, ' ');
      }
      str = str.trim();
      str = str.replace(/^[~`!@#$%^&*)(_+-=]/g, '');
      return str;
    },
    parseDate: parseDate,
  },
  computed: {
    headerChildren() {
      return this.data.find(f => f.item.type === 'SSHeader').children;
    },
    getProdNumber() {
      var artNo = (this.baseProduct || {}).artNo
      var intersoliaArtNo = (this.baseProduct || {}).intersoliaArtNo;
      return artNo != intersoliaArtNo ? artNo : null;
    },
    isSDSDate() {
      return this.headerChildren.find(f => f.item.type == 'sDSDate').item.data == '-';
    },
    dangerSymbols() {
      return this.getPropValue('dangerSymbols').split('|')
        .filter(f => f).map(f => f.split(';'))
        .groupBy(f => f[2])
        .reduce((acc, f) => { acc[f.key] = acc[f.key] || {}; acc[f.key] = f.items.map(g => g[1]); return acc; }, {});
    }
  }
}
function isNumeric(str) { return /^-?\d+$/.test(str); }
function hasNumbers(str) { return /\d/.test(str); }
function isLetter(str) { return !(/^[~`!@#$%^&*)(_+-=0-9]/.test(str)); }
</script>