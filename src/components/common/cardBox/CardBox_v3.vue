<template>
	<div class="row" :class="noPaddingClass">
		<div class="col-12" :class="noPaddingClass">
			<h5 class="blueTtl">{{ text }}</h5>
			<slot></slot>
		</div>
	</div>
</template>

<script>
import CardBox from './CardBox';

export default {
  extends: CardBox,
  name: 'CardBox'
}
</script>