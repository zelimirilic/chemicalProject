<template>
	<TextAreaGroup :text="text" :value="value" :placeholder="placeholder" :validations="validations" :resetIcon="resetIcon" :informationBox="true"></TextAreaGroup>
</template>
<script>

export default {
  name: 'InformationBox',
  props: ['text', 'value', 'placeholder', 'validations', 'resetIcon'],
}
</script>
