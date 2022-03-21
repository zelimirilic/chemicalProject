<template>
	<MainLoader v-if="!usersData" />
	<MainTitle class="card pageWrapper" :text="getTranslation('I00.00030230', 'Users')" v-else>
		<template v-slot:linkSlot>
			<router-link :to="{ name: 'userNew', params: { component: 'new' } }" class="icons icon-plus" v-tooltip="getTranslation('I00.00014710', 'New')"></router-link>
		</template>
		<SmallLoader v-if="loading" />
		<UsersList v-show="!loading" :data="usersData" :title="organisationTreeRootName" :excelTitle="organisationTreeRootName" @click="deleteUser($event)" />
	</MainTitle>
</template>

<script>
import axios from '../../../axiosOld-DONOTUSE';
import { errorDebug, ticker } from '../../../libraries/common';
import MainTitle from '../../../components/common/cardBox/MainTitle';
import UsersList from '../../../components/settings/users/UsersList';

export default {
  name: 'Users',
  components: {
    MainTitle,
    UsersList
  },
  data() {
    return {
      usersData: null,
      loading: true,
      organisationTreeRootName: null,
    };
  },
  methods: {
    getUsersList() {
      this.loading = true
      return axios
        .cancelAll()
        .postWithCancelToken('/UserManagement/UserList')
        .then(response => {
          this.usersData = response.data;
          this.organisationTreeRootName = response.data.rootName
          this.loading = false;
        })
        .catch(this.errorDebug);
    },
    deleteUser(event) {
      this.confirm(this.getTranslation('I00.00030790', 'Delete user'), this.getTranslation('I00.00030820', 'Are you sure you want to delete user'))
        .then(() => {
          this.loading = true
          return axios.post('/UserManagement/Delete', { viewModel: event.UserID });
        }).then(() => {
          this.usersData.remove(event);
          this.loading = false;
          ticker.addSuccessMessage(this.getTranslation('I00.00051680', 'User deleted successfully'));
        }).catch(this.errorDebug);
    },
    errorDebug(response) {
      this.loading = false;
      errorDebug(response);
    },
  },
  translationsLoaded() {
    this.getUsersList();
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisUsers'] = this;
    this.getTranslation('I00.00030790', 'Delete user');
    this.getTranslation('I00.00030820', 'Are you sure you want to delete user');
    this.getTranslation('I00.00051680', 'User deleted successfully');
  },
  beforeDestroy() {
    axios.cancelAll();
    ticker.clearMessages();
  }
};
</script>