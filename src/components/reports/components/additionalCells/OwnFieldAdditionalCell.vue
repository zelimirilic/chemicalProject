<template>
	<div>
		<div v-if="edit">
			<Input :value="value" @input="$emit('input', $event)" v-if="!Array.isArray(departmentValue)" />
			<Select :items="getItems(departmentValue)" :value="value" @input="$emit('input', $event)" v-else />
		</div>
		<template v-else>{{ getValue(value) || '-' }}</template>
	</div>
</template>

<script>

export default {
  props: ['value', 'type', 'edit', 'departmentValue'],
  methods: {
    getItems(item) {
      var items = [null].concat(item);
      if (item.value && !items.any(f => f === item.value))
        items.push(item.value);
      return items;
    }, getValue() {
      if (this.value)
        return this.value;
      else {
        if (!Array.isArray(this.departmentValue)) {
          this.$emit('input', this.departmentValue)
          return this.departmentValue
        }
      }

    }
  }
}
</script>
