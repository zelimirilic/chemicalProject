<template>
	<section v-if="data">
		<div class="header d-flex align-items-center">
			<h3>
				<span :class="`icons ${headerIcon || 'icon-atom'} mr-2`"></span>
				<span>
					<b>{{ title }}</b>
				</span>
			</h3>
			<h3 v-if="emergencyNumber" class="ml-auto">
				<span class="icons icon-phone mr-2"></span>
				<span>
					<b>{{ emergencyNumber }}</b>
				</span>
			</h3>
		</div>
		<slot></slot>
		<div class="d-flex mt-2">
			{{ formatString(data) }}
		</div>
	</section>
</template>

<script>
import { formatString } from '../../../libraries/common';
export default {
  props: ['data', 'title', 'headerIcon', 'emergencyNumber'],
  methods: {
    formatString: formatString
  }
}
</script>