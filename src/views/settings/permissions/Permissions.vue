<template>
	<MainLoader v-if="!permissions" />
	<MainTitle class="card pageWrapper" :text="getTranslation('I00.00030740', 'Permissions')" :class="{ disabled: isSaving }" v-else>
		<template v-slot:linkSlot>
			<ButtonIconAdd @click="openModal(null)" />
			<ButtonIconSave @click="saveChanges" :class="{ disabled: !isChanged }" />
		</template>
		<DataTable :tableData="permissions.filter((obj) => !obj.deleted)" :perPage.sync="perPage" :excelTitle="getTranslation('I00.00030740', 'Permissions')" noHeader>
			<template #head>
				<tr>
					<Th class="w-20" prop="name" sort export>{{ getTranslation('I00.00030700', 'Group name') }}</Th>
					<Th prop="description" sort export>{{ getTranslation('I00.00002980', 'Description') }}</Th>
					<Th class="iconCol">&nbsp;</Th>
				</tr>
			</template>
			<template #body="group">
				<tr>
					<td class="w-20">
						<A @click="openModal(idToSlashedString(group.item.userGroupID))">
							{{ group.item.name }}
						</A>
					</td>
					<td>
						<A @click="openModal(idToSlashedString(group.item.userGroupID))">
							{{ group.item.description }}
						</A>
					</td>
					<td class="iconCol">
						<template v-if="canEditPermissions(group.item)">
							<span v-if="hasUsers(group.item)" v-tooltip="getTranslation('I00.00030680', 'Cant delete groups with users..')">
								<A class="icons icon-delete disabled"></A>
							</span>
							<span v-else>
								<A class="icons icon-delete" v-tooltip="getTranslation('I00.00039230', 'Delete')" @click="group.item.deleted = true"></A>
							</span>
						</template>
					</td>
				</tr>
			</template>
		</DataTable>
		<ModalDialog additional-class="wp-800" :title="getTranslation('I00.00030740', 'Permissions')" v-if="showModal" @close="closeModal">
			<Permission :id="id" @updated="update" @added="add"></Permission>
		</ModalDialog>
	</MainTitle>
</template>
<script>
import axios from '../../../axiosOld-DONOTUSE';
import { errorDebug, camelCaseObj, idToSlashedString, idsAreEqual, idToString, ticker } from '../../../libraries/common';
import { canEditPermissions } from '../../../libraries/permissions';
import MainTitle from '../../../components/common/cardBox/MainTitle';
import ButtonIconAdd from '../../../components/common/button/buttonIcon/ButtonIconAdd';
import Permission from '../../../../src/views/settings/permissions/Permission';
import ModalDialog from '../../../components/common/modal/ModalDialog';

export default {
  name: 'Permissions',
  components: {
    MainTitle,
    ButtonIconAdd,
    Permission,
    ModalDialog
  },
  data() {
    return {
      permissions: null,
      groupsWithUsers: null,
      isSaving: false,
      perPage: 20,
      id: null,
      showModal: false
    };
  },
  methods: {
    getAllPermissions() {
      return axios.cancelAll()
        .postWithCancelToken('/UserGroupsAndPermissionsManagement/UserGroupsForChemsoft')
        .then(response => {
          this.permissions = camelCaseObj(response.data.permissions);
          this.groupsWithUsers = response.data.groupsWithUsers;
        }).catch(errorDebug);
    },
    saveChanges() {
      var groupsForSave = this.permissions.filter(obj => obj.deleted);
      this.isSaving = true;
      return axios
        .post('/UserGroupsAndPermissionsManagement/SaveUserGroups', { model: groupsForSave.map(f => ({ ...f, id: idToString(f.userGroupID), isDeleted: true })) })
        .then(() => {
          this.permissions = this.permissions.filter(f => !f.deleted);
          this.isSaving = false;
        }).catch(errorDebug);
    },
    hasUsers(item) {
      return this.groupsWithUsers.any(f => idsAreEqual(f, item.userGroupID));
    },
    canEditPermissions: canEditPermissions,
    idToSlashedString: idToSlashedString,
    update(group) {
      (this.permissions || []).splice(this.permissions.findIndex(x => x.userGroupID === group.userGroupID), 1, group);
      this.closeModal();
    },
    add(group) {
      this.permissions.push(group);
      this.closeModal();
    },
    openModal(id) {
      this.id = id;
      this.showModal = true;
    },
    closeModal() {
      this.id = null;
      this.showModal = false;
    }
  },
  computed: {
    isChanged() {
      return (this.permissions || []).any(obj => obj.deleted);
    }
  },
  watch: {
    isChanged() {
      ticker.clearMessages();
      if (this.isChanged)
        ticker.addWarningMessage(this.getTranslation('I00.00010100', 'Unsaved data!'));
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisPermissions'] = this;
    this.getAllPermissions();
    this.getTranslation('I00.00012130', 'All');
  },
  beforeDestroy() {
    ticker.clearMessages();
    axios.cancelAll();
  },
};
</script>