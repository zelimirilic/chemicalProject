<template>
	<DropDownMenu align="right">
		<span class="flagWrap dropdown-toggle"></span>
		<template #items>
			<SelectGroup class="mb-0" @click.stop :items="documentLanguageList" prop="languageName" :value="getDocumentLanguage" @input="setDocumentLanguage($event)" :text="getTranslation('I00.00006560', 'Document language')" />
			<SelectGroup class="mb-0" @click.stop :items="systemLanguageList" prop="languageName" :value="getSystemLanguage" @input="setSystemLanguage($event)" :text="getTranslation('I00.00007060', 'System language')" />
		</template>
	</DropDownMenu>
</template>

<script>
import DropDownMenu from '../menu/DropDownMenu_v3.vue';
import SelectGroup from '../common/form/select/SelectGroup_v3.vue';
import axios from '../../axios'
import { errorDebug } from '../../libraries/common_v3';

export default {
  name: 'LanguageMenu',
  components: {
    DropDownMenu,
    SelectGroup
  },
  data() {
    return {
      systemLanguage: null,
      documentLanguage: null,
      systemLanguageList: [],
      documentLanguageList: []
    }
  },
  methods: {
    setDocumentLanguage(language) {
      this.documentLanguage = language.languageCode;
      this.setDocumentAndApplicationLanguage();
    },
    setSystemLanguage(language) {
      this.systemLanguage = language.languageCode;
      this.setDocumentAndApplicationLanguage();
    },
    setDocumentAndApplicationLanguage() {
      return axios.post('/LanguageSelector/ChangeLanguage', { doc_lang: this.documentLanguage, sys_lang: this.systemLanguage })
        .then(() => {
          this.$emit('changed');
        })
        .catch(errorDebug);
    }
  },
  computed: {
    getDocumentLanguage() {
      return this.documentLanguageList.find(f => f.languageCode === this.documentLanguage);
    },
    getSystemLanguage() {
      return this.systemLanguageList.find(f => f.languageCode === this.systemLanguage);
    }
  },
  mounted() {
    axios.get('/LanguageSelector/ChooseLanguage')
      .then(response => {
        this.systemLanguageList = response.data.sysLanguagesList;
        this.documentLanguageList = response.data.docLanguagesList;

        this.systemLanguage = response.data.currentSystemLanguage;
        this.documentLanguage = response.data.currentDocumentLanguage;
      })
      .catch(errorDebug);
  }
}
</script>