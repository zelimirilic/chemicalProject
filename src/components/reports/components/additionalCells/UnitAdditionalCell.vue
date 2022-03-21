<template>
	<div>
		<p v-for="(it, ind) in departmentValue" :key="ind">
			<span class="consume">{{ parseFloat(it.value) }}</span>
			<span class="noWrap">{{ it.unit }}</span>
		</p>
	</div>
</template>

<script>

export default {
  props: ['departmentValue'],
  methods: {
    parseFloat(num) {
      return Math.parseFloat(num);
    },
  },
}
</script>