<template>
	<a href="#:" @click.prevent="$emit('click', $event)">
		<slot></slot>
	</a>
</template>