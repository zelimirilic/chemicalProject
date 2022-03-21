<template>
	<keep-alive>
		<component :id="$route.params.id" :is="tabs[activeTab].component" />
	</keep-alive>
</template>

<script>
import SafetySheet from './safetySheet/SafetySheet';
import { parseID } from '../../libraries/common';

export default {
  name: 'Product',
  components: {
    SafetySheet,
  },
  methods: {
    tabChanged(activeTab) {
      this.$router.replace({ name: this.$route.name, params: { ...this.$route.params, component: this.tabs[activeTab].component.splitByUpperCase().map(f => f.toLowerCase()).join('_') } });
    },
    parseID,
  },
  computed: {
    activeTab() {
      var component = this.tabs.find(f => f.component.toLowerCase() === this.$route.params.component.replace('_', ''));
      return component ? this.tabs.indexOf(component) : 0;
    },
    tabs() {
      return [
        {
          label: this.getTranslation('I00.00000170', 'Safety sheet'),
          component: 'SafetySheet'
        },
      ];
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisActivity'] = this;
  },
};
</script>