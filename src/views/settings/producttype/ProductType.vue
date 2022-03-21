<template>
	<MainLoader v-if="!treeData" />
	<MainTitle class="card pageWrappper" :text="getTranslation('I00.00012550', 'Product type')" v-else>
		<div class="productType card-body">
			<div class="eqtree-default">
				<SmallLoader v-if="isSaving" />
				<ul class="eqtree-container-ul" v-else>
					<Leaf :item="treeData" :isRoot="true" :isLast="true" :isOpened="true" :state="state" :component="component" :placeholder="this.getTranslation('I00.00051850', 'Product type name')" :isEditing="isEditing" @open="treeStateOpen($event.item, $event.open)" @click="treeStateClick" @markAsRoot="markAsRoot" @resetRoot="resetRoot" @add="addProductType" @edit="$event.id ? editProductType($event) : addNewProductType($event)" @delete="deleteProductType" @cancel="cancelEdit" />
				</ul>
			</div>
		</div>
		<EditableLeafType :item="movingItem.item" :style="movingStyle" v-if="movingItem" />
		<ModalDialog :title="getTranslation('I00.00003650', 'Information')" @close="showinfo = false" v-if="showinfo">
			<div>
				{{ getTranslation('I00.00038910', 'Error saving data!') }}
			</div>
		</ModalDialog>
	</MainTitle>
</template>

<script>
import eqnode from 'eqnode';
import axios from '../../../axios';
import { errorDebug, parseID } from '../../../libraries/common';
import { stringSorter } from '../../../libraries/string';
import Leaf from '../../../components/tree/Leaf';
import EditableLeafType from '../../../components/tree/EditableLeafType';
import MainTitle from '../../../components/common/cardBox/MainTitle';
import { getProductTypeTreeData, defineState, idFnc } from '../../../libraries/tree';

export default {
  components: {
    MainTitle,
    Leaf,
    EditableLeafType
  },
  data() {
    return {
      treeData: null,
      state: {},
      component: EditableLeafType,
      showinfo: false,
      isSaving: false,
      isMoving: false,
      movingItem: null,
      movingStyle: {
        position: 'fixed',
        zIndex: 999,
        opacity: .8,
        left: '0px',
        top: '0px',
      },
    };
  },
  methods: {
    treeStateOpen(item, open) {
      item.getParents().forEach(f => defineState(this.state, f.item, 'opened', true));
      defineState(this.state, item.item, 'opened', open);
    },
    treeStateClick(item) {
      this.state = {};
      [item, ...item.getParents()].forEach(f => defineState(this.state, f.item, 'opened', true));
      [item].forEach(f => defineState(this.state, f.item, 'clicked', true));
    },
    errorDebug(error) {
      this.isSaving = false;
      return errorDebug(error);
    },
    addProductType(item) {
      var nod = this.treeData.find(f => f.item.orgID === item.orgID);
      var newNode = new eqnode({ isEditing: true });
      nod.addChild(newNode);
      nod.children
        .remove(newNode)
        .pushAt(newNode, 0);
    },
    editProductType(item) {
      this.isSaving = true;
      axios.post('/ProductType/ChangeName', { TypeID: item.orgID.id, TypeID_mdbID: item.orgID.id_mdbID, 'newTypeName': item.name })
        .then(response => {
          this.isSaving = false;
          if (!response.data.status) {
            this.showinfo = true;
          } else {
            var nod = this.treeData.find(f => f.item.orgID === item.orgID);
            nod.item.name = item.name;
          }
        }).catch(this.errorDebug);
    },
    addNewProductType(item) {
      var nod = this.treeData.find(f => !f.item.orgID);
      var par = nod.getParent();
      this.isSaving = true;
      axios.post('/ProductType/AddNewType', { TypeID: par.item.orgID.id, TypeID_mdbID: par.item.orgID.id_mdbID, 'newTypeName': item.name })
        .then(response => {
          this.isSaving = false;
          if (!response.data.status) {
            this.showinfo = true;
          } else {
            var newNode = new eqnode({
              orgID: parseID(response.data.id),
              name: item.name,
              numberOfProducts: 0,
              nodePath: par.item.nodepath + response.data.id + ';'
            });
            newNode.item.id = idFnc(newNode.item);
            par.children.remove(nod);
            par.addChild(newNode);
            par.children = par.children.sortBy(f => f.item.name, stringSorter);
          }
        }).catch(this.errorDebug);
    },
    cancelEdit(item) {
      if (!item.orgID) {
        var nod = this.treeData.find(f => f.item === item);
        var par = nod.getParent();
        par.children.remove(nod);
      }
    },
    markAsRoot(item) {
      this.isSaving = true;
      axios.post('/ProductType/SetRootProductType', { RootTypeID: item.orgID.id, RootTypeIDmdbID: item.orgID.id_mdbID })
        .then(response => {
          this.isSaving = false;
          if (response.data.status) {
            var nod = this.treeData.find(f => f.item.orgID === item.orgID);
            this.treeData.forEach(function (f) {
              if (f.item.orgID === nod.item.orgID)
                f.item.isRoot = true;
              else
                f.item.isRoot = false;
            });
            this.treeStateClick(nod);
          }

        }).catch(this.errorDebug);
    },
    resetRoot() {
      this.isSaving = true;
      axios.post('/ProductType/ResetRootProductType')
        .then(response => {
          this.isSaving = false;
          if (response.data.status) {
            var nod = this.treeData.find(f => f.item.isRoot);
            nod.item.isRoot = false;
            this.treeStateClick(nod);
            this.treeData.getTopParent().item.isRoot = true;
            nod = this.treeData.find(f => f.item.isRoot);
            this.treeStateClick(nod);

          }
        }).catch(this.errorDebug);
    },
    deleteProductType(item) {
      this.confirm(this.getTranslation('I00.00008300', 'Clear'), this.getTranslation('I00.00020020', 'Do you really want to delete selected type?'))
        .then(() => {
          this.loading = true
          this.isSaving = true;
          return axios.post('/ProductType/DeleteType', { TypeID: item.orgID.id, TypeID_mdbID: item.orgID.id_mdbID })
            .then(response => {
              this.isSaving = false;
              if (!response.data.status) {
                this.showinfo = true;
              } else {
                var nod = this.treeData.find(f => f.item.orgID === item.orgID);
                var par = nod.getParent();
                par.children.remove(nod);
              }
            })
            .catch(this.errorDebug);
        });
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisProductType'] = this;

    getProductTypeTreeData()
      .then(response => {
        this.treeData = response;
        var nod = this.treeData.find(f => f.item.isRoot);
        this.$nextTick(() => this.treeStateClick(nod || this.treeData));
      });

    this.getTranslation('I00.00008300', 'Clear');
    this.getTranslation('I00.00020020', 'Do you really want to delete selected type?');
  },
  beforeDestroy() {
    axios.cancelAll();
  },
  computed: {
    isEditing() {
      return this.treeData.find(f => f.item.isEditing) != null;
    }
  },
};
</script>