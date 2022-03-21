<template>
	<header :class="getPropValue('productStopped')">
		<div class="d-flex justify-content-between align-items-end mb-4">
			<div>
				<h2 class="mb-1">{{ getTranslation('I00.00004780', 'Safety Sheet') }}</h2>
				<h6 class="italic">{{ getTranslation('I00.00002940', 'Department') }}: {{ getPropValue('department') }}</h6>
			</div>
			<div class="d-flex flex-row align-items-center ml-auto">
				<div>
					<p class="subTtl dateTtl">
						<b>{{ getTranslation('I00.00016290', 'Print Date') }}:</b>
					</p>
					<p class="date noWrap">{{ getPropValue('printDate') }}</p>
				</div>
				<div class="ml-2">
					<p class="subTtl dateTtl">
						<b>{{ getTranslation('I00.00016340', 'SDS date') }}:</b>
					</p>
					<p class="date noWrap">{{ getPropValue('sDSDate') }}</p>
				</div>
			</div>
		</div>
		<div class="d-flex flex-row">
			<div class="w-50 prodDetails">
				<p class="subTtl">
					<b>{{ getTranslation('I00.00039830', 'Product') }}</b>
				</p>
				<h1>{{ getPropValue('productName') }}</h1>
				<h6 v-if="getProdNumber">{{ getTranslation('I00.00015350', 'ArticleNumber') }}: {{ getProdNumber }}</h6>
				<template v-if="getKeyValue(742) || supplier || searchableSupplierArtNo">
					<h6 v-if="getKeyValue(742)">{{ getTranslation('I00.00050690', 'UFI code') }}: {{ getKeyValue(742) }}</h6>
					<h6 v-if="supplier">{{ supplier }}</h6>
				</template>
				<div class="d-inline-block borderRed mr-4 mt-3 pb-2" v-if="rcodes.length">
					<h6 class="rcodes" v-for="(item, ind) in rcodes" :key="ind">{{ item }}</h6>
				</div>
			</div>
			<div class="w-50">
				<DangerSymbols :data="data" />
				<Pictograms :symbols="getSymbols(13)" />
			</div>
		</div>
	</header>
</template>

<script>
import DangerSymbols from '../../../components/common/safetySheet/DangerSymbols';
import Pictograms from '../../../components/common/safetySheet/Pictograms';
export default {
  components: {
    DangerSymbols,
    Pictograms
  },
  props: ['data', 'rcodes', 'supplier', 'originalArtNo', 'searchableSupplierArtNo'],
  methods:
  {
    getPropValue(prop) {
      var it = this.headerChildren.find(f => f.item.type == prop);
      return it ? it.item.data : '';
    },
    getKeyValue(prop) {
      var it = this.data.toArray().find(f => f.keyID == prop)
      return it ? it.data : this.getKeyValueFromMsds(prop);
    },
    getKeyValueFromMsds(prop) {
      var it = this.data.msdsSections.find(f => f.keyID == prop)
      return it ? it.data : '-';
    },
    getSymbols(sectionNum) {
      var section = this.data.find(f => f.item.type === 'SSSection' && f.item.section === sectionNum);
      if (section) {
        var images = section.children.find(f => f.item.type === 'Images');
        if (images) {
          return images.item.data.split('|').filter(f => f).map(f => ({ symbol: f, comment: null }));
        }
      }
      return [];
    },
    getDescription(phrase) {
      var str = phrase.replace(/^[a-zA-Z]*[^A-Za-z0-9]*\d*/g, ' ');
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
    }
  },
  computed: {
    headerChildren() {
      return this.data.find(f => f.item.type === 'SSHeader').children;
    },
    getProdNumber() {
      var artNo = this.getPropValue('artNo');
      var intersoliaArtNo = this.originalArtNo;
      return artNo != intersoliaArtNo ? artNo : null;
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