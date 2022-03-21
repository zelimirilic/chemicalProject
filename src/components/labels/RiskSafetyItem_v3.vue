<template>
	<div class="statements row no-gutters" :class="{ lightGrayBg: isDisabled }" v-if="item">
		<div class="col wp-60 px-2">{{ item.Code }}</div>
		<div class="col px-2">
			<template v-if="item.Text && item.Text.includes('.?')">
				<template v-for="(part, index) in item.Text.split('.?')">
					<span :class="{ disabled: isDisabled }" :key="index">
						{{ part }}
						<Editable class="d-inline-block mwp-20" v-if="item.Text.split('.?').length > index + 1" :value="additionalInfoSplitted[index]" @input="setAdditionalInfo(index, $event)" component="span" />
					</span>
				</template>
			</template>
			<template v-else>{{ item.Text }}</template>
		</div>
		<div class="col wp-30 ml-auto px-2 text-right" @click="$emit('remove')" :title="getTranslation('I00.00027390', 'Remove')" v-if="isDisabled == false"><span class="icons icon-delete"></span></div>
		<div class="col wp-30 ml-auto mr-1 text-right" v-if="isDisabled">
			<CheckBoxGroup :value="productChecked" @input="selectCode(item)"></CheckBoxGroup>
		</div>
	</div>
</template>

<script>
import Editable from '../common/form/editable/Editable_v3.vue';
import CheckBoxGroup from '../common/form/checkBox/CheckBoxGroup_v3.vue';
export default {
  components: {
    Editable,
    CheckBoxGroup
  },
  props: ['item', 'isDisabled', 'productChecked'],
  methods: {
    setAdditionalInfo(index, event) {
      var parts = this.additionalInfoSplitted.map(f => f);
      parts[index] = event;
      this.item.AdditionalInfoV2Format = parts.join('|');
    },
    selectCode(item) {
      this.$emit('setCodeFromProduct', item);
    },
  },
  computed: {
    additionalInfoSplitted() {
      return (this.item.AdditionalInfoV2Format || '').split('|');
    }
  }
};
</script>