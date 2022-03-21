<template>
	<div>
		<input type="file" @change="onFileChange" ref="input" v-show="false" />
		<div class="imgUpload">
			<img v-show="!hide_preview" :src="defaultImage" :title="getTranslation('I00.00051650', 'No file chosen')" @click="$refs.input.click()" v-if="!value" />
			<template v-else>
				<img :src="value.data" :title="value.name" />
				<button class="removeImg btn" @click="removeImage"><span class="icons icon-delete plainIcn smallIcn notValid"></span></button>
			</template>
		</div>
		<p v-if="errorMessage" class="alert alert-danger w-100 mt-2">{{ errorMessage }}</p>
	</div>
</template>

<script>
import axios from '../../../../axiosOld-DONOTUSE';
import defaultImage from '../../../../assets/empty.png';
import { checkIsValid, validators } from '../../../../libraries/forms';
import { removeAllValidationParents, setAllValidationParents, propToBool } from '../../../../libraries/vue';
import { errorDebug } from '../../../../libraries/common';

export default {
  /**
   * upload_directory - sets the upload directory. If set image will not be saved into session but straight into directory.
   * to_default_document_vault - upload to default document vault (example: http://localhost/documentvault...)
   *                             if upload_directory is set, creates directory in the document vault.
   * hide_preview - hides preview image in html
   */
  props: ['value', 'title', 'validations', 'required', 'upload_directory', 'to_default_document_vault', 'hide_preview'],
  data() {
    return {
      isValid: true,
      errorMessage: null,
      defaultImage,
      pictureName: ''
    }
  },
  methods: {
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
  beforeDestroy() {
    removeAllValidationParents(this);
  },
}
</script>