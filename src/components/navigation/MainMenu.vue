<template>
	<ul class="mainMenu navbar-nav flex-row">
		<router-link to="/overview" class="nav-item" tag="li" v-if="canSee.overview()">
			<span class="nav-link">{{ getTranslation('I00.00007700', 'Overview') }}</span>
		</router-link>
		<router-link :to="{ name: 'reportChemical', params: { tab: 'department' } }" class="nav-item" exact tag="li">
			<span class="nav-link">{{ getTranslation('I00.00047720', 'Chemical list') }}</span>
		</router-link>
		<DropDownMenu :class="{ 'router-link-active': isActivePath('/reports') || isChemicalListFilterPath }" ref="reports" v-show="hasChemicals">
			<span class="nav-link dropdown-toggle">
				<span class="mr-1">{{ getTranslation('I00.00004610', 'Reports') }}</span>
			</span>
			<template #items>
				<router-link to="/reports/chemical_report/department" class="dropdown-item" exact v-if="canSee.reportStatutory()">{{ getTranslation('I00.00051520', 'Chemical report') }}</router-link>
				<router-link to="/reports/adr/department" class="dropdown-item" exact v-if="canSee.reportAdr()">ADR</router-link>
				<router-link to="/reports/fire/department" class="dropdown-item" exact v-if="canSee.reportFire()">{{ getTranslation('I00.00006490', 'Fire') }}</router-link>
				<router-link :to="reportRoute(report)" class="dropdown-item" exact v-for="(report, ind) in visibleReports" :key="'custom' + ind">{{ report.filterName }}</router-link>
			</template>
		</DropDownMenu>
		<DropDownMenu :class="{ 'router-link-active': isActivePath('/chemicals') }" ref="chemicals" v-show="hasChemicals">
			<span class="nav-link dropdown-toggle">
				<span class="mr-1">{{ getTranslation('I00.00047340', 'Tools') }}</span>
			</span>
			<template #items>
				<router-link to="/chemicals/inventory" class="dropdown-item" v-if="canSee.inventory()">{{ getTranslation('I00.00024750', 'Inventory') }}</router-link>
				<router-link :to="{ name: 'riskList', params: { tab: 'risks' } }" class="dropdown-item" v-if="canSee.riskAssessment()">{{ getTranslation('I00.00005660', 'Risk assessment') }}</router-link>
				<router-link to="/chemicals/substitution" class="dropdown-item" v-if="canSee.substitution()">{{ getTranslation('I00.00012140', 'Substitution') }}</router-link>
				<router-link to="/chemicals/exposureScenario" class="dropdown-item" v-if="canSee.exposureScenario()">{{ getTranslation('I00.00046720', 'Exposure scenarios') }}</router-link>
				<router-link to="/chemicals/document" class="dropdown-item" v-if="canSee.document()">{{ getTranslation('I00.00013360', 'Document') }}</router-link>
				<router-link :to="{ name: 'localProducts' }" class="dropdown-item" v-if="canSee.localProducts()">{{ getTranslation('I00.00048290', 'Own products') }}</router-link>
				<router-link :to="{ name: 'applications' }" class="dropdown-item" v-if="canSee.application()">{{ getTranslation('I00.00012050', 'Applications') }}</router-link>
			</template>
		</DropDownMenu>
		<DropDownMenu :class="{ 'router-link-active': isActivePath('/archive') }" ref="archive" v-show="hasArchive">
			<span class="nav-link dropdown-toggle">
				<span class="mr-1">{{ getTranslation('I00.00034190', 'Archive') }}</span>
			</span>
			<template #items>
				<router-link to="/archive/history" class="dropdown-item" v-if="canSee.history()">{{ getTranslation('I00.00007580', 'History') }}</router-link>
			</template>
		</DropDownMenu>
	</ul>
</template>

<script>
import { isActivePath } from '../../libraries/router';
import { canSee } from '../../libraries/permissions';
import DropDownMenu from '../menu/DropDownMenu';

export default {
  components: {
    DropDownMenu
  },
  data() {
    return {
      hasReports: false,
      hasChemicals: false,
      hasArchive: false,
    };
  },
  methods: {
    isActivePath: isActivePath,
    hasChildren(prop) {
      return !!this.$refs[prop].$slots.items;
    },
    calculateShows() {
      this.hasReports = this.hasChildren('reports');
      this.hasChemicals = this.hasChildren('chemicals');
      this.hasArchive = this.hasChildren('archive');
    },
    reportRoute(report) {
      return {
        name: report.filterObject.route.name,
        params: report.filterObject.route.params,
        query: { id: report.id }
      };
    }
  },
  watch: {
    '$store.getters.state.appSettings'() {
      this.$nextTick(() => this.calculateShows());
    }
  },
  computed: {
    canSee: canSee,
    visibleReports() {
      var selectedOrgNodePath = (this.sideTree.getSelectedDepartment() || {}).nodePath;
      return this.$store.getters.state.customReports
        .filter(f => !f.department || (selectedOrgNodePath && selectedOrgNodePath.startsWith(f.department.nodePath || f.department.item.nodePath)));
    },
    customReports() {
      return this.visibleReports.filter(f => f.isForAllUsers);
    },
    myReports() {
      return this.visibleReports.filter(f => this.customReports.indexOf(f) === -1);
    },
    isChemicalListFilterPath() {
      return this.$route.name === 'reportChemical' && this.$route.query.id;
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisMainMenu'] = this;
    this.calculateShows();
  }
}
</script>