<template>
	<div class="form-group mb-0">
		<label class="form-control-label" v-if="text != null">
			{{ text }}
			<sup class="icons astera" v-if="propToBool(required)"></sup>
		</label>
		<input type="file" @change="onFileChange" ref="input" v-show="false" />
		<div class="input-group" :class="{ notValid: !isValid }">
			<input class="form-control cursor" :class="{ notValid: !isValid }" :value="value && value.shortFileName" readonly="readonly" @click="$refs.input.click()" withReadOnlyMode v-if="!value" />
			<input class="form-control cursorGrab" :class="{ notValid: !isValid }" :value="value && value.shortFileName" :title="getTranslation('I00.00036820', 'Download')" readonly="readonly" @click="openInNewTab(value.url)" alwayson v-else />
			<div class="input-group-append" withReadOnlyMode>
				<span class="input-group-text icons icon-upload" @click="$refs.input.click()" v-if="!value" />
				<span class="input-group-text icons icon-delete" :title="getTranslation('I00.00047330', 'Delete')" @click.stop="resetFileField" v-else />
			</div>
		</div>
		<div v-if="loadingDocument">
			<SmallLoader />
		</div>
		<p v-if="errorMessage" class="alert alert-danger w-100 mt-2">{{ errorMessage }}</p>
	</div>
</template>

<script>
import UploadFileGroup from './UploadFileGroup';
import SmallLoader from '../../loaders/SmallLoader_v3';

export default {
  extends: UploadFileGroup,
  name: 'UploadFileGroup',
  components: {
    SmallLoader
  }
}
</script>