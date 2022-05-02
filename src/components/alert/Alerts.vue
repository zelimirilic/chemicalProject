<template>
	<div :class="additionalClass">
		<Alert v-for="(alert, index) in $store.state.alerts" :key="index" :type="alert.type" :text="alert.text" :class="{ show: removingItems.indexOf(alert) === -1 }" @close="removeAlert(alert)" />
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
		};
	},
	methods: {
		removeAlert(alert) {
			this.$emit('close');
			this.removingItems.push(alert);
			setTimeout(() => {
				this.removingItems.remove(alert);
				this.$store.state.alerts.remove(alert);
			}, 15);
		},
	},
};
</script>
