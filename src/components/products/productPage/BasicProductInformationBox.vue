<template>
	<InformationBox additionalClass="p-4" :tooltipTtl="getTranslation('I00.00006260', 'Edit')" :title="getTranslation('I00.00003930', 'Product information')" @edit="$emit('edit')">
		<div class="col-12 mb-2" v-if="product.productIsSubstance || isLocalID(product.id)">
			<p class="tag large">{{ getTranslation('I00.00054990', 'Product is a substance') }}</p>
			<p class="tag large" v-if="isLocalID(product.id)">{{ getTranslation('I00.00050300', 'Own product') }}</p>
		</div>

		<div class="col-auto">
			<h6 class="labelTxt">
				{{ getTranslation('I00.00015350', 'ArticleNumber') }}
				<span class="tooltipInfo icons icon-info plainIcn ml-1" v-if="!isLocalID(product.id) && product.artNo != null && product.artNo != product.originalArtNo" v-tooltip="getTranslation('I00.00054340', 'Original article number') + ': ' + product.originalArtNo"></span>
			</h6>
			<div>{{ product.artNo || product.originalArtNo }}</div>
		</div>
		<div class="col-auto">
			<h6 class="labelTxt">{{ getTranslation('I00.00004110', 'Supplier') }}</h6>
			<div>{{ product.section1Info.supplier.name }}</div>
		</div>
		<div class="col">
			<h6 class="labelTxt">
				{{ getTranslation('I00.00050690', 'UFI code') }}
				<span class="tooltipInfo icons icon-info plainIcn ml-1" v-if="!isLocalID(product.id) && getUfiCode(product) && ((getUfiCode(product) || {}).value || '') != (productFromRoot || {}).ufiFromRoot" v-tooltip="getTranslation('I00.00054460', 'Original ufi no.') + ': ' + (productFromRoot || {}).ufiFromRoot"></span>
			</h6>
			<div>{{ (getUfiCode(product) || {}).value || (productFromRoot || {}).ufiFromRoot }}</div>
		</div>
		<div class="col-12 mt-3" v-if="product.notes">
			<h6 class="labelTxt">{{ getTranslation('I00.00014970', 'Note') }}</h6>
			<div>{{ product.notes }}</div>
		</div>
		<div class="col-12 mt-4">
			<h6 class="labelTxt">{{ getTranslation('I00.00013090', 'Documents') }}</h6>
			<div class="d-flex">
				<a class="docBox" :class="{ disabled: (sds || []).length != 1 }" :href="(sds || []).length == 1 ? (sds[0] || {}).url : ''" target="_blank">
					<span class="docType icon-sds"></span>
					<div>
						<p>{{ getTranslation('I00.00051920', 'Safety Data Sheet') }}</p>
						<p class="date" v-if="(sds || []).length == 1">{{ parseDate((sds[0] || {}).publishDate) }}</p>
					</div>
				</a>
				<div class="docBox" @click="$emit('showSignedActivity', product)">
					<span class="docType icon-sds"></span>
					<p>{{ getTranslation('I00.00004780', 'Safety Sheet') }}</p>
				</div>
			</div>
		</div>
		<SmallLoader v-if="loaderSS" />
	</InformationBox>
</template>

<script>
import InformationBox from './InformationBox';
import { isLocalID } from '../../../libraries/common';
import { getUfiCode } from '../../../libraries/product';
import { parseDate } from '../../../libraries/date';
export default {
  components: {
    InformationBox
  },
  props: ['product', 'productFromRoot', 'loaderSS'],
  methods: {
    isLocalID: isLocalID,
    getUfiCode,
    parseDate: parseDate
  },
  computed: {
    sds() {
      var content = this.product != null ? this.product.fileLinks.filter(f => f.typeOfDocID === 100 && f.typeOfDocID_mdbID === 10 && f.activeSDS) : null;
      var sdsContent = content.find(f => f.docLanguage == this.appSettings.applicationLanguage)
        || content.find(f => f.docLanguage == 'BA')
        || content.first();
      return (sdsContent ? [sdsContent] : []);
    }
  }
};
</script>