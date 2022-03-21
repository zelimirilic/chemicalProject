import Vue from 'vue';
import { isNullOrEmpty, isString, toKeyValue } from "./common";
import { propToBool } from './vue';

export const submitDataThroughForm = (url, data) => {
	var submitData = toKeyValue(data);
	url = Vue.prototype.settings.appUrl + url;
	/*eslint-disable */
	var form = $('<form action="' + url + '" method="post" style="display: none;"></form>').hide();
	submitData.forEach(dat => form.append($('<input>').prop('name', dat.name).val(dat.value)))
	$(document.body).append(form);
	/*eslint-enable */
	form.submit().remove();
}

var imgTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'ico'];
var docTypes = ['pdf', 'xml', 'xls', 'xlsx', 'txt', 'doc', 'ppt', 'docx'];
export const validators = {
	isRequired: ({ fnc: val => val != null && val !== '' && !(Array.isArray(val) && !val.length), message: () => Vue.prototype.getTranslation('I00.00020310', 'Missing required field') }),
	isNotEmpty: ({ fnc: val => !isNullOrEmpty(val), message: () => 'This field cannot be empty!' }),
	minLength: min => ({ fnc: val => isNullOrEmpty(val) || val.length >= min, message: () => 'This field needs to heave minimum ' + min + ' characters!' }),
	maxLength: max => ({ fnc: val => isNullOrEmpty(val) || val.length <= max, message: () => (Vue.prototype.getTranslation('I00.00051610', 'Text field is limited to {0} characters.') || '').format(max) }),
	isNumber: ({ fnc: (num) => isNullOrEmpty(num) || (/^(-{0,1})(\d*)(\.{0,1})(\d*)$/.test(num) && num > -100000000000000000 && num < 100000000000000000), message: () => 'This field must be numerical.' }),
	email: ({
		fnc: (email) => {
			var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return isNullOrEmpty(email) || re.test(String(email).toLowerCase());
		},
		message: () => Vue.prototype.getTranslation('I00.00012710', 'Please provide a valid email adress.')
	}),
	isImage: ({ fnc: img => imgTypes.any(f => img.name.toLowerCase().endsWith('.' + f)), message: () => Vue.prototype.getTranslation('I00.00051660', 'Sorry you can only upload following files') + ' ' + imgTypes.join(', ') }),
	isDocument: ({ fnc: doc => !doc || docTypes.any(f => doc.shortFileName.toLowerCase().endsWith('.' + f)), message: () => Vue.prototype.getTranslation('I00.00051660', 'Sorry you can only upload following files') + ' ' + docTypes.join(', ') })
};

export const checkIsValid = function () {
	this.isValid = true;
	this.errorMessage = null;

	if (propToBool(this.required) && !validators.isRequired.fnc(this.value)) {
		this.isValid = false;
		this.errorMessage = validators.isRequired.message();
		return this.isValid;
	}
	var validations = this.validations || this.defaultValidations;
	if (validations) {
		var find = validations.find(validation => !validation.fnc(this.value));
		if (find) {
			this.isValid = false;
			this.errorMessage = isString(find.message) ? find.message : find.message();
			return this.isValid;
		}
	}

	return this.isValid;
};