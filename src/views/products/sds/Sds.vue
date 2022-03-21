<template>
	<div>
		<SmallLoader v-if="!showMessage" />
		<div class="p-4" v-if="showMessage">
			<h5>{{ messageTitle }}</h5>
			<p class="py-4">{{ message }}</p>
			<div class="lightGrayBg borderTRBL rounded px-3 py-2">
				<ul class="pl-3">
					<li v-for="link in pdfLinks" :key="link.url" class="py-2">
						<A @click="showPDFinIframe(link.url)">{{ link.language }}</A>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
 
<script>
import axios from '../../../axiosOld-DONOTUSE';
import { errorDebug } from '../../../libraries/common';

export default {
  name: 'Sds',
  props: ['id'],
  data() {
    return {
      showMessage: false,
      pdfLinks: null,
      message: '',
      messageTitle: ''
    };
  },
  methods: {
    getPDFinfo() {
      var url = this.settings.appUrl + `MainDocument/ShowDocument?productId=${this.id.id}&productMdbId=${this.id.id_mdbID}&clvid=${this.id.clvid || 0}`;
      return axios
        .post(url)
        .then(response => {
          if (response.data.status == 'no') {
            this.showMessage = true;
            this.pdfLinks = response.data.content;
            this.message = response.data.message;
            this.messageTitle = response.data.messageTitle;
          } else if (response.data.status == 'error') {
            this.showMessage = true;
            this.message = response.data.message;
          } else {
            this.showPDFinIframe(response.data.content);
            this.$router.go(-1);
          }
        })
        .catch(errorDebug);
    },
    showPDFinIframe(url) {
      var link = url.startsWith('http') ? url : this.settings.appUrl + url.replace('../', '');
      window.open(link, '_blank');
    }
  },
  mounted() {
    this.getPDFinfo();
  }
};
</script>