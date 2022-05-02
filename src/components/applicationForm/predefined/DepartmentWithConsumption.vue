<template>
	<div class="row" :class="{ readOnly: propToBool(readOnly) }">
		<div class="col-xl col-12">
			<OrganisationPickerMultiple :text="department.text" :department="department" :consumption="consumption" :data="sideTree.getAllData()" @addItem="addItem" @removeItem="removeItem" @modalOpened="modalOpened()" @cancelModal="cancelModal()" @setMultipleConsumption="setMultipleConsumption()" @onItemSelected="onItemSelected()" :dat="dat" :value="organisation" :listOfSelectedItems="listOfSelectedItems" :required="department.required" />
		</div>
		<div class="col-xl-auto col-12">
			<ConsumptionGroup :text="consumption.text" :value="consumptionValue" @input="setConsumption" :usingDash="usingDash" :required="consumption.required" />
		</div>
		<div class="col-12">
			<div class="multiSelTree hideElm mxhp-225 mt-3 scrollBar" :class="{ oneElm: listOfSelectedItems.length <= 1 }">
				<div class="statements d-flex align-items-center" v-for="(item, index) in listOfSelectedItems" :key="index">
					<div class="col">
						<span v-tooltip.left="nodeNamePath(sideTree.getAllData().find((y) => y.item.orgID.id === item.orgID.id))">{{ item.name }}</span>
					</div>
					<div class="col-auto ml-auto">
						<ConsumptionMultiple :required="consumption.required" :value="listOfSelectedItems.find((x) => x.orgID.id === item.orgID.id)" :orgId="item.orgID" @input="setMultipleConsumption($event)" :forceRerender="!forceRerender" v-if="index !== 0" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getFnc, idsAreEqual, setFnc } from '../../../libraries/common';
import { propToBool, setAllValidationParents, removeAllValidationParents } from '../../../libraries/vue';
import OrganisationPickerMultiple from '../../common/form/picker/OrganisationPickerMultiple';
import ConsumptionGroup from '../../common/form/consumption/ConsumptionGroup';
import ConsumptionMultiple from '../../common/form/consumption/ConsumptionMultiple';
import { nodeNamePath } from '../../../libraries/tree';
export default {
  components: {
    OrganisationPickerMultiple,
    ConsumptionGroup,
    ConsumptionMultiple
  },
  props: ['department', 'consumption', 'editProps', 'readOnly', 'setSelected', 'dat', 'units', 'usingDash'],
  data() {
    return {
      forceRerender: false,
      listOfSelectedItems: [],
      listOfSelectedItemsCopy: []
    }
  },
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
      if (listOfSelectedItems.length > 0) {
        this.setOrganisation(listOfSelectedItems[0].orgID);
        this.department.dataProp === 'usagePlace' ? this.dat.usagePlaces = listOfSelectedItems.filter(x => x.orgID.id !== this.dat.usagePlace.orgID.id) : this.dat.storagePlaces = listOfSelectedItems.filter(x => x.orgID.id !== this.dat.storagePlace.orgID.id);
      } else {
        this.department.dataProp === 'usagePlace' ? (this.dat.usagePlaces = null, this.dat.usagePlace = null) : (this.dat.storagePlaces = null, this.dat.storagePlace = null);
      }
    },
    addItem(item) {
      if (this.listOfSelectedItems.length > 0 && this.listOfSelectedItems.filter(x => x.orgID.id === item.item.orgID.id).length > 0)
        this.listOfSelectedItems = this.listOfSelectedItems.filter(x => x.orgID.id !== item.item.orgID.id);
      else
        this.listOfSelectedItems.push({ ID: 0, name: item.item.name, orgID: item.item.orgID, value: null, unit: null });
    },
    removeItem(item) {
      if (this.listOfSelectedItems.length > 0)
        this.listOfSelectedItems = this.listOfSelectedItems.filter(x => x.orgID.id !== item.orgID.id);
    },
    setMultipleConsumption(event) {
      this.listOfSelectedItems.find(x => x.orgID.id == event.orgID.id).value = event.value;
      this.listOfSelectedItems.find(x => x.orgID.id == event.orgID.id).unit = event.unit;
      this.fillUsageStorageDepartments(this.listOfSelectedItems);
    },
    onItemSelected() {
      this.forceRerender = false;
      this.fillUsageStorageDepartments(this.listOfSelectedItems);
      this.listOfSelectedItemsCopy = [];
    },
    modalOpened() {
      this.listOfSelectedItemsCopy = [...this.listOfSelectedItems];
      this.forceRerender = true;
    },
    cancelModal() {
      this.forceRerender = false;
      this.listOfSelectedItems = [...this.listOfSelectedItemsCopy];
    },
    propToBool,
    getFnc,
    setFnc,
    nodeNamePath: nodeNamePath
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
  },
  mounted() {

    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }

    if (this.department.dataProp === 'usagePlace' && this.dat.usagePlace !== null) {
      this.listOfSelectedItems.push({ ID: 0, unit: null, value: null, name: this.dat.usagePlace.name, orgID: this.dat.usagePlace.orgID });

      if (this.dat.usagePlaces !== null && this.dat.usagePlaces !== undefined)
        this.dat.usagePlaces.forEach(x => this.listOfSelectedItems.push({ ID: x.id, unit: x.unit, value: x.value, name: this.sideTree.getAllData().find(y => y.item.orgID.id === x.orgID.id).item.name, orgID: x.orgID }));
    }

    if (this.department.dataProp === 'storagePlace' && this.dat.storagePlace !== null) {
      this.listOfSelectedItems.push({ ID: 0, value: null, unit: null, name: this.dat.storagePlace.name, orgID: this.dat.storagePlace.orgID });

      if (this.dat.storagePlaces !== null && this.dat.storagePlaces !== undefined)
        this.dat.storagePlaces.forEach(x => this.listOfSelectedItems.push({ ID: x.id, unit: x.unit, value: x.value, name: this.sideTree.getAllData().find(y => y.item.orgID.id === x.orgID.id).item.name, orgID: x.orgID }));
    }

  },
  beforeDestroy() {
    removeAllValidationParents(this);
  },
}
</script>