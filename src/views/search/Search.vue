<template>
	<MainLoader v-if="!products" />
	<Tabs class="card pageWrapper" :tabs="tabs" prop="text" v-model="tabIndex" v-else>
		<keep-alive>
			<component :is="selectedTab.component" :data="selectedTab.data()" :perPage.sync="perPage" />
		</keep-alive>
	</Tabs>
</template>

<script>
import axios from '../../axios';
import Tabs from '../../components/common/tabs/Tabs';
import Products from '../../components/search/Products';
import Types from '../../components/search/Types';
import Substances from '../../components/search/Substances';
import Departments from '../../components/search/Departments';
export default {
  components: {
    Tabs,
  },
  data() {
    return {
      tabIndex: 0,
      products: null,
      types: null,
      perPage: 20,
    };
  },
  methods: {
    postRequest() {
      this.products = null;
      axios.cancelAll()
        .postWithCancelToken('/MyList/SearchAll', { ...this.$route.query, orgId: this.sideTree.getSelectedDepartment().orgID })
        .then(response => {
          var data = response.data;
          Object.keys(data).forEach(key => this[key] = data[key]);
        });
    },
    nodeSelected() {
      this.postRequest();
    }
  },
  computed: {
    tabs() {
      return [
        { text: this.getTranslation('I00.00013050', 'Products'), component: Products, data: () => this.products },
        { text: this.getTranslation('I00.00006430', 'Type'), component: Types, data: () => this.types },
        { text: this.getTranslation('I00.00006070', 'Substances'), component: Substances, data: () => this.substances },
        { text: this.getTranslation('I00.00013180', 'Departments'), component: Departments, data: () => this.departments },
      ];
    },
    selectedTab() {
      return this.tabs[this.tabIndex];
    },
  },
  watch: {
    '$route.query'() {
      this.postRequest();
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisSearch'] = this;
    if (this.sideTree.getSelectedDepartment()) {
      this.postRequest();
    }
    this.getTranslation('I00.00012130', 'All');
  },
  beforeDestroy() {
    axios.cancelAll();
  }
}
</script>