<template>
	<div>
		<ApplicationFormCreator></ApplicationFormCreator>
	</div>
</template>

<script>
import ApplicationFormCreator from './applicationForm/ApplicationFormCreator_v3.vue';

export default {
  name: 'Home',
  components: {
    ApplicationFormCreator,
  },
}
</script>