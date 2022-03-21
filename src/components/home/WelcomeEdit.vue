
<template>
	<InformationBoxEdit additionalClass="p-4" :title="getTranslation('I00.00044200', 'Enter welcome text')" :loader="loader" :isChanged="isChanged" :isModelValid="isModelValid" @save="$emit('save', myData)" @cancel="$emit('cancel')">
		<InputGroup class="col-12" :text="getTranslation('I00.00044190', 'Title')" v-model="myData.title" />
		<div class="col-12 mt-4">
			<label class="form-control-label">
				{{ getTranslation('I00.00039450', 'Text') }}
			</label>
			<TextEditor v-model="myData.text" />
		</div>
	</InformationBoxEdit>
</template>

<script>
import InformationBoxEdit from '../products/productPage/InformationBoxEdit';
import TextEditor from '../common/form/textEditor/TextEditor';

export default {
  components: {
    InformationBoxEdit,
    TextEditor,
  },
  props: ['data', 'loader'],
  data(self) {
    return {
      myData: { ...self.data },
      $modelValidators: [],
    };
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    isChanged() {
      return this.data.title !== this.myData.title || this.data.text !== this.myData.text;
    },
  },
}
</script>