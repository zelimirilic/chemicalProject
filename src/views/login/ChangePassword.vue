<template>
	<LogInLayout :welcomeMainTxt="welcomeMainTxt" :welcomeSubTxt="welcomeSubTxt">
		<div class="col">
			<div class="textBoxes">
				<div class="introTxt text-center">
					<h3>{{ getTranslation('I00.00056040', 'Setup new password') }}</h3>
					<p class="mb-0">{{ getTranslation('I00.00056050', 'Please enter new password in the fileds below to change your password.') }}</p>
				</div>
				<Alerts />
				<Password @input="password = $event" />
				<div class="mt-4 text-center">
					<button type="button" class="btn primary bigBtn mb-4" :class="{ disabled: !password }" @click="saveChanges">{{ getTranslation('I00.00056070', 'Update password') }}</button>
					<A class="secondaryTxt" @click="goToSignIn()">{{ getTranslation('I00.00056030', 'Go back to sign in') }}</A>
				</div>
			</div>
		</div>
	</LogInLayout>
</template>

<script>
import axios from '../../axiosOld-DONOTUSE';
import LogInLayout from '../../components/layout/LogInLayout';
import { errorDebug, alert } from '../../libraries/common';
import Password from '../../components/common/form/password/Password';
import { logOut } from '../../libraries/vue';
import Alerts from '../../components/alert/Alerts.vue';

export default {
  name: 'ChangePassword',
  components: {
    LogInLayout,
    Password,
    Alerts
  },
  props: ['userId'],
  data() {
    return {
      password: null,
      welcomeMainTxt: '',
      welcomeSubTxt: ''
    };
  },
  methods: {
    saveChanges() {
      alert.clearMessages();
      return axios
        .post('/Password/ChangePassword', { userId: this.userId.id + '_' + this.userId.id_mdbID, password: this.password })
        .then(response => {
          if (response.data.saved) {
            alert.addSuccessMessage(response.data.text);
          } else {
            alert.addErrorMessage(response.data.text);
          }
        })
        .catch(errorDebug);
    },
    goToSignIn() {
      alert.clearMessages();
      this.logOut();
    },
    logOut: logOut,
  },
  beforeMount: function () {
    window.ThisIsChemsoft = true; // global variable that marks system as chemsoft
    axios.post('cs' + localStorage.getItem('lastLogIn')).then(response => {
      Object.keys(response.data).forEach(key => {
        this[key[0].toLowerCase() + key.substring(1)] = response.data[key];
      });
    }).catch(errorDebug);
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisChangePassword'] = this;
    this.getTranslation('I00.00020320', 'Saved');
    this.getTranslation('I00.00024410', 'error');
  }
};
</script>