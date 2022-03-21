<template>
	<LogInLayout :welcomeMainTxt="welcomeMainTxt" :welcomeSubTxt="welcomeSubTxt" v-if="welcomeSubTxt !== ''">
		<div class="textBoxes col" v-if="showBar">
			<div class="progressBar">
				<div class="progressBarFill" :style="{ width: barValue + '%' }">&nbsp;</div>
			</div>
		</div>

		<template v-else>
			<div class="col" v-if="!isLoginHidden">
				<div class="textBoxes">
					<div class="introTxt text-center">
						<h3>{{ getStartedText }}!</h3>
						<p class="infoTxt">{{ signUpText }}</p>
					</div>
					<Alerts />
					<div class="username form-group mt-4 mb-0">
						<label class="form-control-label">{{ userText }}</label>
						<input type="text" class="form-control" :class="{ notValid: loginFailed }" name="user" :placeholder="userEnterText" v-model="username" @keyup.enter="Submit" @keyup="this.CapsLockWarningText" @focus="ResetField" />
					</div>
					<div class="password form-group mt-4 mb-0">
						<label class="form-control-label">{{ passText }}</label>
						<input type="password" class="form-control" :class="{ notValid: loginFailed }" name="pswd" :placeholder="passEnterText" v-model="password" @keyup.enter="Submit" @keyup="this.CapsLockWarningText" @focus="ResetField" />
					</div>
					<div class="mt-4 text-center">
						<button type="button" @click="Submit" class="btn primary bigBtn mb-4">{{ signInText }}</button>
						<A class="secondaryTxt" @click="ShowLostPasswordForm">{{ forgotPassText }}</A>
					</div>
				</div>
			</div>

			<div class="col" v-else>
				<div class="textBoxes">
					<div class="introTxt text-center">
						<h3>{{ resetIntroText }}</h3>
						<p class="infoTxt">{{ resetSubText }}</p>
					</div>
					<Alerts />
					<!-- <div class="alert alert-success" :class="{ 'mt-2': capslockOn }">We sent you an email with instructions to reset your password. {{ capsLockText }}</div> -->
					<div class="username form-group mt-4 mb-0">
						<label class="form-control-label">{{ userText }}</label>
						<input type="text" class="form-control textBoxReset" name="username" @keyup.enter="SubmitResetPassword" @keyup="this.CapsLockWarningText" v-model="user" :placeholder="userEnterText" />
					</div>
					<div class="email form-group mt-4 mb-0">
						<label class="form-control-label">{{ emailText }}</label>
						<input type="email" class="form-control textBoxReset" name="email" @keyup.enter="SubmitResetPassword" @keyup="this.CapsLockWarningText" v-model="email" :placeholder="emailEnterText" />
					</div>
					<div class="mt-4 text-center">
						<button type="button" class="btn primary bigBtn mb-4" @click="SubmitResetPassword">{{ sendText }}</button>
						<A class="secondaryTxt" @click="ShowLoginForm">{{ goBackText }}</A>
					</div>
				</div>
			</div>
		</template>
	</LogInLayout>
	<MainLoader v-else />
</template>

<script>
import LogInLayout from '../../components/layout/LogInLayout';
import axios from '../../axiosOld-DONOTUSE';
import { errorDebug, alert, startPhraseObject } from '../../libraries/common';
import Alerts from '../../components/alert/Alerts.vue';
export default {
  name: 'LogIn',
  components: {
    LogInLayout,
    Alerts
  },
  data() {
    return {
      pageTitle: '',
      customerId: '',
      showLostPasswordLink: true,
      forgotPassText: '',
      originalUrl: '',
      signInText: '',
      userText: '',
      passText: '',
      sendText: '',
      goBackText: '',
      emailText: '',
      capsLockText: '',
      loginFolder: '',
      loginFailed: false,
      loginFailedInfo: '',
      resetPasswordInfo: '',
      isLoginHidden: false,
      showBar: false,
      showResetInfo: false,
      user: '',
      email: '',
      username: '',
      password: '',
      barValue: 0,
      capslockOn: false,
      getStartedText: '',
      signUpText: '',
      userEnterText: '',
      passEnterText: '',
      resetIntroText: '',
      resetSubText: '',
      emailEnterText: '',
      welcomeMainTxt: '',
      welcomeSubTxt: '',
      userAndEmailRequiredText: ''
    };
  },
  methods: {
    getQueryVariable: function (variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0].toLowerCase() == variable.toLowerCase()) {
          return pair[1];
        }
      }
    },
    Submit: function () {
      var url = this.$route.path.substring(1);
      axios
        .post('/Login/Verify', {
          login: this.username,
          password: this.password,
          original_url: this.originalUrl
        })
        .then(response => {
          if (!response.data.success) {
            this.loginFailedInfo = response.data.responseText;
            this.loginFailed = true;
            this.showBar = false;
            alert.addErrorMessage(this.loginFailedInfo);
          } else {
            this.$store.getters.state.phrases = startPhraseObject();
            localStorage.setItem('lastLogIn', url);
            this.$store.getters.state.logInLink = url;
            this.$router.push('/');
          }
        }).catch(errorDebug);
    },
    SubmitResetPassword: function () {
      alert.clearMessages();
      if (this.user === '' || this.email === '') {
        alert.addErrorMessage(this.userAndEmailRequiredText);
        return;
      }
      axios
        .post('/LostPassword/SendRequest', {
          customerId: this.customerId,
          loginFolder: this.$route.path.substring(1),
          path: this.originalUrl,
          username: this.user,
          email: this.email,
          version: 'cs',
          isChemsoft: true
        })
        .then(response => {
          this.user = '';
          this.email = '';
          this.resetPasswordInfo = response.data;
          var self = this;
          this.$nextTick(function () {
            self.showResetInfo = true;
            if (this.resetPasswordInfo.success)
              alert.addSuccessMessage(this.resetPasswordInfo.message);
            else
              alert.addErrorMessage(this.resetPasswordInfo.message);
          });
        })
        .catch(errorDebug);
    },
    ShowLostPasswordForm: function () {
      this.isLoginHidden = true;
      this.resetPasswordInfo = '';
      this.showResetInfo = false;
      this.user = '';
      this.email = '';
    },
    ShowLoginForm: function () {
      this.isLoginHidden = false;
      this.loginFailed = false;
      alert.clearMessages();
    },
    ResetField: function () {
      this.loginFailed = false;
    },
    AnimateProgressBarLogin: function () {
      var self = this;
      self.barValue = 0;

      var loopFnc = function loopFnc() {
        setTimeout(function () {
          self.barValue++;
          if (self.barValue < 100) loopFnc();
        }, 20);
      };

      loopFnc();
    },
    AnimateAutoLoginScreen: function () {
      this.showBar = true;
      this.AnimateProgressBarLogin();
    },
    CapsLockWarningText: function () {
      if (event.getModifierState && event.getModifierState("CapsLock")) {
        this.capslockOn = true;
        alert.addErrorMessage(this.capsLockText);
      }
      else {
        this.capslockOn = false;
        alert.removeMessage(this.capsLockText);
      }
    }
  },
  beforeMount: function () {
    window.ThisIsChemsoft = true; // global variable that marks system as chemsoft

    if (this.$route.query.change_password_and_return_to_login) {
      this.username = this.$route.query.name;
      this.password = this.$route.query.password;
      this.Submit();
      return;
    }

    axios.post('cs' + this.$route.path.substring(1)).then(response => {
      Object.keys(response.data).forEach(key => {
        this[key[0].toLowerCase() + key.substring(1)] = response.data[key];
      });
      this.showBar = false;
    }).then(() => {
      var name = this.$route.query.name;
      var password = this.$route.query.password;

      if (name) {
        this.username = name;
        this.password = password;
        this.Submit();
        this.AnimateAutoLoginScreen();
      }
    }).catch(errorDebug);
  }
};
</script>