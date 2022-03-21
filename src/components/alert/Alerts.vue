<template>
	<div :class="additionalClass">
		<Alert v-for="(alert, index) in $store.state.alerts" :key="index" :type="alert.type" :text="alert.text" :class="{ show: removingItems.indexOf(alert) === -1 }" />
	</div>
</template>

<script>
import Alert from './Alert.vue';
export default {
  components: {
    Alert,
  },
  props: ['text', 'type', 'additionalClass'],
  data() {
    return {
      removingItems: [],
    }
  }
}
</script>