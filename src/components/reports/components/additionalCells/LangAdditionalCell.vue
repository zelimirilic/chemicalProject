<template>
	<span v-if="departmentValue" class="flags" :class="'language' + departmentValue" :title="departmentValue"></span>
	<span v-else>{{ '-' }}</span>
</template>

<script>
export default {
  props: ['departmentValue'],
}
</script>