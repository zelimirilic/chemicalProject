<template>
	<SmallLoader v-if="showLoader" />
	<div class="readOnly mb-4" v-else>
		<template v-if="appTemplate != null">
			<template v-for="(element, index) in appTemplate.request.children[0].children" component>
				<component additionalClass="mt-4 mb-0" :is="element.template" :key="'A' + index" :element="element" v-bind="element.props" :childs="element.children" :dat="appRequest" :isEdit="false" />
			</template>
			<template v-for="(tab, tabIndex) in appTemplate.review.children">
				<template v-for="(element, index) in tab.children" component>
					<component additionalClass="mt-4 mb-0" :is="element.template" :key="'B' + tabIndex.toString() + index.toString()" :element="element" v-bind="element.props" :childs="element.children" :dat="appReview" :isEdit="false" />
				</template>
			</template>
		</template>
	</div>
</template>

<script>
import axios from '../../../axios';
import { errorDebug } from '../../../libraries/common';
import TabsContainer from '../../applicationForm/TabsContainer_v3';
import Section from '../../applicationForm/Section_v3';
import SmallLoader from '../../../components/common/loaders/SmallLoader_v3'

export default {
  props: ['productId', 'productIdMdbId', 'orgId', 'orgIdMdbId'],
  components: {
    TabsContainer,
    Section,
    SmallLoader
  },
  data() {
    return {
      showLoader: true,
      appTemplate: null,
      appRequest: null,
      appReview: null
    };
  },
  methods: {
    returnISafeChildren(template) {
      template.children.forEach(tab => {
        tab.children.forEach(section => {
          section.children = section.children.filter(f => f.props.iSafe);
        });
      });

      return template;
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisApplicationDataBox'] = this;

    axios.post('/ApplicationReview/GetLatestAppRequestByProductAndOrg', { productId: { ID: this.productId, ID_mdbID: this.productIdMdbId }, orgId: { ID: this.orgId, ID_mdbID: this.orgIdMdbId } })
      .then(response => {
        if (response.data != null) {
          this.appTemplate = response.data.template;
          this.appReview = response.data.applicationReview;
          this.appRequest = response.data.applicationReview.applicationRequest;
          this.appTemplate.request = this.returnISafeChildren(this.appTemplate.request);
          this.appTemplate.review = this.returnISafeChildren(this.appTemplate.review);
          this.$emit('appdataexist', true);
        } else {
          this.$emit('appdataexist', false);
        }

        this.showLoader = false;
      }).catch(errorDebug);
  }
}
</script>