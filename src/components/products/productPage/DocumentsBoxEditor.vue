<template>
	<div>
		<DocumentsBox :documentCategories="documentCategories" :product="product" :orgId="orgId" :risks="risks" :risksCount="risksCount" :docTypes="docTypes()" :fileLinksOwn="fileLinksOwn" :departmentDocuments="departmentDocumentsData" @edit="edit" @getRisksEvent="$emit('get-risks')" @exposure-scenario-deleted="$emit('exposure-scenario-changed')" @get-department-documents="getDepartmentDocuments" v-show="!isEditing" />
		<DocumentsBoxEdit :documentCategories="documentCategories" :product="product" :risks="risks" :risksCount="risksCount" :dataDoc="documentObjectForSave" :loader="isSaving" @cancel="cancel" @save="save" v-if="isEditing" />
	</div>
</template>

<script>
import axios from '../../../axios';
import { errorDebug } from '../../../libraries/common';
import DocumentsBox from './DocumentsBox';
import DocumentsBoxEdit from './DocumentsBoxEdit';


export default {
  components: {
    DocumentsBox,
    DocumentsBoxEdit
  },
  props: ['product', 'risksCount', 'risks', 'documentCategories', 'orgId'],
  data() {
    return {
      fileLinksOwn: null,
      departmentDocuments: null,
      documentObject: null,
      documentObjectForSave: null,
      isSaving: false,
      isEditing: false,
      appLanguageCode: this.$store.getters.state.appSettings.applicationLanguage
    };
  },
  methods: {
    nodeSelected() {
      this.departmentDocuments = null;
      this.fileLinksOwn = null;
      this.getDocumentsData()
        .then(() => this.getFileLinksOwn())
        .then(() => this.getDepartmentDocuments())
    },
    getDocumentsData() {
      return axios.post('/Documents/GetLanguagesAndDocumentsType')
        .then(response => {
          var data = response.data;
          this.documentObject = {
            ...data,
            uploadedFile: null,
            department: null,
            defaultLanguage: { docLanguageCode: this.appLanguageCode },
            defaultDocumentType: data.documentTypes.find(f => f.id == 173 && f.id_mdbID == 10) || data.documentTypes.first()
          };
        })
        .catch(errorDebug);
    },
    docTypes() {
      return this.documentObject != null ? this.documentObject.documentTypes : null;
    },
    getFileLinksOwn() {
      return axios.postWithCancelToken('/Documents/GetOwnDocumentsList', { prodId: this.product.id, orgId: this.orgId })
        .then(response => {
          this.fileLinksOwn = response.data.map((x) => { x.fromProduct = true; return x });
        })
        .catch(errorDebug);
    },
    getDepartmentDocuments() {
      var nodeSelected = this.orgId;
      var root = this.sideTree.getAllData().getTopParent().item.orgID;
      var departmentDocuments = [];
      if (!this.departmentDocuments) {
        return axios.postWithCancelToken('/Documents/GetDepartmentDocumentsList', { orgId: this.orgId })
          .then(response => {
            if (!(nodeSelected.id == root.id && nodeSelected.id_mdbID == root.id_mdbID)) {
              departmentDocuments = (this.fileLinksOwn || []).map(f => ({
                ...f,
                docTypeObj: (this.docTypes() || []).find(g => g.id === f.typeOfDocID && g.id_mdbID === f.typeOfDocID_mdbID) || { name: this.getTranslation('I00.00044430', 'Other') }
              })).filter(f => f.orgID == nodeSelected.id && f.orgID_mdbID == nodeSelected.id_mdbID);
              departmentDocuments = [...new Set([...(departmentDocuments || []), ...(response.data.map((x) => { x.fromProduct = false; return x }))])];
            } else {
              departmentDocuments = (this.fileLinksOwn || []).map(f => ({
                ...f,
                docTypeObj: (this.docTypes() || []).find(g => g.id === f.typeOfDocID && g.id_mdbID === f.typeOfDocID_mdbID) || { name: this.getTranslation('I00.00044430', 'Other') }
              })).filter(f => f.orgID == root.id && f.orgID_mdbID == root.id_mdbID && f.fromApplication);
              departmentDocuments = [...new Set([...(departmentDocuments || []), ...(response.data)])];
            }
            this.departmentDocuments = departmentDocuments;
          })
          .catch(errorDebug);
      } else
        this.departmentDocuments = departmentDocuments;
    },
    edit() {
      var docObjForSave = { ...this.documentObject };

      if (this.documentCategories == 'departmentDocumentsOnly')
        docObjForSave.department = this.orgId;

      this.documentObjectForSave = docObjForSave;
      this.isEditing = true;
    },
    cancel() {
      this.isEditing = false;
      this.documentObjectForSave = null;
    },
    save() {
      this.isSaving = true;
      var departmentObj = this.documentObjectForSave.department || {};
      var formData = new FormData();
      formData.append('prod_id', this.product != undefined ? this.product.id.id : 0);
      formData.append('prod_mdbid', this.product != undefined ? this.product.id.id_mdbID : 0);
      formData.append('document_name', this.documentObjectForSave.name);
      formData.append('org_id', departmentObj.id);
      formData.append('org_mdbid', departmentObj.id_mdbID);
      formData.append('document_language', this.documentObjectForSave.defaultLanguage.docLanguageCode);
      formData.append('urlValue', '');
      formData.append('document_type', this.documentObjectForSave.defaultDocumentType.id);
      formData.append('filename', this.documentObjectForSave.uploadedFile.shortFileName);

      var chosenDefaultDocumentType = this.documentObjectForSave.defaultDocumentType;
      return axios.post('/Documents/SaveFile', formData)
        .then(response => {
          var links = response.data;
          var nodeSelected = this.orgId;
          if (this.product) {
            if (links.typeOfDocID === 100) {
              this.product.fileLinks.forEach(element => {
                element.activeSDS = false;
                element.typeOfDocID = null;
              });
            }

            this.product.fileLinks.push({ ...links, fromProduct: true });

            if (this.fileLinksOwn) {
              this.fileLinksOwn.push({ ...links, fromProduct: true });
            }
          }
          var root = this.sideTree.getAllData().getTopParent().item.orgID;

          if (links.orgID == nodeSelected.id && links.orgID_mdbID == nodeSelected.id_mdbID) {
            if (this.departmentDocuments) {
              if (links.orgID != root.id || links.orgID_mdbID != root.id_mdbID || this.documentCategories == 'departmentDocumentsOnly') {
                var isFromProduct = this.product ? true : false
                this.departmentDocuments.push({ ...links, fromProduct: isFromProduct });
              }
            }
            else
              this.getDepartmentDocuments();
          }

          this.isSaving = false;
          this.isEditing = false;
          this.documentObjectForSave = null;

          if (chosenDefaultDocumentType && chosenDefaultDocumentType.id == 157)
            this.$emit('exposure-scenario-changed');
        }).catch(error => {
          this.isSaving = false;
          errorDebug(error);
        });
    },
  },
  computed: {
    departmentDocumentsData() {
      return this.departmentDocuments;
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisDocumentBoxEditor'] = this;
    if (this.sideTree.getSelectedDepartment()) {
      this.getDocumentsData()
        .then(() => {
          if (this.documentCategories != 'departmentDocumentsOnly')
            this.getFileLinksOwn()
        });
    }
  },
  beforeDestroy() {
    axios.cancelAll();
  }
};
</script>