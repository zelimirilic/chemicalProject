<template>
	<div class="flipIn">
		<div class="mainTtl noBorder d-flex align-items-center">
			<h5>{{ title }}</h5>
			<div class="actionBtn ml-auto pt-2">
				<span class="icons icon-back" v-tooltip="getTranslation('I00.00039980', 'Back')" @click="$emit('cancel')"></span>
				<span class="icons icon-save" :class="{ disabledTooltip: !isChanged || !isModelValid }" v-tooltip="getTranslation('I00.00004810', 'Save')" @click="isChanged && isModelValid ? $emit('save') : ''"></span>
			</div>
		</div>
		<div class="row px-4 pb-4" :class="additionalClass" v-if="!noRow">
			<SmallLoader v-if="loader" />
			<template v-else>
				<slot></slot>
			</template>
		</div>
		<slot v-else></slot>
	</div>
</template>

<script>
export default {
  props: ['title', 'loader', 'isChanged', 'isModelValid', 'additionalClass', 'noRow']
};
</script>