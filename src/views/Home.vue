<template>
	<WelcomeHomePage v-if="!appSettings.dynamicHomePage" />
	<DynamicHomePage v-else />
</template>

<script>
import WelcomeHomePage from '../components/home/WelcomeHomePage';
import DynamicHomePage from '../components/home/DynamicHomePage';

export default {
  name: 'Home',
  components: {
    WelcomeHomePage,
    DynamicHomePage,
  },
}
</script>