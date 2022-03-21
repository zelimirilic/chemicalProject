<template>
	<div>
		<div v-for="(imgs, ind) in getClpOrKifs(ghss, kifs)" :key="ind">
			<img class="iconPx36 ml-1 mb-1" v-for="(img, ind) in imgs" :src="img.pictogram.src" :alt="img.pictogram.description" :title="img.pictogram.description" :key="ind" />
		</div>
	</div>
</template>

<script>
import { getClpOrKifs } from '../../../../libraries/product';
import { getPictograms } from '../../../../libraries/reports';
export default {
  props: ['departmentValue'],
  methods: {
    getPictograms: getPictograms,
    getClpOrKifs: getClpOrKifs,
  },
  computed: {
    ghss() {
      return this.getPictograms(this.departmentValue || [], this.$store.getters.state.ghsPictograms);
    },
    kifs() {
      return this.getPictograms(this.departmentValue || [], this.$store.getters.state.kifPictograms);
    },
  }
}
</script>