<template>
	<HalfBox class="card-deck">
		<div class="card pageWrapper">
			<div class="mainTtl lightGrayBg">
				<h6 class="cards">{{ text }}</h6>
			</div>
			<slot></slot>
		</div>
	</HalfBox>
</template>

<script>
import { propToBool } from '../../../libraries/vue';

export default {
  props: ['text'],
  methods: {
    propToBool
  }
};
</script>