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
import Badge from '../../common/badge/Badge';
import { errorDebug, isNullOrEmpty } from '../../../libraries/common';
import axios from '../../../axios';
import ButtonIconAdd from '../../common/button/buttonIcon/ButtonIconAdd.vue';
import { validators } from '../../../libraries/forms';
import { checkIsValid } from '../../../libraries/vue';
export default {
  components: {
    Badge,
    ButtonIconAdd,
  },
  props: ['value'],
  data() {
    return {
      items: null,
      selectedUser: null,
      validators,
      $modelValidators: [],
    };
  },
  methods: {
    add(event) {
      if (!checkIsValid(this)) return;
      this.$emit('input', [...this.value, event]);
    },
    removeAt(index) {
      this.$emit('input', this.value.filter((_, ind) => ind !== index));
    },
    isNullOrEmpty,
  },
  computed: {
    filteredItems() {
      return (this.items || []).filter(f => !this.value.includes(f));
    },
    notAddedValidator() {
      return {
        fnc: val => !this.value.includes(val),
        message: () => this.getTranslation('I00.00054400', 'This email address is already added.')
      };
    },
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
  },
  mounted() {
    axios
      .post('/DefaultPopUp/DefaultPopUpJson', { type: "AllUsers" })
      .then(response => this.items = response.data.groupBy(f => f.emailText).map(f => f.key).filter(f => f).sortBy(f => f))
      .catch(errorDebug);

    this.notAddedValidator.message(); // this will pull the translation
  }
}
</script>