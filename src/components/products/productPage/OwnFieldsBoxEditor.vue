<template>
	<div>
		<OwnFieldsBox :departmentOwnFields="departmentOwnFields" @edit="isEditing = true" v-show="!isEditing" :canEdit="canEdit" />
		<OwnFieldsBoxEdit :value="departmentOwnFields" :loader="isSaving" @save="save($event)" @cancel="isEditing = false" v-if="isEditing" />
	</div>
</template>

<script>
import OwnFieldsBox from './OwnFieldsBox';
import OwnFieldsBoxEdit from './OwnFieldsBoxEdit';

import { errorDebug, hashCode, camelCaseObj } from '../../../libraries/common';

import axios from '../../../axios';

export default {
  components: {
    OwnFieldsBox,
    OwnFieldsBoxEdit,
  },
  props: ['product'],
  data() {
    return {
      departmentOwnFields: null,
      isSaving: false,
      isEditing: false,
    };
  },
  methods: {
    nodeSelected() {
      this.getOwnFieldsLists();
    },
    getOwnFieldsLists() {
      return axios.postWithCancelToken('/ProductPage/GetOwnFieldsLists', { productId: this.product.id, orgID: this.sideTree.getSelectedDepartment().orgID })
        .then(response => {
          var data = camelCaseObj(response.data);
          this.departmentOwnFields = data;
        })
        .catch(errorDebug);
    },
    save(event) {
      var ownFieldsForSave = event.filter(f => f.hashCode() !== hashCode(f));
      var selectedNode = this.sideTree.getSelectedDepartment();
      if (ownFieldsForSave.any()) {
        var productsDepartmentFields = [{
          id: { id: this.product.id.id, id_mdbID: this.product.id.id_mdbID },
          orgId: { id: selectedNode.orgID.id, id_mdbID: selectedNode.orgID.id_mdbID },
          fields: ownFieldsForSave.map(prop => ({ id: prop.id, fieldId: prop.fieldId, fieldName: prop.caption, fieldProductValue: prop.value }))
        }];

        this.isSaving = true;
        return axios.post('/LocalProduct/SaveProductDepartmentFieldForChemsoft', { productsDepartmentFields })
          .then(() => {
            this.isSaving = false;
            this.isEditing = false;
            this.departmentOwnFields = event;
          }).catch(error => {
            this.isSaving = false;
            errorDebug(error);
          });
      }
    }
  },
  computed: {
    canEdit() {
      return this.appSettings.permissions.organizationSpecificField.full;
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisOwnFieldsEditor'] = this;
    if (this.sideTree.getSelectedDepartment()) {
      this.getOwnFieldsLists();
    }
  }
}
</script>