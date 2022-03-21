<template>
	<div>
		<input type="file" @change="onFileChange" ref="input" />
		<div class="imagePlaceholder my-0">
			<img v-show="!hide_preview" :src="defaultImage" :title="getTranslation('I00.00051650', 'No file chosen')" @click="$refs.input.click()" v-if="!value" />
			<div class="mt-3" v-else>
				<img class="preview" :src="value.data" :title="value.name" />
				<A class="closeBtn" @click="removeImage">&nbsp;</A>
			</div>
		</div>
		<label class="notValid Box mt-2" v-if="errorMessage">{{ errorMessage }}</label>
	</div>
</template>

<script>
import UploadImage from './UploadImage';

export default {
  extends: UploadImage,
  name: 'UploadImage',
}
</script>