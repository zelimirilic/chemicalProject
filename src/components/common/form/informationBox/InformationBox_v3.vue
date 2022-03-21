<template>
	<TextAreaGroup :text="text" :value="value" :placeholder="placeholder" :validations="validations" :resetIcon="resetIcon" :informationBox="true"></TextAreaGroup>
</template>
<script>
import TextAreaGroup from '../textArea/TextAreaGroup_v3.vue';
export default {
  //name: 'InformationBox',
  components: {
    TextAreaGroup
  },
  props: ['text', 'value', 'placeholder', 'validations', 'resetIcon'],
}
</script>
