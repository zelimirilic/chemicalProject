<template>
	<div>
		<div v-if="dat.any()">
			<div class="left">
				<a class="mx-1" v-for="(arr, ind) in dat" :key="ind + arr" :href="arr.url" target="_blank">
					<span class="flagsISO" :title="arr.flagTitle">{{ arr.flagText }}</span>
				</a>
			</div>
		</div>
		<template v-else>-</template>
	</div>
</template>

<script>
export default {
	props: ['dat']
};
</script>
