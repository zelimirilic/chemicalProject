<template>
	<div class="row" :class="{ readOnly: propToBool(readOnly) }">
		<div class="col-xl col-12">
			<OrganisationPickerMultiple :text="department.text" :department="department" :data="sideTree.getAllData()" :dat="dat" :value="organisation" @listOfSelectedItems="fillUsageStorageDepartments" :required="department.required" />
		</div>
		<div class="col-xl-auto col-12">
			<ConsumptionGroup :text="consumption.text" :value="consumptionValue" @input="setConsumption" :usingDash="usingDash" :required="consumption.required" />
		</div>
	</div>
</template>

<script>
import { getFnc, idsAreEqual, setFnc } from '../../../libraries/common_v3';
import { propToBool } from '../../../libraries/vue_v3';
import OrganisationPickerMultiple from '../../common/form/picker/OrganisationPickerMultiple_v3';
import ConsumptionGroup from '../../common/form/consumption/ConsumptionGroup_v3';
export default {
  components: {
    OrganisationPickerMultiple,
    ConsumptionGroup,
  },
  props: ['department', 'consumption', 'editProps', 'readOnly', 'setSelected', 'dat', 'units', 'usingDash'],
  methods: {
    setOrganisation(event) {
      var org = this.sideTree.getAllData().find(f => idsAreEqual(f.item.orgID, event));
      this.setFnc(this.department.dataProp)(this.dat, org.item);

    },
    setConsumption(event) {
      this.setFnc(this.consumption.propValue)(this.dat, event.value);
      this.setFnc(this.consumption.propUnit)(this.dat, event.unit);
    },
    fillUsageStorageDepartments(listOfSelectedItems) {
      var list = [];
      if (listOfSelectedItems.length > 0) {
        this.setOrganisation(listOfSelectedItems[0].item.orgID);
        listOfSelectedItems.forEach(x => list.push(x.item));
        this.department.dataProp === 'usagePlace' ? this.dat.usagePlaces = list : this.dat.storagePlaces = list;
      } else {
        this.department.dataProp === 'usagePlace' ? (this.dat.usagePlaces = null, this.dat.usagePlace = null) : (this.dat.storagePlaces = null, this.dat.storagePlace = null);
      }
    },
    propToBool,
    getFnc,
    setFnc,
  },
  computed: {
    organisation() {
      return (this.getFnc(this.department.dataProp)(this.dat) || {}).orgID;
    },
    consumptionValue() {
      return {
        value: this.getFnc(this.consumption.propValue)(this.dat),
        unit: this.getFnc(this.consumption.propUnit)(this.dat),
      };
    }
  }
}
</script>