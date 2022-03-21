<template>
	<div>
		<SearchDropdownGroup :text="getTranslation('I00.00030230', 'Users')" :items="filteredItems" v-model="selectedUser" :validations="[validators.isRequired, validators.email, notAddedValidator]" withBorder>
			<ButtonIconAdd :class="{ disabled: !isModelValid }" @click="add(selectedUser), (selectedUser = null)" withBorder />
		</SearchDropdownGroup>
		<div v-if="value.length" class="pt-2">
			<Badge class="m-1" v-for="(item, ind) in value" @delete="removeAt(ind)" :key="ind">{{ item }}</Badge>
		</div>
	</div>
</template>

<script>
import Users from './UsersApplicationFormProp.vue';
import Badge from '../../common/badge/Badge_v3';
import ButtonIconAdd from '../../common/button/buttonIcon/ButtonIconAdd_v3';
import SearchDropdownGroup from '../../common/form/searchSelect/SearchDropdownGroup_v3';

export default {
  extends: Users,
  name: 'Users',
  components: {
    Badge,
    ButtonIconAdd,
    SearchDropdownGroup
  }
}
</script>