<template>
	<DataTable :tableData="data" :perPage.sync="perPage" :title="title" :excelTitle="title" noHeader>
		<template #head>
			<tr>
				<Th class="w-15" prop="EmpNo" sort export>{{ getTranslation('I00.00030430', 'Employee number') }}</Th>
				<Th prop="Name" sort export defaultSort>{{ getTranslation('I00.00004270', 'Name') }}</Th>
				<Th class="w-15" prop="Login" sort export>{{ getTranslation('I00.00007260', 'Login') }}</Th>
				<Th class="w-25" :prop="emailData" sort export>{{ getTranslation('I00.00008030', 'Email') }}</Th>
				<Th class="w-20" :prop="userGroupName" sort export>{{ getTranslation('I00.00030290', 'Group') }}</Th>
				<Th class="iconCol">&nbsp;</Th>
			</tr>
		</template>
		<template #body="data">
			<tr>
				<td class="w-15">
					<A @click="goToUser(data.item)">{{ data.item.EmpNo != null ? data.item.EmpNo : '' }}</A>
				</td>
				<td class="prodName">
					<A @click="goToUser(data.item)">{{ data.item.Name != null ? data.item.Name : '' }}</A>
				</td>
				<td class="w-15">
					<A @click="goToUser(data.item)">{{ data.item.Login != null ? data.item.Login : '' }}</A>
				</td>
				<td class="w-25">
					<A @click="goToUser(data.item)">{{ data.item.AdditionalInfo != null ? data.item.AdditionalInfo.Email : '' }}</A>
				</td>
				<td class="w-20">
					<router-link :to="{ name: 'permission', params: { id: idToSlashedString(data.item.Group.UserGroupID) } }" v-if="data.item.Group && data.item.Group.Name">{{ data.item.Group.Name }}</router-link>
				</td>
				<td class="iconCol">
					<span class="icons icon-delete" v-tooltip="getTranslation('I00.00039230', 'Delete')" @click="$emit('click', data.item)"></span>
				</td>
			</tr>
		</template>
	</DataTable>
</template>

<script>
import { idToString, idToSlashedString } from '../../../libraries/common';
export default {
  props: ['data', 'title'],
  data() {
    return {
      perPage: 20,
    };
  },
  methods: {
    goToUser(item) {
      this.$router.push({ name: 'userEdit', params: { id: idToString(item.UserID).replace(':', '_') } });
    },
    userGroupName(item) {
      return (item.Group && item.Group.Name != null ? item.Group.Name : '');
    },
    emailData(item) {
      return (item.AdditionalInfo && item.AdditionalInfo.Email != null ? item.AdditionalInfo.Email : '');
    },
    idToSlashedString: idToSlashedString,
  },
  mounted() {
    this.getTranslation('I00.00012130', 'All');
  },
};
</script>