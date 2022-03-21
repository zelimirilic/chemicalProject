<template>
	<MainLoader v-if="!settingsGroupByCategory" />
	<MainTitle class="card pageWrapper" :text="getTranslation('I00.00041900', 'Settings')" v-else>
		<template v-slot:linkSlot>
			<ButtonIconSave @click="save" :class="{ disabled: !isModelValid || hashSettings === currentHash || saving }" />
		</template>
		<SmallLoader v-if="saving" />
		<template v-else>
			<Accordion class="smallBox" accordionClass="pb-5" v-for="category in settingsGroupByCategory" :key="category.key" :text="category.key" v-model="category.Expanded">
				<template v-for="subcategory in category.items.sortBy('key')">
					<Subtitle v-if="subcategory.key" :text="subcategory.key" :key="subcategory.key"></Subtitle>
					<div class="settingRow" v-for="(item, ind) in subcategory.items" :key="subcategory.key + ind">
						<div class="row align-items-center mx-3 py-3">
							<div class="col-3" v-if="item.SettingType === 2">
								<InputGroup :type="'text'" :validations="[maxLength(512)]" v-model="item.SettingValue" :class="{ readOnly: !item.SettingEnabled }" />
							</div>
							<div class="col-3" v-else-if="item.SettingType === 3">
								<select class="form-control" v-model="item.StartValue" @change="changeOption(item, $event)">
									<option v-for="(jsonItem, ind) in item.JsonSettingObject" :key="ind" :value="jsonItem.Value" :selected="jsonItem.Value == item.StartValue">{{ jsonItem.Name }}</option>
								</select>
							</div>
							<div class="col-3 text-center" v-else>
								<label class="switch">
									<input type="checkbox" class="switcher" :class="{ switcherChecked: item.SettingValue == '1' }" :name="item.SettingName" :checked="item.SettingValue == '1'" :disabled="!item.SettingEnabled" @click="toggleSwitch(item, $event)" />
									<b class="slider" :class="{ disabled: !item.SettingEnabled }"></b>
								</label>
							</div>
							<div class="col-9">
								<h6>{{ item.SettingName }}</h6>
								<p class="pt-1">{{ item.SettingDescription }}</p>
							</div>
						</div>
					</div>
				</template>
			</Accordion>
		</template>
		<template>
			<ModalDialog v-if="showModal" :title="getTranslation('I00.00051560', 'Changed settings')" additional-class="w-50" @close="cancel">
				<SettingsModalDialogList :data="changedSettings" v-if="changedSettings" />
				<SmallLoader v-else />
				<div class="pt-4 text-right">
					<ButtonOk @click="finalSave" :class="{ disabled: !isOkEnabled }" />
					<ButtonCancel @click="cancel" />
				</div>
				<div class="col-12 mt-5" v-if="cookiesChanged">
					<p class="alert alert-danger w-100">{{ info() }}</p>
				</div>
			</ModalDialog>
		</template>
	</MainTitle>
</template>

<script>
import axios from '../../../axiosOld-DONOTUSE';
import { hashCode, errorDebug, ticker } from '../../../libraries/common';
import { stringSorter } from '../../../libraries/string';
import { validators } from '../../../libraries/forms';
import MainTitle from '../../../components/common/cardBox/MainTitle';
import Accordion from '../../../components/common/accordion/Accordion';
import Subtitle from '../../../components/common/cardBox/Subtitle';
import SettingsModalDialogList from '../../../components/settings/settings/SettingsModalDialogList';
import { loadSettings } from '../../../libraries/vue';

export default {
  components: {
    MainTitle,
    Accordion,
    Subtitle,
    SettingsModalDialogList,
  },
  data() {
    return {
      settingsGroupByCategory: null,
      loadedSettings: null,
      changedSettings: null,
      hashSettings: null,
      saving: false,
      showModal: false,
      cookiesChanged: false,
      $modelValidators: [],
      currentWebFolder: null
    };
  },
  methods: {
    getMasterSettings() {
      return axios
        .cancelAll()
        .postWithCancelToken('/Settings/GetMasterSettings')
        .then(response => {
          this.settingsGroupByCategory = response.data.Settings.groupBy(f => f.SettingCategory).map(f => ({
            Expanded: true,
            key: f.key,
            items: f.items.groupBy(g => g.SettingSubcategory)
              .map(h => ({ key: h.key, items: h.items.sortBy('SettingName', stringSorter) }))
          }));
          this.hashSettings = hashCode(this.settingsGroupByCategory.map(f => f.items));
          this.loadedSettings = this.prepareDataForSavingSettings();
        })
        .catch(errorDebug);
    },
    save() {
      this.showModal = true;
      var settingsListChanged = this.prepareDataForSavingSettings();
      this.changedSettings = null;
      return axios
        .cancelAll()
        .postWithCancelToken('/Settings/GetChangedSettingsChemsoft', { settingsListChanged: settingsListChanged, settingsList: this.loadedSettings })
        .then(response => {
          this.changedSettings = response.data.SettingsList;
          this.currentWebFolder = response.data.WebFolder;
          this.cookiesChanged = this.appSettings.webFolder !== response.data.WebFolder;
        })
        .catch(errorDebug);
    },
    info() {
      return "Web Folder is changed from " + this.appSettings.webFolder + " to " + this.currentWebFolder + ". Saving is not allowed! Please login again!"
    },
    prepareDataForSavingSettings() {
      return this.settingsGroupByCategory
        .mapMany(f => f.items.mapMany(g => g.items))
        .map(f => ({
          Setting: f.SettingName,
          Value: f.StartValue !== f.SettingValue ? f.SettingValue : f.StartValue,
          ID: f.SettingId,
          SettingType: f.SettingType
        }));
    },
    cancel() {
      this.showModal = false;
    },
    finalSave() {
      this.showModal = false;
      this.saving = true;
      return axios
        .post('/Settings/SetSettingsChemsoft', { data: this.prepareDataForSavingSettings() })
        .then(() => loadSettings.call(this)
          .then(() => {
            this.hashSettings = this.currentHash;
            this.loadedSettings = this.prepareDataForSavingSettings();
            this.saving = false;
            ticker.addSuccessMessage(this.getTranslation('I00.00020320', 'Saved'));
          }))
        .catch(errorDebug);
    },
    toggleSwitch(item, event) {
      item.SettingValue = event.target.checked ? '1' : '0';
    },
    maxLength: validators.maxLength,
    changeOption(item, event) {
      item.SettingValue = event.target.value;
    },
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    isOkEnabled() {
      return (this.changedSettings || []).length > 0 && !this.cookiesChanged;
    },
    currentHash() {
      return hashCode(this.settingsGroupByCategory.map(f => f.items));
    },
  },
  beforeDestroy() {
    axios.cancelAll();
    ticker.clearMessages();
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisSettings'] = this;
    this.getMasterSettings();

    this.getTranslation('I00.00020320', 'Saved');
  }
};
</script>