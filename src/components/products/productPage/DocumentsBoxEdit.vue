<template>
	<InformationBoxEdit additionalClass="p-4" :title="getTranslation('I00.00013090', 'Documents')" @cancel="$emit('cancel')" @save="checkRequirements()" :isChanged="isChanged" :isModelValid="isModelValid" :loader="loader">
		<UploadFileGroup class="col-xl-6 col-12 primaryTxt" :text="getTranslation('I00.00013360', 'Document')" v-model="dataDoc.uploadedFile" @input="setDataDocName" required />
		<InputGroup class="col-xl-6 col-12 primaryTxt" :text="getTranslation('I00.00013390', 'Displayed name')" :validations="[maxLength(255)]" v-model="dataDoc.name" required ref="inp" />
		<SelectGroup class="col-xl-6 col-12 mt-3 mb-0 primaryTxt" :items="dataDoc.documentTypes" prop="name" v-model="dataDoc.defaultDocumentType" :text="getTranslation('I00.00013430', 'Document Type')" />
		<SelectGroup class="col-xl-6 col-12 mt-3 mb-0 primaryTxt" :items="dataDoc.languages" prop="nameInEnglish" :value="getLanguageValue()" @input="dataDoc.defaultLanguage = $event" :text="getTranslation('I00.00007040', 'Language')" />
		<OrganisationPicker class="col-12 mt-3 primaryTxt" :class="{ 'd-none': documentCategories == 'departmentDocumentsOnly' }" :text="getTranslation('I00.00002940', 'Department')" v-model="dataDoc.department" :data="sideTree.getAllData()" />
	</InformationBoxEdit>
</template>

<script>
import { validators } from '../../../libraries/forms';
import { checkIsValid } from '../../../libraries/vue';
import { hashCode } from '../../../libraries/common';
import InformationBoxEdit from './InformationBoxEdit';
import OrganisationPicker from '../../../components/common/form/picker/OrganisationPicker';
import UploadFileGroup from '../../../components/common/form/upload/UploadFileGroup';

export default {
  components: {
    InformationBoxEdit,
    OrganisationPicker,
    UploadFileGroup
  },
  props: ['dataDoc', 'loader', 'documentCategories'],
  data() {
    return {
      $modelValidators: [],
      startHash: hashCode(this.dataDoc)
    };
  },
  methods: {
    maxLength: validators.maxLength,
    getLanguageValue() {
      return this.dataDoc.languages.find(f => f.docLanguageCode == this.dataDoc.defaultLanguage.docLanguageCode);
    },
    setDataDocName() {
      this.dataDoc.name = ((this.dataDoc.uploadedFile || {}).shortFileName || '').split('.').head().join('.');
      this.$nextTick(() => this.$refs.inp.checkIsValid());
    },
    checkRequirements() {
      if (!checkIsValid(this)) return;
      this.$emit('save');
    }
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    isChanged() {
      return this.startHash !== hashCode(this.dataDoc);
    }
  },
};
</script>
