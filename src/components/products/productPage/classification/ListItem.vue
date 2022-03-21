<template>
	<div v-if="item" class="statements d-flex align-items-center">
		<div class="col">
			<template v-if="getSystemTranslation(item.text, 'Phrase').includes('.?')">
				<template v-for="(part, index) in getSystemTranslation(item.text, 'Phrase').split('.?')">
					<span :key="index">
						<span>{{ part }}</span>
						<Editable class="d-inline-block mwp-20 mx-1" v-if="getSystemTranslation(item.text, 'Phrase').split('.?').length > index + 1" :value="additionalInfoSplitted[index]" @input="setAdditionalInfo(index, $event)" component="span" />
					</span>
				</template>
			</template>
			<template v-else>{{ getSystemTranslation(item.text, 'Phrase') }}</template>
		</div>
		<div class="col-auto ml-auto"><span class="icons icon-delete xsmallIcn plainIcn p-2" @click="$emit('remove')" v-tooltip.left="getTranslation('I00.00027390', 'Remove')"></span></div>
	</div>
</template>

<script>
import Editable from '../../../common/form/editable/Editable.vue';
export default {
  components: {
    Editable
  },
  props: ['item'],
  methods: {
    setAdditionalInfo(index, event) {
      var parts = this.additionalInfoSplitted.map(f => f);
      parts[index] = event;
      this.item.additionalInfo = parts.join('|');
    }
  },
  computed: {
    additionalInfoSplitted() {
      return (this.item.additionalInfo || '').split('|');
    }
  }
};
</script>