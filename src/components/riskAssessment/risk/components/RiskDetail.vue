<template>
	<div>
		<div class="row px-4 pt-4">
			<h6 class="col-3 mb-0">{{ getTranslation('I00.00025590', 'Activity') }}:</h6>
			<div class="col-9">{{ risk.activity.name }}</div>
		</div>
		<div class="row px-4 pt-3 align-items-center">
			<h6 class="col-3 mb-0">{{ getTranslation('I00.00002940', 'Department') }}:</h6>
			<div class="col-xl-4 col-md-7 col-9">
				<template v-if="propToBool(noEdit)">
					{{ risk.activity.department.name }}
				</template>
				<OrganisationPicker :data="sideTree.getAllData()" :value="risk.activity.department.orgID" @input="setOrganisation" v-else />
			</div>
		</div>
		<div class="row px-4 pt-3">
			<h6 class="col-3 mb-0">{{ getTranslation('I00.00013050', 'Products') }}:</h6>
			<div class="col-9">
				<div v-for="(item, ind) in risk.activity.activityItems" :key="ind">
					<template v-if="!propToBool(showProductLink)">{{ item.name }}</template>
					<router-link :to="`/product/${item.prodID.id}_${item.prodID.id_mdbID}`" v-else>{{ item.name }}</router-link>
					<A class="secondaryTxt" @click="getSds(item.prodID)" v-tooltip="getTranslation('I00.00040200', 'Current Sds')"><span class="icons icon-opentab small align-baseline ml-3"></span></A>
				</div>
			</div>
		</div>
		<div class="row px-4 pt-3">
			<h6 class="col-3 mb-0">{{ getTranslation('I00.00021780', 'Additional sources of risk') }}:</h6>
			<div class="col-9">
				<template v-if="risk.additionalRiskSource.length">
					<div v-for="(it, ind) in risk.additionalRiskSource" :key="ind">{{ it }}</div>
				</template>
				<div v-else>-</div>
			</div>
		</div>
	</div>
</template>

<script>
import OrganisationPicker from '../../../common/form/picker/OrganisationPicker';
import { propToBool } from '../../../../libraries/vue';
import { idsAreEqual } from '../../../../libraries/common';
import { getSds } from '../../../../libraries/reports';

export default {
  components: {
    OrganisationPicker,
  },
  props: ['risk', 'showProductLink', 'noEdit', 'showSds'],
  methods: {
    setOrganisation(event) {
      var org = this.sideTree.getAllData().find(f => idsAreEqual(f.item.orgID, event));
      this.risk.activity.department = org.item;
    },
    propToBool: propToBool,
    getSds: getSds,
  }
};
</script>