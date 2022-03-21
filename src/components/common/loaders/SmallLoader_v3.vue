<template>
	<div id="animation" class="smallLoader loader">
		<div class="small activities" v-if="appSettings.ichemistryMode == 'ACCESS' || appSettings.ichemistryMode == 'GO' || appSettings.ichemistryMode == 'ENGAGE' || appSettings.ichemistryMode == 'COMPLIANCE'">
			<img :src="appSettings.imageFolder + 'iChemistry/loader.svg'" alt="" />
		</div>
		<div class="small activities" v-else-if="appSettings.distributorMode">
			<img :src="appSettings.imageFolder + 'iDistributor/iDLoad.gif'" alt="" />
		</div>
		<div class="small activities" v-else>
			<img :src="appSettings.imageFolder + 'main_blue_wait2.gif'" alt="" />
		</div>
	</div>
</template>

<script>
import SmallLoader from './SmallLoader';

export default {
  extends: SmallLoader,
  name: 'SmallLoader'
}
</script>