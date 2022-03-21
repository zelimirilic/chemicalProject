<template>
	<MainLoader v-if="!ssData" />
	<div class="mainSS" v-else>
		<HeaderProduct :data="ssData" :rcodes="rcodes" :supplier="product.product.supplierName" :originalArtNo="product.product.originalArtNo" :searchableSupplierArtNo="product.product.searchableSupplierArtNo" />

		<section class="orange" v-if="getSymbols(8).length">
			<div class="header d-flex align-items-center">
				<h3>
					<span class="icons icon-shield mr-2"></span>
					<span>
						<b>{{ getTranslation('I00.00028500', 'Warning symbols') }}</b>
					</span>
				</h3>
			</div>
			<Pictograms :symbols="getSymbols(8)" />
		</section>
		<SectionProduct :data="ssData" :section="2" />
		<SectionProduct :data="ssData" :section="7" />

		<SectionProduct class="green" headerIcon="icon-aid" :data="ssData" :section="4">
			<Pictograms :symbols="getSymbols(4)" />
		</SectionProduct>

		<SectionProduct class="red" headerIcon="icon-fire ml-1" :data="ssData" :section="5">
			<Pictograms :symbols="getSymbols(5)" />
		</SectionProduct>

		<SectionProduct :data="ssData" :section="12" />
		<SectionProduct :data="ssData" :section="9" />
		<Substances :substances="product.substances" />
	</div>
</template>

<script>
import eqnode from 'eqnode';
import axios from '../../../axios';
import { idToString, errorDebug, camelCaseObj } from '../../../libraries/common';
import HeaderProduct from '../../../components/products/safetySheet/HeaderProduct';
import Pictograms from '../../../components/common/safetySheet/Pictograms';
import Substances from '../../../components/common/safetySheet/Substances';
import SectionProduct from '../../../components/products/safetySheet/SectionProduct';
import { translatedCodes } from '../../../libraries/product';

export default {
  name: 'SafetySheet',
  components: {
    HeaderProduct,
    Pictograms,
    SectionProduct,
    Substances
  },
  props: ['id'],
  data() {
    return {
      ssData: null,
      msdsSections: null,
      product: null
    };
  },
  methods: {
    nodeSelected() {
      this.ssData = null;
      this.msdsSections = null;
      this.product = null;
      this.getData();
    },
    getData() {
      var orgId = this.sideTree.getSelectedDepartment().orgID;
      axios.cancelAll()
        .postWithCancelToken('/ProductList/GetProductWithSubstances', { productId: this.id })
        .then(response => this.product = response.data)
        .then(() => axios.postWithCancelToken('/SafetySheetData/GetMSDSSections', { productID: this.id, orgID: orgId }))
        .then(response => this.msdsSections = camelCaseObj(JSON.parse(response.data)))
        .then(() => axios.postWithCancelToken('/SafetySheetData/GetSafetySheetDataByProductAndDepartment', { productID: idToString(this.id), orgID: idToString(orgId) }))
        .then(response => {
          var data = camelCaseObj(JSON.parse(response.data.jsonDataSection.data));
          var fnc = function fnc(node, children) {
            if (children && children.length) {
              children.forEach(f => {
                var it = new eqnode(f.item);
                node.addChild(it);
                fnc(it, f.children);
              });
            }
          };
          var node = new eqnode({});
          fnc(node, data.nodelist);
          this.ssData = node;
          this.ssData.msdsSections = this.msdsSections;
        })
        .catch(errorDebug);
    },
    getSymbols(sectionNum) {
      var section = this.ssData.find(f => f.item.type === 'SSSection' && f.item.section === sectionNum);
      if (section) {
        var images = section.children.find(f => f.item.type === 'Images');
        if (images) {
          return images.item.data.split('|').filter(f => f).map(f => ({ symbol: f, comment: null }));
        }
      }
      return [];
    },
  },
  computed: {
    rcodes() {
      return translatedCodes((this.product || {}).productClassificationCode.rcodes || []).sort();
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisSafetySheet'] = this;
    if (this.sideTree.getSelectedDepartment())
      this.getData();
  },
  beforeDestroy() {
    axios.cancelAll();
  }
};
</script>