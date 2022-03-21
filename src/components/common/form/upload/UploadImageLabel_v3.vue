<template>
	<div class="imgUploadWrap" :class="{ 'justify-content-center align-items-center dashed': !value }">
		<input type="file" @change="onFileChange" ref="input" v-show="false" />
		<div class="imgUpload row no-gutters w-100">
			<div class="col-12 px-20 text-center" v-if="!value" v-show="!hide_preview">
				<p class="icons icon-browse"></p>
				<p>{{ getTranslation('I00.00056700', 'Browse image to upload') }}</p>
				<p class="btn" @click="$refs.input.click()">{{ getTranslation('I00.00056690', 'Browse') }}</p>
			</div>
			<template v-else>
				<div class="col-auto px-20 borderR">
					<div class="position-relative">
						<img class="wp-120" :src="value.data" :title="value.name" />
						<span class="icons icon-delete" @click="removeImage"></span>
					</div>
				</div>
				<div class="col px-20">
					<h4 class="mb-12">{{ getTranslation('I00.00055090', 'Image position') }}</h4>
					<div class="custom-check radio mt-1" v-for="(position, index) in imagePositions" :key="index">
						<input type="radio" class="custom-input" v-model="customImagePositionLocal" name="image_position_radio" :id="'radio' + position.name" :value="position.value" ref="imagePositionRef" @change="onImagePositionChange" />
						<label class="custom-label" :for="'radio' + position.name">{{ position.name }}</label>
					</div>
				</div>
			</template>
		</div>
		<p v-if="errorMessage" class="alert alert-danger w-100 mt-2">{{ errorMessage }}</p>
	</div>
</template>

<script>
import axios from '../../../../axiosOld-DONOTUSE';
import { checkIsValid, validators } from '../../../../libraries/forms';
import { removeAllValidationParents, setAllValidationParents, propToBool } from '../../../../libraries/vue';
import { errorDebug } from '../../../../libraries/common';
import defaultImage from '../../../../assets/empty.png';
export default {
  /**
   * upload_directory - sets the upload directory. If set image will not be saved into session but straight into directory.
   * to_default_document_vault - upload to default document vault (example: http://localhost/documentvault...)
   *                             if upload_directory is set, creates directory in the document vault.
   * hide_preview - hides preview image in html
   */
  props: ['value', 'title', 'validations', 'required', 'upload_directory', 'to_default_document_vault', 'hide_preview', 'imagePositions', 'customImagePosition'],
  data() {
    return {
      customImagePositionLocal: null,
      isValid: true,
      errorMessage: null,
      defaultImage,
      pictureName: ''
    }
  },
  methods: {
    onImagePositionChange() {
      this.$emit('on-image-position-changed', { selectedImagePosition: this.customImagePositionLocal });
    },

    onFileChange(event) {
      var files = event.target.files || event.dataTransfer.files;
      if (!files.length) return;

      var reader = new FileReader();
      var file = files[0];
      reader.readAsDataURL(file);

      var formData = new FormData();
      formData.append('file', file);
      formData.append('uploadDirectory', this.upload_directory);
      formData.append('saveToSession', this.upload_directory ? false : true);
      formData.append('isDocument', "Image");
      formData.append('fileName', file.name);
      formData.append('straightToDefaultDocumentUrl', this.to_default_document_vault);

      axios.post('/FileUpload/UploadChemsoft', formData)
        .then(response => {
          this.pictureName = response.data.fileName;
          this.$emit('file-uploaded', response.data);
        }).catch(errorDebug);

      var value = {
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
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
        reader.onload = f => {
          this.isValid = true;
          this.errorMessage = null;
          this.$emit('input', { ...value, data: f.target.result });
        }
      }
    },
    removeImage() {
      this.$refs.input.value = '';
      this.$emit('input', null);
    },
    checkIsValid: checkIsValid,
  },
  computed: {
    defaultValidations() {
      return [validators.isImage];
    }
  },
  mounted() {
    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }
  },
  beforeMount() {
    this.customImagePositionLocal = this.customImagePosition;
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  },
}
</script>