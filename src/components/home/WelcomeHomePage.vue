<template>
	<MainLoader v-if="!welcomeData" :trans="defaultWelcomeData" />
	<div class="home" v-else>
		<Welcome :data="welcomeData" @edit="editWelcome = true" :noEdit="!appSettings.editWelcomeMessage || !appSettings.permissions.editWelcomeText.full" v-show="!editWelcome" />
		<WelcomeEdit :data="welcomeData" :loader="isSavingWelcomeData" @save="saveWelcomeData" @cancel="editWelcome = false" v-if="editWelcome" />

		<div class="card-deck mt-5">
			<div class="card">
				<div class="card-header mainTtl d-flex justify-content-between align-items-center">
					<h5>{{ getTranslation('I00.00015520', 'Get started') }}</h5>
					<span class="icons icon-video plainIcn"></span>
				</div>
				<div class="card-body">
					<p>{{ getTranslation('I00.00009050', 'To find information') }}</p>
					<p class="mt-3">{{ getTranslation('I00.00009020', 'A search is done in 3 steps') }}:</p>
					<ol class="ml-3 mt-2">
						<li>{{ getTranslation('I00.00007210', 'Select the search parameter') }}</li>
						<li>{{ getTranslation('I00.00007010', 'Insert text or number') }}</li>
						<li>{{ getTranslation('I00.00006740', 'The search results are displayed') }}</li>
					</ol>
				</div>
			</div>
			<div class="card">
				<div class="card-header mainTtl align-items-center">
					<h5>{{ getTranslation('I00.00045980', 'Customer service - System') }}</h5>
				</div>
				<div class="card-body">
					<p class="mb-3">{{ getTranslation('I00.00045990', 'Ask us about') }}</p>
					<p class="mt-1">
						<b>{{ getTranslation('I00.00015450', 'Opening hours') }}</b>
						{{ getTranslation('I00.00046020', 'Monday - Friday') }}
					</p>
					<p class="mt-1">
						<b>{{ getTranslation('I00.00004990', 'Phone') }}</b>
						{{ getTranslation('I00.00022880', '+46') }}
					</p>
					<p class="mt-1">
						<b>{{ getTranslation('I00.00012520', 'Email adress') }}</b>
						<a href="mailto:SupportEmailAddress)">{{ getTranslation('I00.00022860', 'Support') }}</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Welcome from './Welcome';
import WelcomeEdit from './WelcomeEdit';
import axios from '../../axios';
import { errorDebug } from '../../libraries/common';
export default {
  components: {
    Welcome,
    WelcomeEdit,
  },
  data() {
    return {
      welcomeData: null,
      editWelcome: false,
      isSavingWelcomeData: false,
    }
  },
  methods: {
    saveWelcomeData(data) {
      this.isSavingWelcomeData = true;
      axios.post('/WelcomeSetting/Save', { WelcomeCaption: data.title, WelcomeText: data.text })
        .then(() => {
          this.isSavingWelcomeData = false;
          this.welcomeData = {
            title: data.title || this.defaultWelcomeData.title,
            text: data.text || this.defaultWelcomeData.text,
          };
          this.editWelcome = false;
        }).catch(errorDebug);
    }
  },
  computed: {
    defaultWelcomeData() {
      return {
        title: this.getTranslation('I00.00015510', 'Welcome'),
        text: this.getTranslation('I00.00015440', 'If you have any questions about Chemsoft, or need assistance, do not hesitate to contact us.')
      };
    }
  },
  translationsLoaded() {
    axios.get('/WelcomeSetting/Index?_=' + Math.random())
      .then(response => {
        this.welcomeData = {
          title: response.data.welcomeCaption || this.defaultWelcomeData.title,
          text: response.data.welcomeText || this.defaultWelcomeData.text,
        };
      }).catch(errorDebug);
  },
}
</script>