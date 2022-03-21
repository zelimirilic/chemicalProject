<template>
	<div class="symbolsBox">
		<div class="symbols mx-2" v-for="(symbol, ind) in symbols.sortBy('imageName')" :key="symbol + ind">
			<img :src="getPictogram(symbol)" class="d-block img-fluid iconPx48 mx-auto" :title="getPictogramTitle(symbol)" />
			<p class="small text-center">{{ getSymbolText(symbol) }}</p>
		</div>
		<span class="icons bigIcn plainIcn icon-newimage" :class="{ 'ml-4': symbols.length }" v-tooltip="getTranslation('I00.00054860', 'Add pictograms')" @click="showEditor" v-if="isLocalProduct(product)"></span>
		<ModalDialog :title="getTranslation('I00.00006610', 'Pictograms')" @close="dangerSymbols = null" additional-class="w-80" v-if="dangerSymbols">
			<SmallLoader v-if="isSaving" />
			<template v-else>
				<SmallLoader @mounted="getAllSymbols" v-if="!allSymbols" />
				<div v-for="key in ['kiffs', 'ghs']" :key="key" v-else>
					<div class="d-flex flex-row flex-wrap align-items-top">
						<template v-for="(symbol, ind) in allSymbols[key].sortBy('imageName')">
							<div class="d-flex flex-column m-2" :key="symbol.ftext + ind">
								<SymbolCheckBox :img="symbol.imageURL" :value="isSelected(symbol)" :text="symbol.phrase" @input="setCheckedSymbol(symbol, $event)" />
							</div>
						</template>
					</div>
					<SelectGroup class="form-inline px-3 pt-3" :text="getTranslation('I00.00018440', 'SignalWord')" :items="Object.values(signalWords)" :value="signalWords.find((f) => f.value == signalWord)" prop="text" @input="signalWord = $event.value" v-if="key === 'ghs'" />
				</div>
				<div class="py-4 text-right">
					<Button :title="getTranslation('I00.00004810', 'Save')" @click="save" />
					<ButtonCancel @click="dangerSymbols = null" />
				</div>
			</template>
		</ModalDialog>
	</div>
</template>

<script>
import SymbolCheckBox from '../../common/form/checkBox/SymbolCheckBox';
import { errorDebug } from '../../../libraries/common';
import axios from '../../../axios';
import { filterDangerSymbols, isLocalProduct, getPictogram, getPictogramTitle } from '../../../libraries/product';
export default {
  components: {
    SymbolCheckBox
  },
  props: ['product', 'protectionSymbols'],
  data() {
    return {
      signalWord: null,
      dangerSymbols: null,
      allSymbols: null,
      isSaving: false,
    };
  },
  methods: {
    getAllSymbols() {
      axios.get('ProductPage/GetAllPictograms')
        .then(response => this.allSymbols = response.data)
        .catch(errorDebug);
    },
    getPictogram: getPictogram,
    getPictogramTitle: getPictogramTitle,
    getSymbolText(symbol) {
      if (typeof symbol === 'string')
        return symbol;

      return ((symbol.description || "").match('^CLP|KIFS') || []).any() ? symbol.phrase : symbol.descriptionTranslation;
    },
    areSymbolsSame(symbol1, symbol2) {
      return symbol1.codeID.code.replace('_W', '_N').replace('_D', '_N') === symbol2.codeID.code;
    },
    isSelected(symbol) {
      return this.dangerSymbols.any(f => this.areSymbolsSame(f, symbol));
    },
    setCheckedSymbol(symbol, checked) {
      this.dangerSymbols = this.dangerSymbols.filter(f => !this.areSymbolsSame(f, symbol));
      if (checked) this.dangerSymbols.push(symbol);
    },
    save() {
      this.isSaving = true;

      var signalWordPromise = this.signalWord !== this.product.signalWord ?
        axios.post('/LocalProduct/SaveProductForChemsoft', { product: { ...this.product, signalWord: this.signalWord } })
          .then(response => this.$emit('saved', { signalWord: response.data.signalWord }))
        : Promise.resolve({ data: this.product });

      signalWordPromise
        .then(() => axios.post('ProductPage/SavePictograms', { productId: this.product.id, dangerSymbols: this.dangerSymbols }))
        .then(response => {
          this.dangerSymbols = null;
          this.isSaving = false;
          this.$emit('saved', { productClassificationCode: { ...this.product.productClassificationCode, dangerSymbols: response.data } })
        }).catch(errorDebug);
    },
    showEditor() {
      this.signalWord = this.product.signalWord;
      this.dangerSymbols = this.product.productClassificationCode.dangerSymbols.map(f => f);
    },
    isLocalProduct,
  },
  computed: {
    symbols() {
      return [
        ...(this.protectionSymbols || []).map(f => f),
        ...(filterDangerSymbols(this.product.productClassificationCode.dangerSymbols).mapMany(f => f))
      ]
    },
    signalWords() {
      return [
        { text: '-', value: null },
        { text: this.getTranslation('I00.00014600', 'Warning'), value: 'W' },
        { text: this.getTranslation('I00.00014610', 'Danger'), value: 'D' },
      ];
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisPictogramsEditor'] = this;
  }
}
</script>