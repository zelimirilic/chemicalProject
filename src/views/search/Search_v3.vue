<template>
	<MainLoader v-if="!products" />
	<Tabs class="card pageWrapper" :tabs="tabs" prop="text" v-model="tabIndex" v-else>
		<keep-alive>
			<component :is="selectedTab.component" :data="selectedTab.data()" :perPage.sync="perPage" />
		</keep-alive>
	</Tabs>
</template>

<script>
import Search from './Search';
import MainLoader from '../../components/common/loaders/MainLoader_v3';
import Tabs from '../../components/common/tabs/Tabs_v3';

export default {
  extends: Search,
  name: 'Search',
  components: {
    MainLoader,
    Tabs
  }
}
</script>
