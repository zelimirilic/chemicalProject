<template>
	<div>
		<table class="table table-hover dataTable valignM">
			<thead>
				<tr>
					<th class="w-30">{{ getTranslation('I00.00005730', 'OneOfMeasures') }}</th>
					<th>{{ getTranslation('I00.00019840', 'ResponsiblePerson') }}</th>
					<th class="w-30">{{ getTranslation('I00.00008030', 'E-mail') }}</th>
					<th class="wp-140">{{ getTranslation('I00.00008620', 'Date') }}</th>
					<th class="iconCol SkipForSorting SkipColumn">&nbsp;</th>
				</tr>
			</thead>
			<tbody withReadOnlyMode>
				<tr v-for="(measure, ind) in getMeasures" :key="ind">
					<td class="w-30">{{ measure.task }}</td>
					<td>{{ measure.responsiblePerson }}</td>
					<td class="w-30">{{ measure.email }}</td>
					<td class="wp-140 noWrap">{{ parseDate(measure.date) }}</td>
					<td class="iconCol"><span class="icons icon-delete red" @click="$emit('remove', measure)"></span></td>
				</tr>
				<tr class="noHover">
					<td class="w-30"><InputGroup v-model="responsiblePerson.task" /></td>
					<td>
						<div class="specialType input-group">
							<input class="form-control" type="text" v-model="responsiblePerson.responsiblePerson" />
							<div class="input-group-append" @click="getEmployeesAndEmail()"><span class="input-group-text icons icon-userfull"></span></div>
						</div>
					</td>
					<td class="w-30"><InputGroup v-model="responsiblePerson.email" :validations="[validators.email]" /></td>
					<td class="wp-140"><DateGroup v-model="responsiblePerson.date" /></td>
					<td><span class="icons icon-plus" v-tooltip="getTranslation('I00.00013100', 'Add')" @click="addResponsiblePerson"></span></td>
				</tr>
			</tbody>
		</table>
		<template>
			<ModalDialog v-if="showModal" :title="getTranslation('I00.00019840', 'Responsible person')" additional-class="w-50" @close="cancel">
				<UsersModalDialogList :data="userList" v-if="userList" @add="addResponsiblePersonData" />
				<SmallLoader v-else />
			</ModalDialog>
		</template>
	</div>
</template>

<script>
import axios from '../../../../axios';
import { parseDate } from '../../../../libraries/date';
import { validators } from '../../../../libraries/forms';
import { errorDebug, ticker } from '../../../../libraries/common';
import UsersModalDialogList from '../components/UsersModalDialogList';

export default {
  components: {
    UsersModalDialogList
  },
  data() {
    return {
      responsiblePerson: {},
      console,
      validators,
      showModal: false,
      userList: null
    }
  },
  props: ['measures', 'measureType'],
  methods: {
    addResponsiblePerson() {
      this.responsiblePerson.measureType = this.measureType;
      this.$emit('add', this.responsiblePerson);
      this.responsiblePerson = {};
    },
    parseDate,
    getEmployeesAndEmail() {
      this.showModal = true;
      return axios
        .cancelAll()
        .postWithCancelToken('/DefaultPopUp/DefaultPopUpJson', { type: 'EmpWithEmail' })
        .then(response => {
          this.userList = response.data;
        })
        .catch(errorDebug);
    },
    cancel() {
      this.showModal = false;
    },
    addResponsiblePersonData(event) {
      this.responsiblePerson.responsiblePerson = event.mainText;
      this.responsiblePerson.email = event.emailText;
      this.showModal = false;
    }
  },
  computed: {
    getMeasures() {
      var measureType = this.measureType;
      return this.measures.filter(f => f.measureType === measureType);
    }
  },
  beforeDestroy() {
    axios.cancelAll();
    ticker.clearMessages();
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisOneOfMeasures'] = this;
  }
};
</script>