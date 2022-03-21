
<template>
	<InformationBoxEdit additionalClass="p-4" :title="getTranslation('I00.00053570', 'Edit home page')" :loader="loader" :isChanged="isChanged" :isModelValid="true" @save="$emit('save', myData)" @cancel="$emit('cancel')">
		<div class="col-12 mt-4">
			<label class="form-control-label">
				{{ getTranslation('I00.00039450', 'Text') }}
			</label>
			<TextEditor v-model="myData.pageHtml" />
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
    };
  },
  computed: {
    isChanged() {
      return this.data.pageHtml !== this.myData.pageHtml;
    },
  },
}
</script>