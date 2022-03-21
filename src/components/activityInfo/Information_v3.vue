<template>
	<Accordion :text="getTranslation('I00.00006660', 'Information')" v-model="informationOpened" @input="saveToStorage($event)">
		<SmallLoader @mounted="getInformation" v-if="!informationData" />
		<div class="row" v-else>
			<div class="col-9">
				<div class="d-flex">
					<p class="widthPx150">
						<b>{{ getTranslation('I00.00020000', 'Name') }}</b>
					</p>
					<p>{{ currentOrganisationPath }}</p>
				</div>
				<div class="d-flex mt-2" v-if="getValue(informationData.departmentID)">
					<p class="widthPx150">
						<b>{{ getTranslation('I00.00025270', 'DepartmentID') }}</b>
					</p>
					<p>{{ informationData.departmentID }}</p>
				</div>
				<div class="d-flex mt-2" v-if="getValue(informationData.address)">
					<p class="widthPx150">
						<b>{{ getTranslation('I00.00007880', 'Address') }}</b>
					</p>
					<p>{{ informationData.address }}</p>
				</div>
				<div class="d-flex mt-2" v-if="getValue(informationData.postalNumber)">
					<p class="widthPx150">
						<b>{{ getTranslation('I00.00025240', 'Postal No.') }}</b>
					</p>
					<p>{{ informationData.postalNumber }}</p>
				</div>
				<div class="d-flex mt-2" v-if="getValue(informationData.city)">
					<p class="widthPx150">
						<b>{{ getTranslation('I00.00025250', 'City') }}</b>
					</p>
					<p>{{ informationData.city }}</p>
				</div>
				<div class="d-flex mt-2" v-if="getValue(informationData.country)">
					<p class="widthPx150">
						<b>{{ getTranslation('I00.00016760', 'Country') }}</b>
					</p>
					<p>{{ informationData.country }}</p>
				</div>
			</div>
			<div class="col-3">
				<img class="d-flex depImg ml-auto" v-if="!hasPicture" :src="placeholderImg" :title="labelPlaceholder()" />
				<img class="d-flex depImg ml-auto" v-else :src="dataUrl" :title="pictureName" />
			</div>
		</div>
	</Accordion>
</template>

<script>
import Accordion from '../../components/common/accordion/Accordion_v3';
import SmallLoader from '../../components/common/loaders/SmallLoader_v3';
import axios from '../../axios';
import { camelCaseObj, errorDebug, isNullOrEmpty, tryParse } from '../../libraries/common';
import placeholderImg from '../../assets/empty.png';


export default {
  components: {
    Accordion,
    SmallLoader
  },
  data() {
    return {
      informationOpened: false,
      informationData: null,
      currentOrganisationPath: null,
      hasPicture: false,
      placeholderImg: placeholderImg,
      dataUrl: null
    }
  },
  props: ['excelTitle', 'perPage'],
  methods: {
    getInformation() {
      var node = window.SideTree.GetSelectedNode();
      return axios.postWithCancelToken('/Departments/GetInformation', { org_id: node.KeyID, org_mdbid: node.KeyID_mdbID })
        .then(response => {
          var data = camelCaseObj(response.data);
          this.informationData = data.organisationInfo;
          this.currentOrganisationPath = data.currentOrganisationPath;
          this.hasPicture = this.informationData.hasPicture;
          this.dataUrl = 'data:image/png;base64,' + btoa(new Uint8Array(data.departmentImage.fileContents).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        })
        .catch(errorDebug);
    },
    saveToStorage(event) {
      var sectionsLocalStorage = tryParse(localStorage.getItem('DepartmentHiddenBoxes')) || {};
      sectionsLocalStorage['informationsBox'] = !event;
      localStorage.setItem('DepartmentHiddenBoxes', JSON.stringify(sectionsLocalStorage));
    },
    getValue(value) {
      return !isNullOrEmpty(value) ? value : null;
    },
    labelPlaceholder() {
      return this.getTranslation('I00.00051650', 'No file chosen');
    },
  },
  mounted() {
    var sectionsLocalStorage = tryParse(localStorage.getItem('DepartmentHiddenBoxes')) || {};
    this.informationOpened = !sectionsLocalStorage['informationsBox'];
  },
};
</script>