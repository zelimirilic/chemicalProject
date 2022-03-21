<template>
	<div>
		<a class="mainButton btn Square" :class="{ disabled: disableTransferButton }" href="#:">
			<span class="buttonImg TransferButton" @click="openTransferModal()"></span>
		</a>
		<ModalDialog v-if="showTransferModal" additional-class="widthPx400" :title="getTranslation('I00.00046093', 'Transfer data from SDS')" @close="closeTransferModal()">
			<h4 class="xxxlTopMargin mBottomPadding">{{ getTranslation('I00.00046094', 'Transfering the SDS data will overwrite text and symbols below. Do you want to continue?') }}</h4>
			<div class="mTopPadding" v-for="(item, ind) in boxesForTransfer.filter((x) => x.hasData)" :key="ind">
				<CheckBoxGroup v-model="item.selected" :text="item.text" />
			</div>
			<div class="xxxlTopMargin xxlPadding lightGrayBg borderTRBL rounded" v-if="boxesForTransfer.filter((x) => !x.hasData).length > 0">
				<h4 class="mBottomPadding">{{ getTranslation('I00.00056710', 'There is no data in SDS for this section(s):') }}</h4>
				<ul class="unstyled">
					<li class="mTopPadding" v-for="(item, ind) in boxesForTransfer.filter((x) => !x.hasData)" :key="ind">
						{{ item.text }}
					</li>
				</ul>
			</div>
			<div class="xxxlTopMargin rightAlign">
				<ButtonOk class="noImage" @click="triggerTransfer()" />
				<ButtonCancel @click="closeTransferModal()" />
			</div>
		</ModalDialog>
	</div>
</template>

<script>

import ModalDialog from '../../../common/modal/ModalDialog_v3';
import CheckBoxGroup from '../../../common/form/checkBox/CheckBoxGroup_v3';
import ButtonOk from "../../../common/button/button/ButtonOk_v3.vue";
import ButtonCancel from "../../../common/button/button/ButtonCancel_v3";

export default {
  props: ['dataForTransfer', 'disableTransferButton'],
  components: {
    ModalDialog,
    CheckBoxGroup,
    ButtonOk,
    ButtonCancel
  },
  data() {
    return {
      showTransferModal: false,
      boxesForTransfer: [{ key: 'Handing', text: this.getTranslation('I00.00049740', 'Handling'), hasData: false, selected: false },
      { key: 'PersonalProtectionEquipment', text: this.getTranslation('I00.00019690', 'PersonalProtectionEqupments'), hasData: false, selected: false },
      { key: 'SanetizationAndWaste', text: this.getTranslation('I00.00019700', 'SanitationAndWasteLabel'), hasData: false, selected: false },
      { key: 'FirstAid', text: this.getTranslation('I00.00025580', 'First aid'), hasData: false, selected: false },
      { key: 'Fire', text: this.getTranslation('I00.00049750', 'Fire'), hasData: false, selected: false }]
    };
  },
  methods: {
    openTransferModal() {
      this.boxesForTransfer.forEach(x => x.hasData = x.selected = this.dataForTransfer[x.key] !== "" && this.dataForTransfer[x.key] !== null);
      if (this.boxesForTransfer.filter(x => x.hasData).length === 0)
        this.$emit('no-data-for-selected-product');
      else
        this.showTransferModal = true;

    },
    triggerTransfer() {
      this.$emit('trigger-transfer', this.boxesForTransfer);
      this.closeTransferModal();
    },
    closeTransferModal() {
      this.showTransferModal = false;
    }
  },
  mounted() {
    this.getTranslation('I00.00056710', 'There is no data in SDS for this section(s):')
    this.getTranslation('I00.00046094', 'Transfering the SDS data will overwrite text and symbols below. Do you want to continue?');
    this.getTranslation('I00.00046093', 'Transfer data from SDS');
    this.getTranslation('I00.00049740', 'Handling');
    this.getTranslation('I00.00019690', 'PersonalProtectionEqupments');
    this.getTranslation('I00.00019700', 'SanitationAndWasteLabel');
    this.getTranslation('I00.00025580', 'First aid');
    this.getTranslation('I00.00049750', 'Fire');
  }
}
</script>