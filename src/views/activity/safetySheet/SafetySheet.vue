<template>
	<MainLoader v-if="!ssData" />
	<div class="mainSS" v-else>
		<HeaderActivity :data="ssData" :risk="risk" :ufiCode="ufiCode" :baseProduct="baseProduct" :noProdSelected="noProdSelected" :supplierName="supplierName" :rphrases="rphrases" />
		<SectionProduct :data="ssData" :section="2" />
		<GeneralInformation :risk="risk" :productNotes="productNotes" :noProdSelected="noProdSelected" :title="getTranslation('I00.00056280', 'General Information')" />
		<PersonalProtection :symbols="getSymbols(['m'])" :baseProductPerosnalProtection="baseProductPerosnalProtection" :personalProtectionEquipment="risk.handlingInstructions.personalProtectionEquipment ? risk.handlingInstructions.personalProtectionEquipment.trim() : null" />

    <SectionActivity :data="getValue(risk.handlingInstructions.precautionaryMeasures) || getSdsData('precautionaryMeasures')" :title="getTranslation('I00.00049730', 'Precautionary measures')" />

		<Handling headerIcon="icon-handling" :baseProductInfo="baseProductSafeHandlingAndStorage" :riskHandling="risk.handlingInstructions.handing ? risk.handlingInstructions.handing.trim() : null" :title="getTranslation('I00.00054610', 'Safe handling and storage')" />

		<SectionActivity class="green" headerIcon="icon-aid" :data="getValue(risk.handlingInstructions.firstAid) || getSdsData('firstAid')" :title="getTranslation('I00.00025580', 'First Aid')" :emergencyNumber="emergencyNumber">
			<Pictograms :symbols="getSymbols(['e'])" />
		</SectionActivity>

		<SectionActivity class="red" headerIcon="icon-fire ml-1" :data="getValue(risk.handlingInstructions.fire) || getSdsData('fire')" :title="getTranslation('I00.00054620', 'Fire fighting measures')">
			<Pictograms :symbols="getSymbols(['f'])" />
		</SectionActivity>

		<SectionActivity class="blue" headerIcon="icon-tree" :data="getValue(risk.handlingInstructions.environment) || getSdsData('environment')" :title="getTranslation('I00.00054630', 'Accidental release measures')" />

		<SectionActivity :data="getValue(risk.handlingInstructions.sanetizationAndWaste) || getSdsData('sanetizationAndWaste')" :title="getTranslation('I00.00054640', 'Disposal considerations')" />

		<Substances :substances="!noProdSelected ? substances : null" :activityItems="!noProdSelected ? risk.activity.activityItems : null" :isActivitySS="true" />
		<Products :data="!noProdSelected ? getProductsValue(risk.activity.activityItems) : null" :additionalProductInfo="additionalProductInfo" :title="getTranslation('I00.00054680', 'Included products')" />
		<Footer :risk="risk" />
	</div>
</template>

<script>
import eqnode from 'eqnode';
import axios from '../../../axios';
import { errorDebug, camelCaseObj, isNullOrEmpty, formatString } from '../../../libraries/common';
import HeaderActivity from '../../../components/activity/safetySheet/HeaderActivity';
import Pictograms from '../../../components/common/safetySheet/Pictograms';
import Substances from '../../../components/common/safetySheet/Substances';
import { getRCodes, allSubstances, baseProduct } from '../../../libraries/risk';
import { translatedCodes } from '../../../libraries/product';
import SectionActivity from '../../../components/activity/safetySheet/SectionActivity';
import SectionProduct from '../../../components/products/safetySheet/SectionProduct';
import Products from '../../../components/activity/safetySheet/Products.vue';
import GeneralInformation from '../../../components/activity/safetySheet/GeneralInformation.vue';
import PersonalProtection from '../../../components/activity/safetySheet/PersonalProtection.vue';
import Handling from '../../../components/activity/safetySheet/Handling.vue';
import Footer from '../../../components/activity/safetySheet/Footer.vue';

export default {
  name: 'SafetySheet',
  components: {
    HeaderActivity,
    Pictograms,
    SectionActivity,
    SectionProduct,
    Substances,
    Products,
    GeneralInformation,
    PersonalProtection,
    Handling,
    Footer
  },
  props: ['id', 'forcedRisk', 'noProdSelected'],
  data(self) {
    return {
      ssData: null,
      product: null,
      risk: self.forcedRisk,
      sdsSections: null,
      additionalProductInfo: null,
      personalProtectionInfo: null,
      ufiCode: null,
      supplierName: null,
      productNotes: null
    };
  },
  methods: {
    nodeSelected() {
      this.ssData = null;
      this.product = null;
      this.getData();
    },
    isNullOrEmpty: isNullOrEmpty,
    formatString: formatString,
    getData() {
      var getRisk = this.forcedRisk ? new Promise(resolve => resolve()) :
        axios.cancelAll()
          .postWithCancelToken('/RiskAssessmentComplete/CreateRiskAssessmentData', { id: this.id })
          .then(response => this.risk = camelCaseObj(JSON.parse(response.data).Risk));

      getRisk
        .then(() => axios.postWithCancelToken('/SafetySheetData/GetActivitySafetySheetData', { riskID: this.id, productID: this.baseProduct ? this.baseProduct.prodID : { id: 0, id_mdbID: 0 } }))
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
        })
        .then(() => {
          this.getSdsSectionsData();
          if (isNullOrEmpty(this.risk.handlingInstructions.handing) ||
            isNullOrEmpty(this.risk.handlingInstructions.firstAid) ||
            isNullOrEmpty(this.risk.handlingInstructions.fire) ||
            isNullOrEmpty(this.risk.handlingInstructions.environment) ||
            isNullOrEmpty(this.risk.handlingInstructions.precautionaryMeasures) ||
            isNullOrEmpty(this.risk.handlingInstructions.sanetizationAndWaste)) {
            this.getSdsSectionsData();
          }
        }).catch(errorDebug);
    },
    translatedCodes: translatedCodes,
    getValue(value) {
      if (isNullOrEmpty(value)) return null;
      var sectionData = value.split("\n");
      return sectionData.filter(f => f).map((str, index) => ({ title: (str.includes(":") ? str.split(":").first() : null), text: str.substring(str.indexOf(':') + 1), id: index + 1 }));
    },
    getProductsValue(value) {
      return !isNullOrEmpty(value) ? value : null;
    },
    getSdsSectionsData() {
      var productsToFill = this.risk.activity.activityItems.map(f => f.prodID);

      if (productsToFill.length) {
        axios.post('/RiskAssessmentComplete/GetSdsDataAndProductsInfoFromProducts', { prodIds: productsToFill, baseProductID: this.baseProduct ? this.baseProduct.prodID : { id: 0, id_mdbID: 0 } })
          .then(response => {
            this.sdsSections = response.data.sdsData;
            this.supplierName = response.data.supplier;
            this.additionalProductInfo = response.data.productsInfo;
            this.productNotes = response.data.productNotes
            if (this.baseProduct && this.additionalProductInfo && this.additionalProductInfo.find(x => x.prodID.id == this.baseProduct.prodID.id && x.prodID.id_mdbID == this.baseProduct.prodID.id_mdbID) !== undefined)
              this.ufiCode = this.additionalProductInfo.find(x => x.prodID.id == this.baseProduct.prodID.id && x.prodID.id_mdbID == this.baseProduct.prodID.id_mdbID).ufiCode;
          })
          .catch(errorDebug);
      }
    },
    getSdsData(prop) {
      if (this.baseProduct && this.baseProduct.prodID && this.sdsSections && this.sdsSections.length > 0 && !this.noProdSelected) {
        var value = this.sdsSections.find(f => f.prodID.id === this.baseProduct.prodID.id && f.prodID.id_mdbID === this.baseProduct.prodID.id_mdbID)[prop];
        return this.getValue(value);
      }
      return null;
    },
    getSymbols(types) {
      return this.risk.symbols
        .filter(f => types.any(type => f.symbol.startsWith(type)))
        .map(f => ({
          symbol: this.$store.state.allSymbols.find(x => x.possibleNames.any(y => y == f.symbol)).src,
          comment: f.comment
        }))
        .unique(q => q.symbol);
    }
  },
  computed: {
    rphrases() {
      return translatedCodes(getRCodes(this.risk));
    },
    substances() {
      return allSubstances(this.risk.activity.activityItems);
    },
    baseProduct() {
      return this.risk ? baseProduct(this.risk) : null;
    },
    emergencyNumber() {
      if (this.ssData.find(f => f.item.section === 4))
        return (this.ssData.find(f => f.item.section === 4).item.sectionTitleImage.emergencyNumber || '').split(':').tail().join(':');
      return null;
    },
    baseProductPerosnalProtection() {
      return this.sdsSections !== null && this.baseProduct !== null && !this.noProdSelected ? this.sdsSections.find(x => x.prodID.id == this.baseProduct.prodID.id && x.prodID.id_mdbID == this.baseProduct.prodID.id_mdbID)['personalProtectionEquipment'].split('\n\n') : null;
    },
    baseProductSafeHandlingAndStorage() {
      return this.sdsSections !== null && this.baseProduct !== null && !this.noProdSelected ? this.sdsSections.find(x => x.prodID.id == this.baseProduct.prodID.id && x.prodID.id_mdbID == this.baseProduct.prodID.id_mdbID)['handing'].split('\n\n') : null;
    }
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