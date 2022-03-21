<template>
	<MainLoader v-if="!template" />
	<div v-else>
		<nav class="actionMenu navbar HideOnPrint">
			<div class="d-flex flex-row flex-wrap">
				<div class="actionLnk mr-4" @click="showRequest = true">
					<span class="icons icon-show"></span>
					<u>{{ getTranslation('I00.00012110', 'Show Application') }}</u>
				</div>
				<template v-if="!data.applicationRequest.closed">
					<div class="actionLnk mr-4" @click="save">
						<span class="icons icon-save"></span>
						<u>{{ getTranslation('I00.00004810', 'Save') }}</u>
					</div>
					<div class="actionLnk mr-4" :class="{ disabled: activeTabHasStep }" @click="approve">
						<span class="icons icon-lock"></span>
						<u>{{ getTranslation('I00.00009620', 'Approve') }}</u>
					</div>
					<div class="actionLnk mr-4" :class="{ disabled: activeTabHasStep }" @click="reject">
						<span class="icons icon-warning"></span>
						<u>{{ getTranslation('I00.00009570', 'Reject') }}</u>
					</div>
				</template>
			</div>
		</nav>
		<div class="actionCard">
			<SmallLoader v-if="isSaving" />
			<TabsContainer additionalClass="pt-3 mb-0" :childs="template.review.children" v-model="activeTab" :dat="data" :tabIcon="tabIcon" v-else />
		</div>
		<ModalDialog additionalClass="w-80" :title="getTranslation('I00.00016540', 'Preview')" @close="showRequest = false" v-if="showRequest">
			<TabsContainer class="readOnly" :childs="template.request.children" v-model="requestActiveTab" :dat="data.applicationRequest" additionalClass="pt-3 mb-0" />
		</ModalDialog>
		<ModalDialog additional-class="wp-400" :title="modalConfirm.title" @close="modalConfirm.reject" v-if="modalConfirm">
			<TextAreaGroup :text="modalConfirm.message" v-model="modalConfirm.decision" />
			<div class="pt-4 text-right">
				<ButtonOk @click="modalConfirm.resolve" />
				<ButtonCancel @click="modalConfirm.reject" />
			</div>
		</ModalDialog>
	</div>
</template>

<script>
import axios from '../../axios';
import { errorDebug, getAllChildrens } from '../../libraries/common_v3';
import { createOtherFunctions, createValidationFunctions } from '../../libraries/applicationFormData_v3';
import { checkIsValid } from '../../libraries/vue_v3';
import TabsContainer from '../../components/applicationForm/TabsContainer_v3';
import MainLoader from '../../components/common/loaders/MainLoader_v3';
import SmallLoader from '../../components/common/loaders/SmallLoader_v3';
import ModalDialog from '../../components/common/modal/ModalDialog_v3';
import TextAreaGroup from '../../components/common/form/textArea/TextAreaGroup_v3';
import ButtonOk from "../../components/common/button/button/ButtonOk_v3";
import ButtonCancel from "../../components/common/button/button/ButtonCancel_v3";

export default {
  name: 'ApplicationReview',
  props: ['id'],
  components: {
    TabsContainer,
    MainLoader,
    SmallLoader,
    ModalDialog,
    TextAreaGroup,
    ButtonOk,
    ButtonCancel
  },
  data() {
    return {
      data: null,
      template: null,
      templateId: null,
      activeTab: 0,
      showRequest: false,
      requestActiveTab: 0,
      modalConfirm: null,
      isSaving: false,
    };
  },
  methods: {
    save() {
      this.isSaving = true;
      axios.post('/ApplicationReview/Save', this.data)
        .then(response => {
          this.data = response.data;
          this.isSaving = false;
        }).catch(err => {
          this.isSaving = false;
          errorDebug(err);
        });
    },
    confirm(title, message) {
      this.modalConfirm = { title, message };
      return new Promise((resolve, reject) => {
        this.modalConfirm.resolve = () => {
          resolve(this.modalConfirm.decision);
          this.modalConfirm = null;
        };
        this.modalConfirm.reject = () => {
          this.modalConfirm = null;
          reject(false);
        };
      });
    },
    getSaveData(message) {
      return {
        ...this.data,
        dynamic: {
          ...this.data.dynamic,
          decisionReason: message,
        }
      };
    },
    approve() {
      if (!checkIsValid(this)) return;
      if (this.template.review.children.length > 1) {
        this.approveStep();
      } else {
        this.confirm(this.getTranslation('I00.00009620', 'Approve'), this.getTranslation('I00.00002830', 'Notes'))
          .then(message => {
            this.isSaving = true;
            return axios.post('/ApplicationReview/Approve', this.getSaveData(message))
              .then(response => {
                this.data = response.data;
                this.isSaving = false;
              });
          }).catch(err => {
            this.isSaving = false;
            errorDebug(err);
          });
      }
    },
    approveStep() {
      this.confirm(this.getTranslation('I00.00009620', 'Approve'), this.getTranslation('I00.00002830', 'Notes'))
        .then(message => {
          var step = this.template.review.children[this.activeTab];
          var saveObj = {
            data: this.getSaveData(message),
            step: {
              stepID: step.props.id,
              name: step.props.text,
              text: message
            }
          };
          this.isSaving = true;
          return axios.post('/ApplicationReview/ApproveStep', saveObj)
            .then(response => {
              this.data = response.data;
              this.isSaving = false;
            }).catch(err => {
              this.isSaving = false;
              errorDebug(err);
            });
        }).catch(errorDebug);
    },
    reject() {
      if (this.template.review.children.length > 1) {
        this.rejectStep();
      } else {
        this.confirm(this.getTranslation('I00.00018480', 'Do you really want to reject this request?'), this.getTranslation('I00.00018490', 'Please provide reason for rejecting this product:'))
          .then(message => {
            var saveObj = this.getSaveData(message);
            this.isSaving = true;
            return axios.post('/ApplicationReview/Reject', saveObj)
              .then(response => {
                this.data = response.data;
                this.isSaving = false;
              }).catch(err => {
                this.isSaving = false;
                errorDebug(err);
              });
          }).catch(errorDebug);
      }
    },
    rejectStep() {
      this.confirm(this.getTranslation('I00.00018480', 'Do you really want to reject this request?'), this.getTranslation('I00.00018490', 'Please provide reason for rejecting this product:'))
        .then(message => {
          var step = this.template.review.children[this.activeTab];
          var saveObj = {
            data: this.getSaveData(message),
            step: {
              stepID: step.props.id,
              name: step.props.text,
              text: message
            }
          };
          this.isSaving = true;
          return axios.post('/ApplicationReview/RejectStep', saveObj)
            .then((response) => {
              this.data = response.data;
              this.isSaving = false;
            }).catch(err => {
              this.isSaving = false;
              errorDebug(err);
            });
        }).catch(errorDebug);
    },
    tabIcon(tab) {
      var step = (this.data.applicationReviewSteps || []).find(f => f.stepID === tab.props.id);
      var translator = {
        'fulfilled': 'icon-check',
        'rejected': 'icon-warning'
      };
      return (step && translator[step.closedReason.toLowerCase()]) || (this.data.applicationRequest.closed && translator[this.data.applicationRequest.closedReason.toLowerCase()]);
    },
  },
  computed: {
    activeTabHasStep() {
      var tab = this.template.review.children[this.activeTab];
      return (this.data.applicationReviewSteps || []).any(f => f.stepID === tab.props.id);
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisApplicationReview'] = this;

    this.$store.state.hasMenu = true;
    axios.get(`/ApplicationReview/Get?requestId=${this.id}`)
      .then(response => {
        this.template = response.data.template;
        this.data = response.data.applicationReview;
        createValidationFunctions.call(this, getAllChildrens(this.template.review));
        createOtherFunctions.call(this, getAllChildrens(this.template.review));
      }).catch(errorDebug);

    this.getTranslation('I00.00002830', 'Notes');
    this.getTranslation('I00.00018480', 'Do you really want to reject this request?');
    this.getTranslation('I00.00018490', 'Please provide reason for rejecting this product:');
  },
  beforeDestroy() {
    this.$store.state.hasMenu = false;
  },
}
</script>