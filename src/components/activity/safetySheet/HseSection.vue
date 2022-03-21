<template>
	<section v-show="(data.allOptionsThatMakeRiskCalcHigher || []).length > 0">
		<div class="header d-flex align-items-center">
			<h3>
				<span :class="`icons ${headerIcon || 'icon-atom'} mr-2`"></span>
				<span>
					<b>{{ title }}</b>
				</span>
			</h3>
		</div>
		<div v-for="(type, ind) in ['H', 'S', 'E']" class="d-flex mt-2" :key="ind">
			<template v-if="getRiskCalc(type).length">
				<p v-for="(option, ind) in getRiskCalc(type)" :key="ind">{{ option.text }}</p>
			</template>
			<p v-else>-</p>
		</div>
	</section>
</template>

<script>
export default {
  props: ['data', 'title', 'headerIcon'],
  methods: {
    getRiskCalc: function (type) {
      return (this.data.allOptionsThatMakeRiskCalcHigher || [])
        .filter(f => f.types.indexOf(type) >= 0);
    },
    getSpecificTranslation: function (type) {
      var obj = {
        'H': this.getTranslation('I00.00050550', 'Specific health risk'),
        'S': this.getTranslation('I00.00050560', 'Specific safety risk'),
        'E': this.getTranslation('I00.00050570', 'Specific environment risk'),
      };
      return obj[type];
    }
  }
}
</script>