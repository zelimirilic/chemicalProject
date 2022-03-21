<template>
	<InformationBox additionalClass="p-4" :tooltipTtl="getTranslation('I00.00006260', 'Edit')" :title="getTranslation('I00.00004890', 'Synonyms')" @edit="$emit('edit')" :loader="loader">
		<div class="col-12">
			<div class="emptyTxt text-center" v-if="!(product.synonyms && product.synonyms.length)">
				<p class="icons icon-noitems plainIcn bigIcn m-0 p-0"></p>
				<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055680', 'No items found') }}</h4>
				<h6 class="mb-0">{{ getTranslation('I00.00055690', 'You don’t have any items here.') }}</h6>
			</div>
			<template v-else>
				<Badge class="m-1" v-for="(synonym, ind) in product.synonyms" :key="ind">{{ synonym.name }}</Badge>
			</template>
		</div>
	</InformationBox>
</template>

<script>
import InformationBox from './InformationBox';
import Badge from '../../common/badge/Badge';
export default {
  components: {
    InformationBox,
    Badge
  },
  props: ['product', 'loader'],
};
</script>