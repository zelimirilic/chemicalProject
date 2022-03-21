<template>
	<MainLoader v-if="!startPages || !sideTree.getSelectedDepartment()" :trans="defaultPageHtml" />
	<div class="home" v-else>
		<Dynamic :data="currentStartPage || defaultStartPage" :noEdit="!appSettings.editWelcomeMessage || !appSettings.permissions.editWelcomeText.full" v-show="!showEditMode" @edit="setEditMode(true)" />
		<DynamicEdit :data="currentStartPage || defaultStartPage" :loader="isSaving" @save="saveWelcomeData" @cancel="setEditMode(false)" v-if="showEditMode" />
	</div>
</template>

<script>
import Dynamic from './Dynamic';
import DynamicEdit from './DynamicEdit';
import axios from '../../axios';
import { errorDebug, idsAreEqual } from '../../libraries/common';
export default {
  components: {
    Dynamic,
    DynamicEdit,
  },
  data() {
    return {
      startPages: null,
      showEditMode: false,
      isSaving: false,
    }
  },
  methods: {
    nodeSelected() {
      this.setEditMode(false);
    },
    saveWelcomeData(data) {
      var startPage = { pageHtml: data.pageHtml, department: { orgID: this.sideTree.getSelectedDepartment().orgID, nodePath: this.sideTree.getSelectedDepartment().nodePath } };
      this.isSaving = true;
      axios.post('/Organisation/SaveStartPage', { startPage })
        .then(response => {
          var find = this.startPages.find(f => idsAreEqual(f.department.orgID, startPage.department.orgID));

          if (find)
            Object.assign(find, response.data);
          else
            this.startPages.push(response.data);

          this.isSaving = false;
          this.setEditMode(false);
        }).catch(errorDebug);
    },
    setEditMode(show) {
      if (show) {
        var treeData = this.sideTree.getAllData();
        this.startPages
          .map(f => treeData.find(g => idsAreEqual(f.department.orgID, g.item.orgID)))
          .forEach(f => this.$store.getters.treeStateStarred(f, true));
      } else {
        this.sideTree.getAllData().forEach(f => this.$store.getters.treeStateStarred(f, false));
      }
      this.showEditMode = show;
    },
  },
  computed: {
    defaultPageHtml() {
      return this.getTranslation('I00.00015440', 'If you have any questions about Chemsoft, or need assistance, do not hesitate to contact us.');
    },
    defaultStartPage() {
      return { pageHtml: this.defaultPageHtml };
    },
    currentStartPage() {
      if (!this.sideTree.getSelectedDepartment()) return null;
      var nodePath = this.sideTree.getSelectedDepartment().nodePath;
      var startPage = this.startPages
        .filter(f => nodePath.startsWith(f.department.nodePath))
        .sortBy(f => f.department.nodePath.length)
        .last();

      return startPage;
    },
  },
  translationsLoaded() {
    axios.post('/Organisation/GetStartPages')
      .then(response => {
        this.startPages = response.data;
      })
      .catch(errorDebug);
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisDynamicHomePage'] = this;
  }
}
</script>