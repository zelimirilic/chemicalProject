<template>
	<SmallLoader v-if="isSaving" />
	<div v-else class="ichemistry-department">
		<div class="row px-2 py-3">
			<div class="col-xl-3 col-12">
				<SelectGroup class="mb-0" :text="getTranslation('I00.00027860', 'Ventilation label')" :items="operationEnvironmentTypeList" :prop="getTranslation" v-model="selectedPhraseId" @input="$emit('changed', getValues())" />
			</div>
			<div class="col-xl-3 col-12">
				<InputGroup :text="getTranslation('I00.00057340', 'Floor type')" :validations="[maxLength(300)]" :placeholder="getTranslation('I00.00057340', 'Floor type')" :value="floorText" v-model="floorText" @input="$emit('changed', getValues())" />
			</div>
		</div>
		<div class="row px-2 py-3">
			<div class="col-xl-3 col-12">
				<DateGroup :text="getTranslation('I00.00057330', 'Inventory date')" :value="invDate" v-model="invDate" @input="$emit('changed', getValues($event))" />
			</div>
		</div>
		<div class="row px-2 py-3">
			<div class="col-xl-3 col-12 ichemistry-department__checkbox">
				<CheckBoxGroup :text="getTranslation('I00.00057360', 'Exposed persons')" v-model="isChecked" />
			</div>
			<div class="col-xl-3 col-12" v-if="isChecked">
				<Number v-model="expPerson" :text="getTranslation('I00.00057370', 'Number of exposed persons')" :placeholder="getTranslation('I00.00057370', 'Number of exposed persons')" @input="$emit('changed', getValues())" />
			</div>
		</div>
		<div class="row px-2">
			<span class="col-xl-2 col-12">{{ getTranslation('I00.00057380', 'Geographic location') }}</span>
		</div>
		<div class="row px-2 py-3">
			<div class="col-xl-3 col-12">
				<InputGroup :text="getTranslation('I00.00057390', 'Latitude')" :placeholder="getTranslation('I00.00057390', 'Latitude')" :value="lat" v-model="lat" @input="$emit('changed', getValues())" />
			</div>
			<div class="col-xl-3 col-12">
				<InputGroup :text="getTranslation('I00.00057400', 'Longitude')" :placeholder="getTranslation('I00.00057400', 'Longitude')" :value="long" v-model="long" @input="$emit('changed', getValues())" />
			</div>
		</div>
		<div class="row p-2 py-3">
			<div class="col-xl-3 col-12">
				<InputGroup :text="getTranslation('I00.00057480', 'Storage Type')" :validations="[maxLength(300)]" :placeholder="getTranslation('I00.00057480', 'Storage Type')" :value="storType" v-model="storType" @input="$emit('changed', getValues())" />
			</div>
			<div class="col-xl-3 col-12">
				<InputGroup :text="getTranslation('I00.00057490', 'Storage class')" :validations="[maxLength(300)]" :placeholder="getTranslation('I00.00057490', 'Storage class')" :value="storClass" v-model="storClass" @input="$emit('changed', getValues())" />
			</div>
		</div>
	</div>
</template>
<script>
import SmallLoader from '../../../components/common/loaders/SmallLoader_v3';
import SelectGroup from '../../../components/common/form/select/SelectGroup_v3'
import InputGroup from '../../../components/common/form/input/InputGroup_v3';
import DateGroup from '../../../components/common/form/date/DateGroup_v3';
import CheckBoxGroup from '../../../components/common/form/checkBox/CheckBoxGroup_v3';
import Number from '../../../components/common/form/input/Number_v3';
import { validators } from '../../../libraries/forms_v3';
import { parseDate } from '../../../libraries/date_v3';
import axios from '../../../axios';
export default {
  components: {
    SmallLoader,
    SelectGroup,
    InputGroup,
    DateGroup,
    CheckBoxGroup,
    Number
  },
  name: 'DepartmentProductType',
  props: ['orgId', 'orgIdMdbId', 'ventilationType', 'ventilationTypeList', "floorTxt", "inventoryDate", "exposedPerson", "latitude", "longitude", "storageType", "storageClass"],
  data() {
    return {
      isSaving: false,
      axios,
      originalHashCode: null,
      operationEnvironmentTypeList: [],
      selectedPhraseId: null,
      floorText: this.floorTxt,
      expPerson: this.exposedPerson,
      invDate: parseDate(this.inventoryDate),
      departmentInfo: null,
      isChecked: false,
      lat: this.latitude,
      long: this.longitude,
      storType: this.storageType,
      storClass: this.storageClass
    }
  },
  methods: {
    maxLength: validators.maxLength,
    getValues() {
      var ventilationType = this.ventilationTypeList.find(f => f.PhraseId == this.selectedPhraseId).Value;
      var date = this.invDate;
      return {
        ventilationType: ventilationType,
        floorText: this.floorText,
        inventoryDate: date,
        exposedPerson: this.expPerson,
        latitude: this.lat,
        longitude: this.long,
        storageType: this.storType,
        storageClass: this.storClass
      };
    }
  },
  mounted() {
    var self = this;
    if (self.expPerson != "")
      this.isChecked = true;
    else
      this.isChecked = false;
    this.ventilationTypeList.forEach(x => {
      self.operationEnvironmentTypeList.push(x.PhraseId);
    });
    if (this.ventilationType == null || this.ventilationType == "0")
      this.selectedPhraseId = this.operationEnvironmentTypeList[0];
    else
      this.selectedPhraseId = this.ventilationTypeList.find(f => f.Value == this.ventilationType).PhraseId;
  }
}
</script>