<template>
	<MainLoader v-if="!template" />
	<div :class="{ readOnly: requestId }" v-else>
		<!--<nav class="actionMenu navbar HideOnPrint" v-if="!requestId">
			<div class="d-flex flex-row flex-wrap">
				<div class="actionLnk mr-4" @click="send">
					<span class="icons icon-save"></span>
					<u>{{ getTranslation('I00.00045630', 'Send') }}</u>
				</div>
			</div>
		</nav>-->
		<div class="actionCard wp-640">
			<SmallLoader v-if="isSaving" />
			<template v-else>
				<Tickers class="mb-4" />
				<TabsContainer :sendBtn="true" @send="send" :childs="template.children" v-model="activeTab" :dat="data" additionalClass="pt-3 mb-0" />
			</template>
		</div>
	</div>
</template>

<script>
import axios from '../../axios';
import { deepClone, errorDebug, getAllChildrens, ticker } from '../../libraries/common_v3';
import TabsContainer from '../../components/applicationForm/TabsContainer_v3';
import { createOtherFunctions, createValidationFunctions, defaultData } from '../../libraries/applicationFormData_v3';
import { checkIsValid } from '../../libraries/vue_v3';
import MainLoader from '../../components/common/loaders/MainLoader_v3';
import SmallLoader from '../../components/common/loaders/SmallLoader_v3';
import Tickers from "../../components/ticker/Tickers_v3";
import '../../libraries/array_v3';

export default {
  name: 'ApplicationRequest',
  components: {
    TabsContainer,
    MainLoader,
    SmallLoader,
    Tickers
  },
  data() {
    return {
      data: null,
      template: null,
      templateId: null,
      activeTab: 0,
      isSaving: false,
      requestId: null
    };
  },
  methods: {
    windowsClose() {
      setTimeout(function () {
        window.close();
      }, 1000);
    },
    send() {
      if (!checkIsValid(this)) return;

      var saveObj = deepClone(this.data);
      saveObj.template = { id: this.templateId };

      if (!saveObj.sdsNotRequired && saveObj.product.artNo == undefined && saveObj.applicationDocument == null) {
        ticker.addWarningMessage(this.getTranslation('I00.00055020', 'Please select product or upload an SDS'));
        return;
      }

      this.isSaving = true;
      axios.post('/ApplicationRequest/SaveAppRequest', saveObj)
        .then(response => {
          this.data = response.data;
          this.requestId = this.data.id;
          //this.$router.replace({ name: 'applicationRequest', params: { id: this.data.id } });
          //this.$store.state.hasMenu = false;


          ticker.addSuccessMessage(this.getTranslation('I00.00020320', 'Saved'));

          this.windowsClose();

          this.isSaving = false;
        }).catch(err => {
          this.isSaving = false;
          errorDebug(err);
        });
    }
  },
  mounted() {
    ticker.clearMessages();
    if (process.env.NODE_ENV === 'development') window['thisApplicationRequest'] = this;

    //this.$store.state.hasMenu = !this.requestId;
    if (this.requestId) {
      axios.get(`/ApplicationRequest/Get?id=${this.requestId}`)
        .then(response => {
          this.template = response.data.template.request;
          this.data = response.data.applicationRequestBase;
          createValidationFunctions.call(this, getAllChildrens(this.template));
          createOtherFunctions.call(this, getAllChildrens(this.template));
        }).catch(errorDebug);
    } else {
      axios.get('/ApplicationRequest/New')
        .then(response => {
          this.template = response.data.template.request;
          this.templateId = response.data.id;
          this.data = defaultData();
          createValidationFunctions.call(this, getAllChildrens(this.template));
          createOtherFunctions.call(this, getAllChildrens(this.template));
        }).catch(errorDebug);
    }

    this.getTranslation('I00.00020320', 'Saved');
    this.getTranslation('I00.00055020', 'Please select product or upload an SDS');

  },
  beforeDestroy() {
    //this.$store.state.hasMenu = false;
  },
}
</script>