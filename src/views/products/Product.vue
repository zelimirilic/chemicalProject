<template>
	<component :id="parseID($route.params.id.replaceAll('_', ':'))" :is="tabs[activeTab].component" />
</template>

<script>
import ProductPage from './productPage/ProductPage';
import SafetySheet from './safetySheet/SafetySheet';
import Sds from './sds/Sds';
import { parseID } from '../../libraries/common';

export default {
  name: 'Product',
  components: {
    ProductPage,
    SafetySheet,
    Sds
  },
  methods: {
    tabChanged(activeTab) {
      this.$router.replace({ name: this.$route.name, params: { ...this.$route.params, component: this.tabs[activeTab].component.splitByUpperCase().map(f => f.toLowerCase()).join('_') } });
    },
    parseID,
  },
  computed: {
    activeTab() {
      var component = this.tabs.find(f => f.component.toLowerCase() === (this.$route.params.component || '').replace('_', ''));
      return component ? this.tabs.indexOf(component) : 0;
    },
    tabs() {
      return [
        {
          component: 'ProductPage'
        },
        {
          component: 'SafetySheet'
        },
        {
          component: 'Sds'
        }
      ];
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisProduct'] = this;
  },
};
</script>