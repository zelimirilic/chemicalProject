<template>
	<div>
		<div class="notValid alert alert-danger" v-if="confirmedPassword !== null && notSamePasswords">
			{{ getTranslation('I00.00051780', "Passwords don't match.") }}
		</div>
		<div class="password form-group mt-4 mb-0">
			<label class="form-control-label">{{ getTranslation('I00.00014250', 'NewPassword') }}</label>
			<v-popover popoverClass="login" offset="7" placement="right">
				<div class="specialType input-group tooltip-target">
					<input :type="passwordVisible ? 'text' : 'password'" class="form-control" :class="{ valid: errors.length }" :placeholder="getTranslation('I00.00055980', 'Enter password')" @keyup="emitPassword" v-model="password" />
					<div class="input-group-append noColor pl-0 pr-3" @click="passwordVisible = !passwordVisible"><span class="input-group-text p-0 icons mediumIcn" :class="passwordVisible ? 'icon-noshow' : 'icon-show'"></span></div>
				</div>
				<template slot="popover">
					<div class="tooltip-content">
						<p class="mb-2">
							<b>{{ getTranslation('I00.00056290', 'Password must contain') }}:</b>
						</p>
						<template v-for="rule in rules">
							<p class="d-flex align-items-center mt-1 mb-0" :class="{ validTxt: !errors.includes(rule.message) }" :key="rule.message">
								<span class="icons icon-check circle mr-2"></span>
								<span>{{ rule.message }}</span>
							</p>
						</template>
					</div>
				</template>
			</v-popover>
		</div>
		<InputGroup :type="passwordVisible ? 'text' : 'password'" class="mt-4" :class="{ disabled: errors.length }" :text="getTranslation('I00.00014260', 'ConfirmNewPassword')" v-model="confirmedPassword" @keyup="emitPassword" />
	</div>
</template>

<script>

export default {
  data() {
    return {
      passwordVisible: false,
      password: '',
      confirmedPassword: null
    };
  },
  methods: {
    emitPassword() {
      if (this.errors.length)
        this.confirmedPassword = '';

      this.$emit('input', !(this.errors.length || this.notSamePasswords) ? this.password : null);
    }
  },
  computed: {
    rules() {
      var minLen = this.appSettings.permissions.settings.full ? 8 : 12;
      return [
        { message: this.getTranslation('I00.00051800', 'One uppercase letter required.'), fnc: (f) => /.*[A-Z]{1,}/.test(f) },
        { message: this.getTranslation('I00.00051790', 'One lowercase letter required.'), fnc: (f) => /.*[a-z]{1,}/.test(f) },
        { message: minLen + ' ' + this.getTranslation('I00.00051810', 'characters minimum.'), fnc: (f) => f.length >= minLen },
        { message: this.getTranslation('I00.00051820', 'One number required.'), fnc: (f) => /^\D*(?:\d\D*){1,}$/.test(f) },
        { message: this.getTranslation('I00.00051830', 'One special characters required.'), fnc: (f) => /[-!@#$%^&*()_+|~=`{}[\]:";'<>?,./\\\\]/.test(f) }
      ]
    },
    notSamePasswords() {
      return this.password !== this.confirmedPassword;
    },
    errors() {
      return this.rules.filter(f => !f.fnc(this.password))
        .map(f => f.message);
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisSetPasword'] = this;
  }
};
</script>