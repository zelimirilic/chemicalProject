<template>
	<div class="form-group mb-0">
		<label class="form-control-label" v-if="text != null">
			{{ text }}
			<sup class="astera" v-if="propToBool(required)">*</sup>
		</label>
		<input type="file" @change="onFileChange" ref="input" v-show="false" />
		<div class="specialType input-group" :class="{ notValid: !isValid }">
			<Input class="form-control cursor" :class="{ notValid: !isValid }" :value="value && value.shortFileName" readonly="readonly" @click="$refs.input.click()" withReadOnlyMode v-if="!value" />
			<Input class="form-control cursorGrab" :class="{ notValid: !isValid }" :value="value && value.shortFileName" :title="getTranslation('I00.00036820', 'Download')" readonly="readonly" @click="openInNewTab(value.url)" alwayson v-else />
			<div class="input-group-append" withReadOnlyMode>
				<span class="input-group-text icons icon-upload" v-tooltip="getTranslation('I00.00013410', 'Upload file')" @click="$refs.input.click()" v-if="!value" />
				<span class="input-group-text icons icon-delete" v-tooltip="getTranslation('I00.00047330', 'Delete')" @click.stop="resetFileField" v-else />
			</div>
		</div>
		<div v-if="loadingDocument">
			<SmallLoader />
		</div>
		<p v-if="errorMessage" class="alert alert-danger w-100 mt-2">{{ errorMessage }}</p>
	</div>
</template>

<script>
import axios from '../../../../axiosOld-DONOTUSE';
import { errorDebug, isNullOrEmpty } from '../../../../libraries/common';
import { checkIsValid, validators } from '../../../../libraries/forms';
import { removeAllValidationParents, setAllValidationParents, propToBool } from '../../../../libraries/vue';

export default {
  props: ['value', 'text', 'validations', 'required'],
  data() {
    return {
      isValid: true,
      isDocument: true,
      errorMessage: null,
      propToBool: propToBool,
      loadingDocument: false
    }
  },
  methods: {
    onFileChange(event) {
      var files = event.target.files || event.dataTransfer.files;
      if (!files.length) { this.resetFileField(); return; }

      var reader = new FileReader();
      var file = files[0];
      reader.readAsDataURL(file);

      var value = {
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        shortFileName: file.name,
        size: file.size,
        type: file.type,
        webkitRelativePath: file.webkitRelativePath,
      };
      var find = (this.validations || this.defaultValidations).find(f => !f.fnc(value));

      if (find) {
        this.errorMessage = find.message();
        this.$refs.input.value = '';
        if (propToBool(this.required))
          this.isValid = false;
      } else {
        var formData = new FormData();
        formData.append('file', files[0]);
        formData.append('uploadDirectory', '');
        formData.append('saveToSession', true);
        formData.append('isDocument', this.isDocument);
        formData.append('fileName', files[0].name);
        this.loadingDocument = true;
        return axios.post('/FileUpload/UploadChemsoft', formData)
          .then(response => {
            this.loadingDocument = false;
            if (isNullOrEmpty(response.data.errorMessage)) {
              this.isValid = true;
              this.errorMessage = null;
              this.$emit('input', { ...value, data: reader.result, shortFileName: response.data.fileName, url: `${this.settings.appUrl}Documents/GetFileFromSession?file_name=${response.data.fileName}` });
            } else {
              this.isValid = false;
              this.errorMessage = response.data.errorMessage;
            }
          })
          .catch(errorDebug);

      }
    },
    resetFileField() {
      this.$refs.input.value = '';
      this.$emit('input', null);
      this.$nextTick(() => this.checkIsValid());
    },
    openInNewTab(url) {
      window.open(url, '_blank');
    },
    checkIsValid,
  },
  computed: {
    defaultValidations() {
      return [validators.isDocument];
    }
  },
  mounted() {
    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  }
}
</script>