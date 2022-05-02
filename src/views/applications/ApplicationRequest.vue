<template>
	<MainLoader v-if="!template" />
	<div :class="{ readOnly: $route.params.id }" v-else>
		<Alerts />
		<!--<nav class="actionMenu navbar HideOnPrint" v-if="!this.$route.params.id">
			<div class="d-flex flex-row flex-wrap ml-auto">
				<div class="actionLnk mr-4" @click="send">
					<span class="icons icon-save plainIcn"></span>
					<u>{{ getTranslation('I00.00045630', 'Send') }}</u>
				</div>
			</div>
		</nav>-->
		<SmallLoader v-if="isSaving" />
		<TabsContainer class="wp-640 mx-auto" :sendBtn="true" @send="send" :childs="template.children" v-model="activeTab" :dat="data" additionalClass="pt-3 mb-0" v-else />
	</div>
</template>

<script>
import axios from '../../axios';
import { deepClone, errorDebug, getAllChildrens, ticker, alert } from '../../libraries/common';
import TabsContainer from '../../components/applicationForm/TabsContainer';
import { createOtherFunctions, createValidationFunctions, defaultData } from '../../libraries/applicationFormData';
import { checkIsValid } from '../../libraries/vue';
import Alerts from '../../components/alert/Alerts.vue';

export default {
	name: 'ApplicationRequest',
	components: {
		TabsContainer,
		Alerts,
	},
	data() {
		return {
			data: null,
			template: null,
			templateId: null,
			activeTab: 0,
			isSaving: false,
		};
	},
	methods: {
		send() {
			if (!checkIsValid(this)) return;

			var saveObj = deepClone(this.data);
			saveObj.template = { id: this.templateId };

			if (!saveObj.sdsNotRequired && saveObj.product.artNo == undefined && saveObj.applicationDocument == null) {
				alert.addWarningMessage(this.getTranslation('I00.00055020', 'Please select product or upload an SDS'));
				return;
			}
			this.isSaving = true;
			axios
				.post('/ApplicationRequest/SaveAppRequest', saveObj)
				.then((response) => {
					if (response.data) {
						this.data = response.data;
						//this.$router.push({ name: 'applicationRequest', params: { id: this.data.id } });
						//this.$store.state.hasMenu = false;

						this.$root.$emit('Navigation');
						this.$root.$emit('AplicationList');
						ticker.addSuccessMessage(this.getTranslation('I00.00020320', 'Saved'));
					}
					this.isSaving = false;
					//this.$store.state.hasMenu = false;
				})
				.catch((err) => {
					this.isSaving = false;
					errorDebug(err);
				});
		},
		getAppRequestNew() {
			axios
				.get('/ApplicationRequest/New')
				.then((response) => {
					this.template = response.data.template.request;
					this.templateId = response.data.id;
					this.data = defaultData();
					createValidationFunctions.call(this, getAllChildrens(this.template));
					createOtherFunctions.call(this, getAllChildrens(this.template));
				})
				.catch(errorDebug);
		},
	},
	mounted: function () {
		alert.clearMessages();
		if (process.env.NODE_ENV === 'development') window['thisApplicationRequest'] = this;

		//this.$store.state.hasMenu = !this.$route.params.id;
		if (!this.$route.params.id) this.getAppRequestNew();

		this.getTranslation('I00.00020320', 'Saved');
		this.getTranslation('I00.00055020', 'Please select product or upload an SDS');
	},
	beforeDestroy() {
		//this.$store.state.hasMenu = false;
	},
};
</script>
