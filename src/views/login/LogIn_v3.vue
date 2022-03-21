<template>
	<div class="loginMain">
		<div class="fullscreen">&nbsp;</div>
		<div class="backColor cf">
			<div class="imageWrapper" style="display: block">
				<img src="https://localhost/iChemistry/~master/new_style_images/iChemistry/login.png" alt="" style="left: 45px" />
			</div>
			<div class="progressBarLogin">
				<img src="https://localhost/iChemistry/~master/new_style_images/LoginBackgroundDeviderHorizontal.png" alt="horizontal devider" />
				<div class="progressBarFillLogin">&nbsp;</div>
			</div>
			<div class="textBoxes" style="display: block">
				<div class="innerText">
					<p>
						<span class="username">&nbsp;</span>
						<span class="textBox">
							<input type="text" name="user" :placeholder="userText" v-model="username" @keyup.enter="Submit" @keyup="this.CapsLockWarningText" @focus="ResetField" />
						</span>
					</p>
					<p>
						<span class="password">&nbsp;</span>
						<span class="textBox">
							<input type="password" name="pswd" :placeholder="passText" v-model="password" @keyup.enter="Submit" @keyup="this.CapsLockWarningText" @focus="ResetField" />
						</span>
					</p>
					<p class="rightAlign">
						<A @click="Submit" class="noLinkBorder">{{ signInText }}</A>
					</p>
				</div>
			</div>
			<div class="forgotPassword" style="display: block">
				<a class="noLinkBorder" href="https://localhost/iChemistry/LostPassword/RequestReset?customerId=603&amp;loginFolder=main%2Fintersolia%2Fnextgen%2Fcontrol_with_options">Lost password</a>
			</div>
		</div>
		<div class="LoginCustomerName">
			<span id="LoginCustomerNameText" title="MultiDB_IntersoliaNew">Intersolia - NOT DEMO ENVIROMENT</span>
		</div>
	</div>
</template>

<script>
// import LogInLayout from '../../components/layout/LogInLayout_v3';
import axios from '../../axiosOld-DONOTUSE';
import logoImg from '../../assets/chemsoftLogo.svg';
import { errorDebug, ticker } from '../../libraries/common';
export default {
  name: 'LogIn',
  components: {
    // LogInLayout
  },
  data() {
    return {
      pageTitle: '',
      customerId: '',
      showLostPasswordLink: true,
      lostPwdText: '',
      originalUrl: '',
      signInText: '',
      userText: '',
      passText: '',
      resetPasswordText: '',
      backButtonText: '',
      loginText: '',
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
      logoImg: logoImg,
      barValue: 0,
      capslockOn: false
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
      ticker.clearMessages();
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
          } else {
            localStorage.setItem('lastLogIn', url);
            this.$store.getters.state.logInLink = url;
            this.$router.push('/');
          }
        })
        .catch(errorDebug);
    },
    SubmitResetPassword: function () {
      axios
        .post('/LostPassword/SendRequest', {
          customerId: this.customerId,
          loginFolder: this.loginFolder,
          path: this.originalUrl,
          username: this.user,
          email: this.email,
          version: 'cs'
        })
        .then(response => {
          this.user = '';
          this.email = '';
          this.resetPasswordInfo = response;
          var self = this;
          this.$nextTick(function () {
            self.showResetInfo = true;
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
      if (event.getModifierState && event.getModifierState("CapsLock"))
        this.capslockOn = true;
      else
        this.capslockOn = false;
    }
  },
  beforeMount: function () {
    var name = this.$route.query.name;
    var password = this.$route.query.password;

    if (name) {
      this.username = name;
      this.password = password;
      this.Submit();
    }
    this.AnimateAutoLoginScreen();
  },
  mounted: function () {
    axios.post('cs' + this.$route.path.substring(1)).then(response => {
      Object.keys(response.data).forEach(key => {
        this[key[0].toLowerCase() + key.substring(1)] = response.data[key];
      });
      this.showBar = false;
    });
  },
  beforeDestroy() {
    ticker.clearMessages();
  }
};
</script>