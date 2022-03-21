<template>
	<MainTitle class="card pageWrapper" :text="getTranslation('I00.00026730', 'Picture')">
		<template #linkSlot>
			<ButtonIconSave v-if="departmentInfo && departmentInfo.HasPermission" @click="saveChanges" :class="{ disabled: saveStatusValue }" @saveButtonStatus="saveStatus($event)" />
		</template>
		<SmallLoader v-if="!departmentInfo || isSavingShowLoader" />
		<div class="p-3" :class="{ readOnly: !departmentInfo.HasPermission }" v-else>
			<div :class="{ disabled: loadingImage }">
				<input class="mb-3" type="file" @change="onFileChange" ref="file" />
			</div>
			<div v-if="loadingImage">
				<SmallLoader />
			</div>
			<div v-else>
				<div v-if="!dataUrl || defaultImage">
					<img :src="placeholderImg" :title="labelPlaceholder" />
				</div>
				<div class="imgUpload" v-else>
					<img :src="dataUrl" :title="pictureName" />
					<button class="removeImg btn" :class="{ disabled: !departmentInfo.HasPermission }" @click="removeImage">
						<span class="icons icon-delete plainIcn notValid"></span>
					</button>
				</div>
				<p v-if="errorMessage" class="alert alert-danger w-100 mt-2">{{ errorMessage }}</p>
			</div>
		</div>
	</MainTitle>
</template>

 <script>
import axios from '../../../axiosOld-DONOTUSE';
import { hashCode, errorDebug, isNullOrEmpty, ticker } from '../../../libraries/common';
import MainTitle from '../../../components/common/cardBox/MainTitle';
import { validators } from '../../../libraries/forms';
import placeholderImg from '../../../assets/empty.png';
import { checkIsValid } from '../../../libraries/vue';

export default {
  name: 'Users',
  components: {
    MainTitle
  },
  props: ['departmentInfo', 'defaultImageContent', 'orgId'],
  data() {
    return {
      allowableTypes: ['jpg', 'jpeg', 'png', 'gif'],
      maximumSize: 8000000,
      errorMessage: null,
      selectedImage: null,
      isDocument: false,
      loadingImage: false,
      $modelValidators: [],
      placeholderImg: placeholderImg,
      pictureName: '',
      image: null,
      newOwnField: {},
      isSaving: false,
      originalHashCode: null,
      isSavingShowLoader: false
    };
  },
  watch: {
    saveStatusValue() {
      this.$emit('saveButtonStatus', !this.saveStatusValue);
    }
  },
  methods: {
    saveChanges() {
      if (!checkIsValid(this)) return;
      this.departmentInfo.OrgID = this.orgId.id;
      this.departmentInfo.OrgID_mdbID = this.orgId.id_mdbID;
      this.departmentInfo.PictureName = this.pictureName;
      if (this.selectedImage == null) this.departmentInfo.RemoveImage = true;

      this.isSaving = true;
      this.isSavingShowLoader = true;
      return axios
        .postWithCancelToken('/OrganisationInfo/SetDepartmentInfoImageChemsoft', { model: { ...this.departmentInfo } })
        .then(response => {
          if (response.data.saved) {
            ticker.addSuccessMessage(response.data.serverMessage);
            this.isSaving = false;
            this.isSavingShowLoader = false;
            this.originalHashCode = hashCode(this.departmentInfo);
          }
        }).catch(error => {
          this.isSaving = false;
          this.isSavingShowLoader = false;
          errorDebug(error);
        });
    },
    validateImage(image) {
      if (
        !this.allowableTypes.includes(
          image.name
            .split('.')
            .pop()
            .toLowerCase()
        )
      ) {
        this.errorMessage = this.getTranslation('I00.00051660', 'Sorry you can only upload following files:') + ` ${this.allowableTypes.join('|').toUpperCase()}`;
        return false;
      }
      if (image.size > this.maximumSize) {
        this.errorMessage = this.getTranslation('I00.00039670', 'You try to import too large file. Size restriction max 8mb.');
        return false;
      }
      return true;
    },
    maxLength: validators.maxLength,
    onFileChange(e) {
      this.errorMessage = null;
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      if (!this.validateImage(files[0])) {
        this.$refs.file.value = '';
        if (this.defaultImageContent !== null) this.departmentInfo.Picture = this.defaultImageContent;
        else this.departmentInfo.Picture.FileContents = [];
        return;
      }
      this.selectedImage = null;
      var formData = new FormData();
      formData.append('file', files[0]);
      formData.append('uploadDirectory', '');
      formData.append('saveToSession', true);
      formData.append('isDocument', this.isDocument);
      formData.append('fileName', files[0].name);
      this.loadingImage = true;
      axios
        .post('/FileUpload/UploadChemsoft', formData)
        .then(response => {
          this.loadingImage = false;
          if (isNullOrEmpty(response.data.errorMessage)) {
            this.departmentInfo.Picture = response.data.imageFile;
            this.pictureName = response.data.fileName;
          } else {
            this.errorMessage = response.data.errorMessage;
          }
        })
        .catch(errorDebug);
    },
    removeImage() {
      this.selectedImage = null;
      this.$refs.file.value = '';
      if (this.defaultImageContent !== null) this.departmentInfo.Picture = this.defaultImageContent;
      else this.departmentInfo.Picture.FileContents = [];
      this.pictureName = '';
      this.errorMessage = null;
    }

  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    saveStatusValue() {
      return !this.isModelValid || !this.inputFieldsIsChanged || this.isSaving;
    },
    inputFieldsIsChanged() {
      return this.originalHashCode != hashCode(this.departmentInfo);
    },
    dataUrl() {
      var checkFileContent = hashCode(this.departmentInfo.Picture.FileContents) !== hashCode(this.defaultImageContent.FileContents);
      if (this.departmentInfo.Picture.FileContents.length > 0 && checkFileContent) return 'data:image/jpeg;base64,' + btoa(new Uint8Array(this.departmentInfo.Picture.FileContents).reduce((data, byte) => data + String.fromCharCode(byte), ''));

      return this.selectedImage;
    },
    defaultImage() {
      return hashCode(this.departmentInfo.Picture.FileContents) == hashCode(this.defaultImageContent.FileContents);
    },
    labelPlaceholder() {
      return this.getTranslation('I00.00051650', 'No file chosen');
    },
  },
  mounted() {
    this.originalHashCode = hashCode(this.departmentInfo);
  },
  beforeDestroy() {
    axios.cancelAll();
  },
};
</script> 