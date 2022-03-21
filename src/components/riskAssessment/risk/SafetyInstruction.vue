<template>
	<div class="scrollWrap pb-4">
		<RiskDetail :risk="risk" showProductLink></RiskDetail>

		<CardBox class="mt-5 no-gutters" additionalClass="lightGrayBg borderT" :text="getTranslation('I00.00050390', 'Safety instruction')">
			<div class="px-4">
				<CheckBoxGroup class="mt-4" v-model="risk.handlingInstructions.allPictograms">{{ getTranslation('I00.00037680', 'Show hazard pictograms from all SDS') }}</CheckBoxGroup>
				<div class="flex-row" :class="{ 'd-flex': risk.handlingInstructions.allPictograms, 'd-none': !risk.handlingInstructions.allPictograms }" v-show="risk.handlingInstructions.allPictograms">
					<div class="wp-80 text-center" v-for="(symbol, index) in common.getGhsClpSymbols(risk.activity.activityItems)" :key="symbol + index">
						<img class="d-block img-fluid iconPx48 mx-auto mt-3" :src="getPictogram(symbol)" alt="" v-tooltip="getPictogramTitle(symbol)" />
						<p class="mt-1 small">{{ getPictogramTitle(symbol) }}</p>
					</div>
				</div>
				<div class="flex-row" :class="{ 'd-flex': !risk.handlingInstructions.allPictograms, 'd-none': risk.handlingInstructions.allPictograms }" v-show="!risk.handlingInstructions.allPictograms">
					<div class="wp-80 text-center" v-for="(pick, ind) in common.getGhsClpSymbols(risk.activity.activityItems.filter((f) => f.showPictogram))" :key="pick + ind">
						<img class="d-block img-fluid iconPx48 mx-auto mt-3" :src="getPictogram(pick)" alt="" v-tooltip="pick.name" />
						<p class="mt-1 small">{{ pick.name }}</p>
					</div>
				</div>
				<div class="grayBg rounded borderTRBL mt-3 p-3" v-show="!risk.handlingInstructions.allPictograms">
					<h6 class="pb-2" id="showMe">{{ getTranslation('I00.00037690', 'Choose SDS to get hazard pictograms from: ') }}</h6>
					<CheckBoxGroup class="mt-2" v-for="(act, ind) in risk.activity.activityItems" v-model="act.showPictogram" :key="ind">{{ act.name }}</CheckBoxGroup>
				</div>
				<CheckBoxGroup class="mt-4" :class="{ disabled: risk.activity.activityItems.length === 0 }" :value="productSelected" @input="getBaseProd($event)">{{ getTranslation('I00.00025610', 'Choose SDS to base safety sheet on') }}</CheckBoxGroup>
				<SelectGroup class="w-50 mt-2" :class="{ disabled: !productSelected || risk.activity.activityItems.length === 1 }" :items="risk.activity.activityItems" prop="name" :value="productSelected || defaultSelectedProduct" @input="chooseProduct($event)" />
				<div class="mt-4">
					<A class="btn" @click="openTransferModal()" :class="{ disabled: !hasWriteRights() || !productSelected || this.risk.signed }" :title="getTranslation('I00.00046440', 'Transfer data')">{{ getTranslation('I00.00046440', 'Transfer data') }}</A>
					<A class="btn" :class="{ disabled: !productSelected }" @click="getSds(productSelected.prodID)" :title="getTranslation('I00.00046350', 'View SDS')">{{ getTranslation('I00.00046350', 'View SDS') }}</A>
				</div>
			</div>
		</CardBox>
		<CardBox class="mt-5 no-gutters" additionalClass="lightGrayBg borderT" :text="getTranslation('I00.00019670', 'Instructions to users')">
			<div class="row no-gutters mt-3">
				<div class="col-xl-12 col-12 px-4 pt-2">
					<TextAreaGroup :text="getTranslation('I00.00056280', 'General information')" :validations="[maxLength(4000)]" v-model="risk.generalInformation"></TextAreaGroup>
				</div>
				<div class="col-xl-6 col-12 px-4 pt-4">
					<TextAreaGroup :text="getTranslation('I00.00054600', 'Description of activity')" :validations="[maxLength(4000)]" v-model="risk.handlingDescription"></TextAreaGroup>
				</div>
				<div class="col-xl-6 col-12 px-4 pt-4">
					<TextAreaGroup :text="getTranslation('I00.00019690', 'Personal protection')" :resetIcon="getTransferProp('personalProtectionEquipment')" @reset="resetBox" v-model="risk.handlingInstructions.personalProtectionEquipment"></TextAreaGroup>
				</div>
				<div class="col-xl-6 col-12 px-4 pt-4">
					<TextAreaGroup :text="getTranslation('I00.00049730', 'PrecautionaryMeasuresLabel')" :validations="[maxLength(4000)]" :resetIcon="getTransferProp('precautionaryMeasures')" @reset="resetBox" v-model="risk.handlingInstructions.precautionaryMeasures"></TextAreaGroup>
				</div>
				<div class="col-xl-6 col-12 px-4 pt-4">
					<TextAreaGroup :text="getTranslation('I00.00054610', 'Safe handling and storage')" :resetIcon="getTransferProp('handing')" @reset="resetBox" v-model="risk.handlingInstructions.handing"></TextAreaGroup>
				</div>
				<div class="col-xl-6 col-12 px-4 pt-4">
					<TextAreaGroup :text="getTranslation('I00.00025580', 'First aid')" :resetIcon="getTransferProp('firstAid')" @reset="resetBox" v-model="risk.handlingInstructions.firstAid"></TextAreaGroup>
				</div>
				<div class="col-xl-6 col-12 px-4 pt-4">
					<TextAreaGroup :text="getTranslation('I00.00054620', 'Fire fighting measures')" :resetIcon="getTransferProp('fire')" @reset="resetBox" v-model="risk.handlingInstructions.fire"></TextAreaGroup>
				</div>
				<div class="col-xl-6 col-12 px-4 pt-4">
					<TextAreaGroup :text="getTranslation('I00.00054630', 'Accidental release measures')" :resetIcon="getTransferProp('environment')" @reset="resetBox" v-model="risk.handlingInstructions.environment"></TextAreaGroup>
				</div>
				<div class="col-xl-6 col-12 px-4 pt-4">
					<TextAreaGroup :text="getTranslation('I00.00054640', 'Disposal considerations')" :resetIcon="getTransferProp('sanetizationAndWaste')" @reset="resetBox" v-model="risk.handlingInstructions.sanetizationAndWaste"></TextAreaGroup>
				</div>
			</div>
		</CardBox>
		<CardBox class="mt-5 no-gutters" additionalClass="lightGrayBg borderT" :text="getTranslation('I00.00019620', 'SymbolsLabel')">
			<Subtitle :text="getTranslation('I00.00020190', 'Mandatory')"></Subtitle>
			<div class="d-flex flex-row flex-wrap align-items-center px-3 pt-3">
				<template v-for="symbol in symbolsProtection.map(getSymbol)">
					<div class="d-flex flex-column m-2" :key="symbol.properName">
						<SymbolCheckBox :img="imagePath(symbol)" :value="symbol.selected" @input="setCheckedSymbol(symbol, $event)" :key="'protection' + symbol.properName" />
						<input :class="{ disabled: !symbol.selected }" type="text" class="form-control mt-1" v-model="symbol.comment" @input="changeComment(symbol)" :key="symbol.properName" />
					</div>
				</template>
			</div>
			<Subtitle class="mt-5 borderT" :text="getTranslation('I00.00020200', 'Prohibition')"></Subtitle>
			<div class="d-flex flex-row flex-wrap align-items-center px-3 pt-3">
				<template v-for="symbol in symbolsProhibition.map(getSymbol)">
					<SymbolCheckBox class="m-2" :img="imagePath(symbol)" :value="symbol.selected" @input="setCheckedSymbol(symbol, $event)" :key="'prohibition' + symbol.properName" />
				</template>
			</div>
			<Subtitle class="mt-5 borderT" :text="getTranslation('I00.00018840', 'Warning')"></Subtitle>
			<div class="d-flex flex-row flex-wrap align-items-center px-3 pt-3">
				<template v-for="symbols in symbolsWarning.map((f) => f.map(getSymbol))">
					<SymbolCheckBox class="m-2" :img="imagePath(symbols[0])" :value="symbols[0].selected" @input="setCheckedSymbol(symbols[0], $event)" :key="'warning' + symbols[0].properName" v-if="symbols.length === 1" />
					<div class="d-flex borderTRBL rounded m-2 p-2" v-else :key="symbols.properName">
						<SymbolCheckBox v-for="symbol in symbols" :img="imagePath(symbol)" :value="symbol.selected" @input="setGroupCheckedSymbol(symbol, $event, symbols)" :key="'warning' + symbol.properName" />
					</div>
				</template>
			</div>
			<Subtitle class="mt-5 borderT" :text="getTranslation('I00.00051220', 'Equipment')"></Subtitle>
			<div class="d-flex flex-row flex-wrap align-items-center px-3 pt-3">
				<template v-for="symbol in symbolsPersonalFire.map(getSymbol)">
					<SymbolCheckBox class="m-2" :img="imagePath(symbol)" :value="symbol.selected" @input="setCheckedSymbol(symbol, $event)" :key="'fire' + symbol.properName" />
				</template>
			</div>
		</CardBox>
		<ModalDialog v-if="showTransferModal" additional-class="wp-400" :title="getTranslation('I00.00046093', 'Transfer data from SDS')" @close="closeTransferModal()">
			<h6 class="mb-4">{{ getTranslation('I00.00046094', 'Transfering the SDS data will overwrite text and symbols below. Do you want to continue?') }}</h6>
			<div class="mt-3" v-for="(item, ind) in boxesForTransfer.filter((x) => x.hasData)" :key="ind">
				<CheckBoxGroup v-model="item.selected" :text="item.text" />
			</div>
			<div class="mt-4 p-3 lightGrayBg borderTRBL rounded" v-if="boxesForTransfer.filter((x) => !x.hasData).length > 0">
				<h6 class="mb-3 primaryTxt">{{ getTranslation('I00.00056710', 'There is no data in SDS for this section(s):') }}</h6>
				<ul class="unstyled">
					<li class="mt-2" v-for="(item, ind) in boxesForTransfer.filter((x) => !x.hasData)" :key="ind">
						{{ item.text }}
					</li>
				</ul>
			</div>
			<div class="pt-4 text-right">
				<ButtonOk class="primary" @click="triggerTransfer()" />
				<ButtonCancel @click="closeTransferModal()" />
			</div>
		</ModalDialog>
	</div>
</template>

<script>
import Subtitle from '../../common/cardBox/Subtitle';
import RiskDetail from './components/RiskDetail';
import SymbolCheckBox from '../../common/form/checkBox/SymbolCheckBox';
import axios from '../../../axios';
import { idsAreEqual, ticker } from '../../../libraries/common';
import { validators } from '../../../libraries/forms';
import { getSds } from '../../../libraries/reports';
import { getPictogram, getPictogramTitle } from '../../../libraries/product';
import ModalDialog from '../../common/modal/ModalDialog';

export default {
  components: {
    Subtitle,
    RiskDetail,
    SymbolCheckBox,
    ModalDialog
  },
  data() {
    return {
      symbolsProhibition: [],
      symbolsProtection: [],
      symbolsWarning: [],
      symbolsPersonalFire: [],
      sdsSections: [],
      transferDataOn: this.appSettings.riskAssessmentHandelingInstructionsSDSTransfer,
      openDialog: false,
      defaultSelectedProdId: null,
      noProdSelected: false,
      showTransferModal: false,
      boxesForTransfer: [{ key: 'personalProtectionEquipment', text: this.getTranslation('I00.00019690', 'Personal protection'), hasData: false, selected: false },
      { key: 'precautionaryMeasures', text: this.getTranslation('I00.00049730', 'PrecautionaryMeasuresLabel'), hasData: false, selected: false },
      { key: 'handing', text: this.getTranslation('I00.00054610', 'Safe handling and storage'), hasData: false, selected: false },
      { key: 'firstAid', text: this.getTranslation('I00.00025580', 'First aid'), hasData: false, selected: false },
      { key: 'fire', text: this.getTranslation('I00.00054620', 'Fire fighting measures'), hasData: false, selected: false },
      { key: 'environment', text: this.getTranslation('I00.00054630', 'Accidental release measures'), hasData: false, selected: false },
      { key: 'sanetizationAndWaste', text: this.getTranslation('I00.00054640', 'Disposal considerations'), hasData: false, selected: false }]

    }
  },
  props: ['risk', 'common', 'savingDone'],
  methods: {
    changeComment(symbol) {
      var symb = this.risk.symbols.find(f => f.symbol == symbol.properName);
      symb.comment = symbol.comment;
    },
    getPictogram: getPictogram,
    getPictogramTitle: getPictogramTitle,
    getBaseProd(event) {
      this.noProdSelected = !event;
      this.$emit('noProdSelected', this.noProdSelected);

      return this.risk.handlingInstructions.prodID = event ? this.defaultSelectedProduct.prodID : null;
    },
    getSds: getSds,
    getSymbol(symbol) {
      var find = this.risk.symbols.find(g => g.symbol == symbol.properName);
      return {
        properName: symbol.properName,
        selected: find ? true : false,
        comment: find ? find.comment : "",
        extension: symbol.extension
      };
    },
    returnAllSymbols() {
      return axios.post('/RiskAssessmentComplete/ReturnAllSymbols').then(response => {
        this.symbolsProhibition = response.data.symbolsProhibition;
        this.symbolsProtection = response.data.symbolsProtection;
        this.symbolsWarning = response.data.symbolsWarning
          .map(f => [{ ...f, otherChoice: undefined, otherChoiceName: undefined }, f.otherChoice].filter(f => f));
        this.symbolsPersonalFire = response.data.symbolsPersonalFire;
      });
    },
    setGroupCheckedSymbol(symbol, checked, symbols) {
      symbols.forEach(f => this.setCheckedSymbol(f, false));
      this.setCheckedSymbol(symbol, checked);
    },
    setCheckedSymbol(symbol, checked) {
      this.risk.symbols = this.risk.symbols.filter(f => f.symbol != symbol.properName);
      if (checked)
        this.risk.symbols.push({ symbol: symbol.properName, comment: symbol.comment });
    },
    imagePath(symbol) {
      return this.appSettings.symbolsImageFolder + symbol.properName + symbol.extension;
    },
    chooseProduct(prod) {
      this.defaultSelectedProdId = prod.prodID;
      this.$set(this.risk.handlingInstructions, 'prodID', prod.prodID);
    },
    openTransferModal() {
      ticker.clearMessages();
      this.boxesForTransfer.forEach(x => x.selected = true);
      this.boxesForTransfer.forEach(x => x.hasData = x.selected = this.dataForTransfer[x.key] !== '' && this.dataForTransfer[x.key] !== null);
      if (this.boxesForTransfer.filter(x => x.hasData).length === 0)
        ticker.addWarningMessage(this.getTranslation('I00.00052040', 'No data for selected product'));
      else {
        this.showTransferModal = true;
      }
    },
    triggerTransfer() {
      this.boxDataForReset = { ...this.risk.handlingInstructions };
      this.boxesForTransfer.filter(x => x.selected).map(x => x.key).forEach(prop => this.$set(this.risk.handlingInstructions, prop, this.dataForTransfer[prop]));
      this.risk.symbols = this.dataForTransfer.symbols;
      this.closeTransferModal();
      ticker.addSuccessMessage(this.getTranslation('I00.00051960', 'Transfer finished successfully'));
      this.$emit('savingDone');
    },
    closeTransferModal() {
      this.showTransferModal = false;
    },
    getSdsData() {
      var productsToFill = this.risk.activity.activityItems
        .filter(f => !this.sdsSections.any(g => f.prodID.id === g.prodID.id && f.prodID.id_mdbID === g.prodID.id_mdbID))
        .map(f => f.prodID);

      if (productsToFill.length) {
        axios.post('/RiskAssessmentComplete/GetSdsDataAndProductsInfoFromProducts', { prodIds: productsToFill, baseProductID: { id: 0, id_mdbID: 0 } })
          .then(response => this.sdsSections.pushMany(response.data.sdsData)).catch(this.errorDebug);
      }
    },
    getTransferProp(prop) {
      return this.boxDataForReset != undefined && !this.savingDone && this.boxesForTransfer.find(x => x.key == prop && x.hasData && x.selected) ? prop : null;
    },
    resetBox(box) {
      this.risk.handlingInstructions[box] = this.boxDataForReset[box];
    },
    maxLength: validators.maxLength
  },
  computed: {
    productSelected() {
      if (this.noProdSelected)
        return null;
      if (this.risk.handlingInstructions.prodID)
        return this.risk.activity.activityItems.find(f => idsAreEqual(f.prodID, this.risk.handlingInstructions.prodID));
      else
        return this.risk.activity.activityItems.length === 1 ? this.risk.activity.activityItems[0] : null;
    },
    defaultSelectedProduct() {
      return !this.noProdSelected ? (this.productSelected || this.risk.activity.activityItems.find(f => idsAreEqual(f.prodID, this.defaultSelectedProdId || {})) || this.risk.activity.activityItems.firstOrDefault()) : null;
    },
    dataForTransfer() {
      return this.sdsSections.find(f => idsAreEqual(f.prodID, { ...this.productSelected.prodID, clvid: undefined }));
    }
  },
  mounted() {
    if (!this._inactive) {
      this.returnAllSymbols();
    }
    this.getTranslation('I00.00046094', 'Transfering the SDS data will overwrite text and symbols below. Do you want to continue?');
    this.getTranslation('I00.00046093', 'Transfer data from SDS');
    this.getTranslation('I00.00051960', 'Transfer finished successfully');
    this.getTranslation('I00.00020510', 'SDS missing');
    this.getTranslation('I00.00052040', 'No data for selected product');
    this.getTranslation('I00.00019690', 'Personal protection');
    this.getTranslation('I00.00049730', 'PrecautionaryMeasuresLabel');
    this.getTranslation('I00.00054610', 'Safe handling and storage');
    this.getTranslation('I00.00025580', 'First aid');
    this.getTranslation('I00.00054620', 'Fire fighting measures');
    this.getTranslation('I00.00054630', 'Accidental release measures');
    this.getTranslation('I00.00054640', 'Disposal considerations');
  },
  updated() {
    if (!this.risk.handlingInstructions.allPictograms && this.risk.activity.activityItems.filter(x => x.showPictogram == true).length > 0)
      this.risk.handlingInstructions.selectedPictograms = true;
    else if (this.risk.handlingInstructions.allPictograms)
      this.risk.handlingInstructions.selectedPictograms = false;
  },
  activated() {
    this.getSdsData();
    this.$emit('noProdSelected', !this.productSelected ? true : false);
  },
  deactivated() {
    ticker.clearMessages();
  }
};
</script>