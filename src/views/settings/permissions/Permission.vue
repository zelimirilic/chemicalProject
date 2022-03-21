<template>
	<MainLoader v-if="!group" />
	<MainTitle class="card pageWrapper wp-640 mx-auto" :text="getTranslation('I00.00030290', 'Authorisation group')" v-else>
		<template #linkSlot v-if="appSettings.permissions.usersAndPermissions.full && canEditPermissions(group)">
			<ButtonIconRestore :class="{ disabled: !isChanged }" @click="restoreChanges" />
			<ButtonIconSave :class="{ disabled: !isModelValid || !isChanged }" @click="saveChanges" />
		</template>
		<SmallLoader v-show="smallLoader" />
		<div :class="{ readOnly: !appSettings.permissions.usersAndPermissions.full || !canEditPermissions(group) }" v-show="!smallLoader">
			<div class="row mx-0 px-2 py-4 lightGrayBg borderB">
				<div class="col-xl-6 col-12">
					<InputGroup :text="getTranslation('I00.00020000', 'Name')" v-model="group.name" required />
				</div>
				<div class="col-xl-6 col-12 mt-xl-0 mt-3">
					<SelectGroup class="mb-0" :items="startUpPages()" prop="name" :value="startUpPage" @input="group.startUpType = $event.page" :text="getTranslation('I00.00053590', 'Start page')" compareByHash />
				</div>
				<div class="col-12 mt-3">
					<TextAreaGroup :text="getTranslation('I00.00014970', 'Note')" v-model="group.description" :validations="[maxLength(255)]" />
				</div>
			</div>
			<DataTable class="m-4 borderTRBL rounded" tableWrapClass="mxvh-38" tableClass="transparent blackTxt valignM" :tableData="group.permissions" :perPage="1000" :title="group.name" :excelTitle="`${getTranslation('I00.00030290', 'Authorisation group')}: ${group.name}`" @sortedData="sortedData = $event" noHeader noSearch noFooter>
				<template #head>
					<tr>
						<Th class="w-50 skipColumn" :prop="(f) => getSystemTranslation(f.permission.name, 'Permission name')" export>{{ getTranslation('I00.00030730', 'Authorisation') }}</Th>
						<Th v-show="false" :export="(f) => titleTranslation[f.right]">{{ getTranslation('I00.00051730', 'Permission state') }}</Th>
						<th class="text-center skipColumn ignoreInExportToExcel">
							<div class="custom-check radio" withReadOnlyMode>
								<input type="radio" id="radioAll1" class="custom-input" :checked="isAll(0)" @click="setAll(0)" :title="titleTranslation['0']" />
								<label class="custom-label" :class="{ disabled: !canEditPermissions(group) }" :for="'radioAll1'" v-tooltip="titleTranslation['0']">
									<b>{{ titleTranslation['0'] }}</b>
								</label>
							</div>
						</th>
						<th class="text-center skipColumn ignoreInExportToExcel">
							<div class="custom-check radio" withReadOnlyMode>
								<input type="radio" id="radioAll2" class="custom-input" :checked="isAll(1)" @click="setAll(1)" :title="titleTranslation['1']" />
								<label class="custom-label" :class="{ disabled: !canEditPermissions(group) }" :for="'radioAll2'" v-tooltip="titleTranslation['1']">
									<b>{{ titleTranslation['1'] }}</b>
								</label>
							</div>
						</th>
						<th class="text-center skipColumn ignoreInExportToExcel">
							<div class="custom-check radio" withReadOnlyMode>
								<input type="radio" id="radioAll3" class="custom-input" :checked="isAll(2)" @click="setAll(2)" :title="titleTranslation['2']" />
								<label class="custom-label" :class="{ disabled: !canEditPermissions(group) }" :for="'radioAll3'" v-tooltip="titleTranslation['2']">
									<b>{{ titleTranslation['2'] }}</b>
								</label>
							</div>
						</th>
					</tr>
				</template>
				<template #body="data">
					<tr>
						<td class="w-50 skipColumn">
							{{ getSystemTranslation(data.item.permission.name, 'Permission name') }}
						</td>
						<td class="text-center skipColumn ignoreInExportToExcel">
							<div class="custom-check radio" withReadOnlyMode @click="data.item.right = 0">
								<input type="radio" :id="'radio' + data.item.permission.id + titleTranslation['0']" class="custom-input" :checked="data.item.right == 0" :value="0" />
								<label class="custom-label" :class="{ disabled: !canEditPermissions(group) }" :for="'radio' + data.item.permission.id + titleTranslation['0']" v-tooltip="data.item.permission.id"></label>
							</div>
						</td>
						<td class="text-center skipColumn ignoreInExportToExcel">
							<div class="custom-check radio" withReadOnlyMode @click="data.item.right = 1">
								<input type="radio" :id="'radio' + data.item.permission.id + titleTranslation['1']" class="custom-input" :checked="data.item.right == 1" :value="1" />
								<label class="custom-label" :class="{ disabled: !canEditPermissions(group) }" :for="'radio' + data.item.permission.id + titleTranslation['1']" v-tooltip="data.item.permission.id"></label>
							</div>
						</td>
						<td class="text-center skipColumn ignoreInExportToExcel">
							<div class="custom-check radio" withReadOnlyMode @click="data.item.right = 2">
								<input type="radio" :id="'radio' + data.item.permission.id + titleTranslation['2']" class="custom-input" :checked="data.item.right == 2" :value="2" />
								<label class="custom-label" :class="{ disabled: !canEditPermissions(group) }" :for="'radio' + data.item.permission.id + titleTranslation['2']" v-tooltip="data.item.permission.id"></label>
							</div>
						</td>
					</tr>
				</template>
			</DataTable>
		</div>
	</MainTitle>
</template>
<script>
import axios from '../../../axiosOld-DONOTUSE';
import { errorDebug, hashCode, parseID, camelCaseObj, ticker, deepClone } from '../../../libraries/common';
import MainTitle from '../../../components/common/cardBox/MainTitle';
import { canEditPermissions, startUpPages } from '../../../libraries/permissions';
import { checkIsValid } from '../../../libraries/vue';
import { validators } from '../../../libraries/forms';

export default {
  name: 'PermissionManagement',
  components: {
    MainTitle
  },
  props: ['id'],
  data() {
    return {
      group: null,
      restoreData: null,
      hashSettings: null,
      $modelValidators: [],
      smallLoader: false,
      hasFullPermission: true,
      sortedData: null,
    };
  },
  methods: {
    getPermissions(groupId) {
      return axios
        .cancelAll()
        .postWithCancelToken('/UserGroupsAndPermissionsManagement/GetPermissions', { id: groupId ? parseID(groupId.replace('_', ':')) : null })
        .then(response => {
          this.group = camelCaseObj(response.data);
          this.restoreData = camelCaseObj(response.data);
          this.sortedData = this.group;
          this.hashSettings = hashCode(this.group);
        }).catch(errorDebug);
    },
    saveChanges() {
      if (!checkIsValid(this)) return;
      this.smallLoader = true;
      return axios
        .post('/UserGroupsAndPermissionsManagement/Save', { model: this.group })
        .then(response => {
          this.group = camelCaseObj(response.data);
          this.restoreData = camelCaseObj(response.data);
          this.sortedData = this.group.permissions.filter(f => this.sortedData.any(g => g.permission.id === f.permission.id));
          this.hashSettings = hashCode(this.group);

          if (!this.id)
            this.$emit('added', this.group);
          else {
            this.$emit('updated', this.group);
          }

          this.smallLoader = false;
        }).catch(errorDebug);
    },
    restoreChanges() {
      this.group = deepClone(this.restoreData);
    },
    isAll(val) {
      return this.sortedData.length && this.sortedData.all(f => f.right === val);
    },
    setAll(val) {
      this.sortedData.forEach(f => f.right = val);
    },
    canEditPermissions: canEditPermissions,
    startUpPages: startUpPages,
    maxLength: validators.maxLength
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    isChanged() {
      return this.hashSettings !== hashCode(this.group);
    },
    titleTranslation() {
      return {
        0: this.getTranslation('I00.00009290', 'None'),
        1: this.getTranslation('I00.00009490', 'Read'),
        2: this.getTranslation('I00.00009520', 'Write')
      };
    },
    startUpPage() {
      var startUpPages = this.startUpPages();
      return startUpPages.find(f => f.page === this.group.startUpType) ||
        startUpPages[0];
    }
  },
  watch: {
    isChanged() {
      ticker.clearMessages();
      if (this.isChanged)
        ticker.addWarningMessage(this.getTranslation('I00.00010100', 'Unsaved data!'));
    }
  },
  translationsLoaded() {
    if (process.env.NODE_ENV === 'development') window['thisPermission'] = this;
  },
  mounted() {
    this.getPermissions(this.id);
    this.getTranslation('I00.00012130', 'All');
  },
  beforeDestroy() {
    ticker.clearMessages();
    axios.cancelAll();
  },
};
</script>