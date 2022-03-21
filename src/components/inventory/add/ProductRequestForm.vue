<template>
	<div v-if="!showSuccessScreen">
		<SmallLoader v-if="!productRequestData || processing" />
		<template v-else>
			<div class="container-fluid card-body requestBox">
				<Alerts additionalClass="sticky-top" />
				<div class="p-4 borderB">
					<h4>{{ getTranslation('I00.00056790', 'Personal details') }}</h4>
					<p class="mt-1 mb-0">{{ getTranslation('I00.00056800', 'Please enter your personal details') }}</p>
					<div class="row mt-4">
						<InputGroup class="col-6" :text="getTranslation('I00.00009950', 'Your name')" v-model="productRequestData.userName" required />
						<InputGroup class="col-6" :type="'email'" :validations="[validators.email]" :text="getTranslation('I00.00009940', 'Your e-mail address')" v-model="productRequestData.email" required />
					</div>
					<div class="row mt-3">
						<InputGroup class="col-6" :text="getTranslation('I00.00009960', 'Your phone number')" v-model="productRequestData.phoneNumber" required />
						<InputGroup class="col-6" :text="getTranslation('I00.00008090', 'Requester')" :value="productRequestData.requesterName" disabled="true" />
					</div>
				</div>
				<div class="p-4 borderB">
					<h4>{{ getTranslation('I00.00015700', 'Product details') }}</h4>
					<p class="mt-1 mb-0">{{ getTranslation('I00.00056810', 'Please enter the product details.') }}</p>
					<div class="row mt-4">
						<InputGroup class="col-6" :text="getTranslation('I00.00004560', 'Product name')" v-model="productRequestData.productName" required />
						<InputGroup class="col-6" :text="getTranslation('I00.00010730', 'Suppliers product No')" v-model="productRequestData.suppliersProductNumber" />
					</div>
					<div class="row mt-3">
						<SelectGroup class="col-6 mb-0" :items="productRequestData.inventoryMarkets" prop="countryName" v-model="productRequestData.countryCode" :text="getTranslation('I00.00016760', 'Country')" required />
						<SelectGroup class="col-6 mb-0" :items="productRequestData.systemLanguages" prop="languageName" v-model="productRequestData.languageCode" :text="getTranslation('I00.00007040', 'Language')" required />
					</div>
					<div class="row mt-3">
						<UploadFileGroup class="col-6" v-model="productRequestData.uploadedSds" :text="getTranslation('I00.00037590', 'Attach SDS')" />
					</div>
					<div class="row mt-3" v-if="appSettings.productRequestShowSecretProductOption">
						<CheckBoxGroup class="form-group col-12" :text="getTranslation('I00.00037580', 'Mark this product as secret')" v-model="productRequestData.secretProduct" />
					</div>
				</div>
				<div class="p-4">
					<h4>{{ getTranslation('I00.00056830', 'Supplier details') }}</h4>
					<p class="mt-1 mb-0">{{ getTranslation('I00.00056840', 'Please enter the supplier details.') }}</p>
					<div class="row mt-4">
						<InputGroup class="col-6" :text="getTranslation('I00.00020000', 'Name')" v-model="productRequestData.supplierName" required />
						<InputGroup class="col-6" :text="getTranslation('I00.00007880', 'Address')" v-model="productRequestData.supplierAddress" />
					</div>
					<div class="row mt-3">
						<InputGroup type="number" class="col-2" :text="getTranslation('I00.00009710', 'Zip code')" v-model="productRequestData.supplierPost" />
						<InputGroup class="col-4" :text="getTranslation('I00.00025250', 'City')" v-model="productRequestData.supplierCity" />
						<InputGroup class="col-6" :text="getTranslation('I00.00008200', 'Country')" v-model="productRequestData.supplierCountry" />
					</div>
					<div class="row mt-3">
						<InputGroup class="col-6" :text="getTranslation('I00.00007120', 'Telephone')" v-model="productRequestData.supplierTelephone" />
						<InputGroup class="col-6" :text="getTranslation('I00.00008440', 'Fax')" v-model="productRequestData.supplierFax" />
					</div>
					<div class="row mt-3">
						<InputGroup class="col-6" :text="getTranslation('I00.00008150', 'Web address')" v-model="productRequestData.supplierWebAddress" />
						<InputGroup class="col-6" :type="'email'" :validations="[validators.email]" :text="getTranslation('I00.00008030', 'E-mail')" v-model="productRequestData.supplierEmail" />
					</div>
					<div class="row mt-3">
						<InputGroup class="col-6" :type="'email'" :validations="[validators.email]" :text="getTranslation('I00.00037600', 'Email address for testing')" v-model="emailForTesting" v-if="shouldShowTestEmailField" required />
					</div>
				</div>
			</div>
			<div class="card-footer d-flex">
				<Button @click="$emit('reset')">{{ getTranslation('I00.00005500', 'Reset') }}</Button>
				<Button class="ml-auto" @click="$emit('close')">{{ getTranslation('I00.00017780', 'Cancel') }}</Button>
				<Button class="primary" @click="sendEmail()">{{ getTranslation('I00.00045630', 'Send') }}</Button>
			</div>
		</template>
	</div>
	<div class="card-body externalMain" v-else>
		<div class="checkCircle"></div>
		<h3>{{ getTranslation('I00.00011360', 'Thank you!') }}</h3>
		<h6 class="mb-0">{{ getTranslation('I00.00011370', 'We have now received your request and will inform you as soon as the product is ready to be included in the inventory.') }}</h6>
		<Button class="btn primary mt-4" @click="$emit('close')">{{ getTranslation('I00.00011570', 'Done') }}</Button>
	</div>
</template>

<script>
import axios from '../../../axios';
import { errorDebug, alert } from '../../../libraries/common';
import { validators } from '../../../libraries/forms';
import { checkIsValid } from '../../../libraries/vue';
import UploadFileGroup from '../../../components/common/form/upload/UploadFileGroup';
import Alerts from '../../../components/alert/Alerts.vue';
export default {
  components: {
    UploadFileGroup,
    Alerts
  },
  props: ['country', 'productRequestData'],
  data() {
    return {
      validators,
      emailForTesting: null,
      firstCheck: true,
      shouldShowTestEmailField: false,
      showSuccessScreen: false,
      processing: false
    };
  },
  methods: {
    sendEmail() {
      alert.clearMessages();
      if (!checkIsValid(this)) return;
      this.processing = true;
      axios.post('/ProductRequest/SendEmailNewProductRequest', { model: this.productRequestData, body: '', subject: 'Produkt förfrågad', urlAttachment: this.productRequestData.uploadedSds ? this.productRequestData.uploadedSds.shortFileName : '', emailTo: this.emailForTesting, firstTimeSend: this.firstCheck, isChemsoft: true })
        .then(response => {
          if (this.firstCheck && response.data.msg === "NotProductionServer") {
            alert.addErrorMessage(this.getTranslation('I00.00037610', 'Please enter your email address for test sending'));
            this.shouldShowTestEmailField = true;
            this.firstCheck = false;
          } else if (response.data.msg === "ok") {
            this.showSuccessScreen = true;
          } else if (response.status === false) {
            alert.addErrorMessage(this.getTranslation('I00.00037620', 'Sending mail was unsuccessful'));
          }

          this.processing = false;
        }).catch(errorDebug);
    }
  },
  mounted() {
    this.getTranslation('I00.00011370', 'We have now received your request and will inform you as soon as the product is ready to be included in the inventory.');
    this.getTranslation('I00.00037610', 'Please enter your email address for test sending');
    this.getTranslation('I00.00037620', 'Sending mail was unsuccessful');
  }
}
</script>