<template>
	<div class="errorMain d-flex">
		<div class="imgLarge d-flex justify-content-center align-items-center">
			<div class="card">
				<div class="imgSmall d-flex justify-content-center align-items-center">
					<div class="errorTxt">
						<p class="errorCode"></p>
						<h2 class="welcomeTtl mb-3">{{ title }}</h2>
						<p class="infoTxt">{{ text }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from '../../axiosOld-DONOTUSE';
import { errorDebug } from '../../libraries/common';

export default {
  data() {
    return {
      title: '',
      text: ''
    }
  },
  mounted() {
    this.title = this.getTranslation('I00.00049310', 'Page not found');
    this.text = this.getTranslation('I00.00057040', 'Something is wrong here, which means you’ve clicked on a bad link or entered an invalid URL');

    if (this.title === undefined) {
      axios.get('/Login/GetCsErrorPageTranslations')
        .then(response => {
          this.title = response.data.title;
          this.text = response.data.text;
        }).catch(errorDebug);
    }
  }
}
</script>
