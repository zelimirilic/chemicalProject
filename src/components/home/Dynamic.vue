
<template>
	<InformationBox additionalClass="p-4" :tooltipTtl="getTranslation('I00.00006260', 'Edit')" :title="data.title" :noEdit="noEdit" @edit="$emit('edit')">
		<div class="col-12" v-html="data.pageHtml" />
	</InformationBox>
</template>

<script>
import InformationBox from '../products/productPage/InformationBox';
export default {
  components: {
    InformationBox,
  },
  props: ['data', 'noEdit'],
}
</script>