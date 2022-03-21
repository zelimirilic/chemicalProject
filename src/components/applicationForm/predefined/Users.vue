<template>
	<div class="form-group mb-0">
		<label class="form-control-label">{{ text }}</label>
		<div>
			<Badge class="m-1" v-for="(item, ind) in users" :key="ind">{{ item }}</Badge>
		</div>
	</div>
</template>

<script>
import { tryParse } from '../../../libraries/common';
import Badge from '../../common/badge/Badge';
export default {
  components: {
    Badge,
  },
  name: 'Users',
  props: ['dataProp', 'text', 'users', 'value'],
  methods: {
    tryParse,
  },
  mounted() {
    this.$emit('input', JSON.stringify(this.users));
  }
}
</script>