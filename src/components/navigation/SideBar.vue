<template>
	<aside class="asideCont userOrg hideOnPrint h-100" :class="isOpened ? '' : 'closed-xl closed-sm'">
		<template v-if="isOpened">
			<div class="h-100 departmentWrap" :class="{ slideInLeft: isOpened, slideInRight: !isOpened }">
				<header class="d-flex flex-row">
					<h6 class="mb-0">{{ getTranslation('I00.00013180', 'Departments') }}</h6>
					<router-link to="/settings/departments" class="icons icon-settings plainIcn ml-auto" v-tooltip="getTranslation('I00.00013180', 'Departments')" v-if="canSee.department()" />
					<button class="icons icon-closeAside plainIcn closed-mr" v-tooltip="getTranslation('I00.00004880', 'Close')" type="button" @click="$emit('input', !value)"></button>
				</header>
				<Tree :data="sideTree.getAllData()" :state="$store.getters.state.sideTreeState" @click="onClick" v-if="sideTree.getAllData()" />
			</div>
		</template>
		<A class="btn btn-plain topBtn closed-mr" :class="{ disabled: $route.name === 'departments' }" v-tooltip="getTranslation('I00.00053300', 'Department tree')" type="button" @click="$emit('input', !value)" v-else>
			<span class="icons icon-department"></span>
		</A>
	</aside>
</template>

<script>
import Tree from '../tree/Tree';
import { idToString, idsAreEqual } from '../../libraries/common';
import { canSee } from '../../libraries/permissions';

export default {
  components: {
    Tree
  },
  props: ['value', 'treeData'],
  methods: {
    onClick(item) {
      localStorage.setItem('lastViewNode', idToString(item.item.orgID));
      this.$emit('nodeSelected', item);
    },
  },
  computed: {
    department() {
      var it = this.sideTree.getAllData() ? this.sideTree.getAllData().find(f => idsAreEqual(f.item.orgID, this.appSettings.user.organisation)) : null;
      return (it || {}).item;
    },
    isOpened() {
      return this.value && this.$route.name !== 'departments';
    },
    canSee: canSee,
  }
}
</script>