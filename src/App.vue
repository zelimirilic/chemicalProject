<template>
	<div class="mainBox" ref="hideOnPrint">
		<LogIn v-if="$route.path.startsWith('/login')" />
		<OneOffMeasure v-else-if="$route.path.includes('/measure')" />
		<Main v-else-if="$route.meta.isInMainPage" />
		<ErrorPage v-else />
	</div>
</template>

<script>
import Main from "./views/Main";
import LogIn from "./views/login/LogIn";
import OneOffMeasure from "./views/overview/OneOffMeasure.vue";
import ErrorPage from './views/login/ErrorPage.vue';

export default {
  components: {
    Main,
    LogIn,
    OneOffMeasure,
    ErrorPage
  },
  mounted() {
    window.thisVue = this;
    window.ThisIsChemsoft = true;
  }
};
</script>