<template>
	<MainLoader v-if="!treeData" />
	<div class="row" v-else>
		<div :class="appSettings.editOrganisationalInfo ? 'col-xl-4 col-12' : 'col-12'">
			<MainTitle class="card pageWrapper" :text="getTranslation('I00.00008870', 'Modify organisation')" @mouseMove="mouseMove">
				<div class="card-body">
					<div class="eqtree-default">
						<SmallLoader v-if="isSaving" />
						<ul class="eqtree-container-ul" style="position: relative; z-index: 1" v-else>
							<Leaf :item="(movingTreeData || treeData).sortBy((f) => f.item.name, stringSorter)" :isRoot="true" :isLast="true" :isOpened="true" :state="state" :component="component" :placeholder="getTranslation('I00.00051840', 'Department name')" :isEditing="isEditing" @open="treeStateOpen($event.item, $event.open)" @click="treeStateClick" @add="addDepartment" @edit="$event.id ? editDepartment($event) : addNewDepartment($event)" @delete="deleteDepartment" @cancel="cancelEdit" @move="moveStart" @mouseIn="addMovedItem" @mouseLeave="removeMovedItem" />
						</ul>
					</div>
				</div>
				<EditableLeaf :item="movingItem.item" :style="movingStyle" :isMoving="true" @mouseWheel="mousewheel" v-if="movingItem" />
			</MainTitle>
		</div>
		<div class="col-xl-8 col-12 mt-xl-0 mt-5">
			<DepartmentInfo :orgId="selectedOrgId" v-if="appSettings.editOrganisationalInfo && selectedOrgId" @saveButtonsStatus="saveButtonsStatus = $event" />
		</div>
		<ModalDialog v-if="showDialog" additional-class="wp-400" :title="getTranslation('I00.00015500', 'Information')" @close="closeDialog">
			<h6>{{ getTranslation('I00.00053860', 'If you leave before saving, your changes will be lost. Do you want to leave page without saving changes ?') }}</h6>
			<div class="pt-4 text-right">
				<ButtonOk @click="discardChanges" />
				<ButtonCancel @click="closeDialog" />
			</div>
		</ModalDialog>
	</div>
</template>

<script>
import eqnode from 'eqnode';
import axios from '../../../axiosOld-DONOTUSE';
import { errorDebug, parseID, idToString, ticker, idsAreEqual } from '../../../libraries/common';
import { stringSorter } from '../../../libraries/string';
import { getOrganisationTreeData, defineState, idFnc } from '../../../libraries/tree';
import Leaf from '../../../components/tree/Leaf';
import EditableLeaf from '../../../components/tree/EditableLeaf';
import MainTitle from '../../../components/common/cardBox/MainTitle';
import DepartmentInfo from '../../../components/settings/departmentInfo/DepartmentInfo';

export default {
  components: {
    MainTitle,
    Leaf,
    EditableLeaf,
    DepartmentInfo
  },
  data() {
    return {
      treeData: null,
      state: {},
      component: EditableLeaf,
      isSaving: false,
      isMoving: false,
      movingTreeData: null,
      movingItem: null,
      movingPosition: null,
      mouseEvent: null,
      selectedOrgId: null,
      to: null,
      showDialog: false,
      currentTreeData: null,
      selectedTreeData: null,
      treeNodeChange: false,
      saveButtonsStatus: false
    };
  },
  beforeRouteLeave(to, from, next) {
    if (this.to) {
      next();
    } else {
      this.to = to;
      if (this.saveButtonsStatus)
        this.showDialog = true;
      else
        next();
    }
  },
  methods: {
    closeDialog() {
      this.showDialog = false;
      this.to = null;
    },
    discardChanges() {
      if (this.treeNodeChange) {
        this.state = {};
        [this.selectedTreeData, ...this.selectedTreeData.getParents()].forEach(f => defineState(this.state, f.item, 'opened', true));
        defineState(this.state, this.selectedTreeData.item, 'clicked', true);
        this.selectedOrgId = { ...this.selectedTreeData.item.orgID };
        this.currentTreeData = this.selectedTreeData;
        this.treeNodeChange = false;
        this.showDialog = false;
      } else {
        this.showDialog = false;
        this.$router.push(this.to);
      }
    },
    treeStateOpen(item, open) {
      item.getParents().forEach(f => defineState(this.state, f.item, 'opened', true));
      defineState(this.state, item.item, 'opened', open);
    },
    treeStateClick(item) {
      if (!idsAreEqual(item.item.orgID, this.currentTreeData.item.orgID) && this.saveButtonsStatus) {
        this.showDialog = true;
        this.treeNodeChange = true;
        this.selectedTreeData = item;
      } else {
        this.state = {};
        [item, ...item.getParents()].forEach(f => defineState(this.state, f.item, 'opened', true));
        defineState(this.state, item.item, 'clicked', true);
        this.selectedOrgId = { ...item.item.orgID };
      }
    },
    errorDebug(error) {
      this.isSaving = false;
      return errorDebug(error);
    },
    addDepartment(item) {
      var nod = this.treeData.find(f => f.item.id === item.id);
      var newNode = new eqnode({ icon: 'tree-department', isEditing: true });
      nod.addChild(newNode);
      nod.children
        .remove(newNode)
        .pushAt(newNode, 0);
    },
    editDepartment(item) {
      this.isSaving = true;
      ticker.removeMessage(this.getTranslation('I00.00039690', 'Selected department is editing'))
      axios.post('/OrganizationTree/EditNode', { "id": idToString(item.orgID), "name": item.name })
        .then(response => {
          this.isSaving = false;
          if (response.data.edited) {
            ticker.addErrorMessage(this.getTranslation('I00.00039690', 'Selected department is editing'))
          } else if (response.data.status) {
            var nod = this.treeData.find(f => f.item.id === item.id);
            nod.item.name = item.name;
            this.refreshSideTree();
          }
        }).catch(this.errorDebug);
    },
    addNewDepartment(item) {
      var nod = this.treeData.find(f => !f.item.id);
      var par = nod.getParent();
      this.isSaving = true;
      ticker.removeMessage(this.getTranslation('I00.00039690', 'Selected department is editing'))
      axios.post('/OrganizationTree/CreateNode', { id: idToString(par.item.orgID), name: item.name, start_date: new Date() })
        .then(response => {
          this.isSaving = false;
          if (response.data.edited) {
            ticker.addErrorMessage(this.getTranslation('I00.00039690', 'Selected department is editing'))
          } else
            if (response.data.status) {
              var startDate = new Date(response.data.start_date);
              var newNode = new eqnode({
                orgID: parseID(response.data.id),
                name: item.name,
                startDate: startDate,
                oastartDate: startDate.getTime(),
                nodePath: par.item.nodepath + response.data.id + ';',
                icon: item.icon,
              });
              newNode.item.id = idFnc(newNode.item);
              //   newNode.DepartmentID = r.department_id;
              par.children.remove(nod);
              par.addChild(newNode);
              this.refreshSideTree();
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
    deleteDepartment(item) {
      this.isSaving = true;
      ticker.removeMessage(this.getTranslation('I00.00039690', 'Selected department is editing'))
      ticker.removeMessage(this.getTranslation('I00.00033080', 'Selected department cannot be removed...'));
      axios.post('/Inventory/IsAnyProductInventoried', { org_id: item.orgID.id, org_mdbid: item.orgID.id_mdbID })
        .then((response) => {
          if (response.data.prods_exist) {
            ticker.addErrorMessage(this.getTranslation('I00.00033080', 'Selected department cannot be removed...'));
            return new Promise((_, reject) => reject(false));
          }
        })
        .then(() => this.confirm(this.getTranslation('I00.00011090', 'Remove department'), this.getTranslation('I00.00009230', 'Do you really want to remove selected department?')))
        .then(() => axios.post('/OrganizationTree/RemoveNode', { id: idToString(item.orgID) }))
        .then(response => {
          this.isSaving = false;
          if (response.data.edited) {
            ticker.addErrorMessage(this.getTranslation('I00.00039690', 'Selected department is editing'))
          } else {
            if (response.data.status) {
              var nod = this.treeData.find(f => f.item.id === item.id);
              if (nod.item.orgID === this.selectedOrgId)
                this.treeStateClick(nod.getParent());

              var par = nod.getParent();
              par.children.remove(nod);

              this.refreshSideTree();
            }
          }
        })
        .catch(this.errorDebug);
    },
    moveStart(item, el, event) {
      var bndBx = el.getBoundingClientRect();
      this.movingPosition = {
        dx: bndBx.x - event.x,
        dy: bndBx.y - event.y
      };

      this.movingTreeData = this.treeData.filter(f => f.item !== item);
      this.movingItem = this.treeData.find(f => f.item === item).map(f => f.item);

      this.treeStateOpen(this.movingItem, false);
      defineState(this.state, item, 'moving', true);

      window.addEventListener('mouseup', this.moveEnd);
    },
    moveEnd() {
      window.removeEventListener('mouseup', this.moveEnd);
      Object.values(this.state).forEach(f => f.moving = false);

      var find = this.movingTreeData.find(f => f.item == this.movingItem.item);
      if (find) {
        if (this.treeData.find(f => f.item === find.item).getParent().item !== find.getParent().item) {
          ticker.removeMessage(this.getTranslation('I00.00039710', 'Information for error'));
          ticker.removeMessage(this.getTranslation('I00.00039690', 'Selected department is editing'));
          this.isSaving = true;
          axios.post('/OrganizationTree/MoveNode', { id: idToString(find.item.orgID), new_parent_id: idToString(find.getParent().item.orgID), department_id: find.item.department_id })
            .then(response => {
              this.isSaving = false;
              if (response.data.error) {
                ticker.addErrorMessage(this.getTranslation('I00.00039710', 'Information for error'));
              }
              if (response.data.edited) {
                ticker.addErrorMessage(this.getTranslation('I00.00039690', 'Selected department is editing'));
              } else
                if (response.data.status) {
                  find.forEach(f => f.item.nodePath = f.getParent().item.nodePath + idToString(f.item.orgID) + ';');

                  this.treeData = this.treeData.filter(f => f.item !== find.item);
                  this.treeData.find(f => f.item === find.getParent().item).addChild(find);

                  this.treeStateClick(find);

                  this.refreshSideTree();
                }
            }).catch(this.errorDebug);
        }

        this.treeStateClick(find);
        this.treeStateOpen(find, false);
      }

      this.movingTreeData = null;
      this.movingItem = null;
    },
    addMovedItem(item) {
      if (this.movingTreeData && item !== this.movingItem.item) {
        this.movingTreeData = this.movingTreeData.filter(f => f.item !== this.movingItem.item);
        var find = this.movingTreeData.find(f => f.item === item);
        find.addChild(this.movingItem);

        this.treeStateOpen(find, true);
        Object.values(this.state).forEach(f => f.clicked = false);
        defineState(this.state, find.item, 'clicked', true);
      }
    },
    removeMovedItem() {
      if (this.movingTreeData) {
        this.movingTreeData = this.movingTreeData.filter(f => f.item !== this.movingItem.item);
      }
    },
    mouseMove(event) {
      this.mouseEvent = event;
    },
    mousewheel(event) {
      var el = document.getElementsByClassName('scrollBar')[0];
      el.scrollBy(0, event.deltaY);
    },
    refreshSideTree() {
      this.$store.state.treeData = this.treeData.map(f => f.item);
    },
    stringSorter,
  },
  computed: {
    isEditing() {
      return this.treeData.find(f => f.item.isEditing) != null;
    },
    movingStyle() {
      if (this.movingItem) {
        return {
          position: 'fixed',
          'z-index': 0,
          opacity: .8,
          left: (this.mouseEvent.x + this.movingPosition.dx) + 'px',
          top: (this.mouseEvent.y + this.movingPosition.dy) + 'px',
        };
      }
      return null;
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisDepartments'] = this;

    getOrganisationTreeData()
      .then(response => {
        this.treeData = response;
        this.currentTreeData = response;
        this.$nextTick(() => this.treeStateClick(this.treeData));
      });

    this.getTranslation('I00.00011090', 'Remove department');
    this.getTranslation('I00.00009230', 'Do you really want to remove selected department?');
    this.getTranslation('I00.00039690', 'Selected department is editing');
    this.getTranslation('I00.00033080', 'Selected department cannot be removed...');
    this.getTranslation('I00.00039710', 'Information for error');
    this.getTranslation('I00.00015500', 'Information');
    this.getTranslation('I00.00053860', 'If you leave before saving, your changes will be lost. Do you want to leave page without saving changes ?');
  },
  beforeDestroy() {
    getOrganisationTreeData().then(dat => this.$store.getters.state.treeData = dat);
  }
};
</script>