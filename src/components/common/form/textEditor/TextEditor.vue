
<template>
	<textarea :id="id" class="form-control" :value="value"></textarea>
</template>

<script>
import { propToBool, setAllValidationParents, removeAllValidationParents } from '../../../../libraries/vue';
import { checkIsValid } from '../../../../libraries/forms';
import { errorDebug } from '../../../../libraries/common';
import axios from '../../../../axiosOld-DONOTUSE';

export default {
  props: ['value', 'height', 'required', 'validations'],
  data() {
    return {
      id: 'textEditor' + Math.floor(Math.random() * 100000),
      tinyObj: null,
      isValid: true,
    };
  },
  methods: {
    images_upload_handler(blobInfo, success) {
      if (blobInfo == undefined)
        return "";

      var formData = new FormData();
      formData.append('file', blobInfo.blob());
      formData.append('uploadDirectory', 'homepage');
      formData.append('saveToSession', false);
      formData.append('fileType', 'Image');
      formData.append('fileName', blobInfo.filename());
      formData.append('straightToDefaultDocumentUrl', true);
      formData.append('isTinyMCE', true);

      axios.post('/FileUpload/UploadChemsoft', formData)
        .then(response => {
          success(response.data.location);
        }).catch(errorDebug);
    },
    onInput() {
      this.$emit('input', this.tinyObj.getContent());
      this.$nextTick(() => this.checkIsValid());
    },
    onBlur(event) {
      this.$emit('blur', event.target.getContent());
      this.$nextTick(() => this.checkIsValid());
    },
    onKeyDown(e) {
      var selection = tinymce.activeEditor.selection; // eslint-disable-line
      if ((e.keyCode == 8 || e.keyCode == 46) && selection) { // eslint-disable-line
        var selectedNode = selection.getNode(); // get the selected node (element) in the editor

        if (selectedNode && selectedNode.nodeName == 'IMG') {
          var formData = new FormData();
          formData.append('fileUrl', selectedNode.src);
          formData.append('outerHtml', selectedNode.getAttribute('data-mce-html'));
          axios.post('/FileUpload/RemoveResource', formData)
            .catch(errorDebug);
        }
      }
    },
    propToBool: propToBool,
    checkIsValid: checkIsValid,
  },
  watch: {
    isValid() {
      this.tinyObj.contentAreaContainer.classList.toggle('notValid', !this.isValid);
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisEditor'] = this;
    tinymce.init({ // eslint-disable-line
      selector: '#' + this.id,
      height: this.height || 300,
      menubar: 'file edit view insert format tools table tc help',
      statusbar: false,
      resize: false,
      plugins: [
        'print preview paste importcss searchreplace autolink autosave save directionality code',
        'visualblocks visualchars fullscreen image link media template codesample table charmap',
        'hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools',
        'textpattern noneditable help charmap quickbars emoticons',
      ],
      toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | pagebreak | forecolor backcolor removeformat | charmap emoticons | link anchor image media | fullscreen preview print | ltr rtl ', //insertfile 
      toolbar_sticky: true,
      images_upload_handler: this.images_upload_handler,
      automatic_uploads: true,
      file_picker_types: 'media',
      file_picker_callback: function (callback) {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '*/*');

        input.onchange = function () {
          var file = this.files[0];
          var reader = new FileReader();

          var formData = new FormData();
          formData.append('file', file);
          formData.append('uploadDirectory', 'homepage');
          formData.append('saveToSession', false);
          formData.append('fileType', 'Media');
          formData.append('fileName', file.name);
          formData.append('straightToDefaultDocumentUrl', true);
          formData.append('isTinyMCE', true);

          var fileName = '';

          axios.post('/FileUpload/UploadChemsoft', formData)
            .then(response => {
              fileName = response.data.location;

              reader.onload = function () {
                /* call the callback and populate the Title field with the file name */
                callback(fileName);
              };

              reader.readAsDataURL(file);
            }).catch(errorDebug);
        };

        input.click();
      },
      target_list: [{ title: 'New page', value: '_blank', selected: true }],
      init_instance_callback: editor => {
        editor.on('blur', e => this.onBlur(e));
        editor.on('input', () => this.onInput());
        editor.on('Undo', () => this.onInput());
        editor.on('Redo', () => this.onInput());
        editor.on('Change', () => this.onInput());
        editor.on('keydown', e => this.onKeyDown(e));
      }
    }).then(response => {
      this.tinyObj = response[0];
    });

    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }
  },
  beforeDestroy() {
    this.tinyObj.destroy();
    removeAllValidationParents(this);
  },
}
</script>