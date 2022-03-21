<template>
	<div class="statusWrap">
		<div class="statusLight" :class="value != null ? value.statusClass : ''">
			<div class="statusBgd"></div>
			<p class="icons"></p>
			<p class="statusTxt" v-if="value">{{ getWebTranslationOrValue(value.currentStatus) }}</p>
			<p class="statusTxt" v-else>{{ getWebTranslationOrValue('I00.00055300', 'Undefined') }}</p>
		</div>
	</div>
</template>

<script>
import TrafficLight from './TrafficLight';

export default {
  extends: TrafficLight,
  name: 'TrafficLight'
}
</script>