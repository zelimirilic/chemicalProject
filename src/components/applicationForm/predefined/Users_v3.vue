<template>
	<div class="form-group mb-0">
		<label class="form-control-label">{{ text }}</label>
		<div>
			<Badge class="m-1" v-for="(item, ind) in users" :key="ind">{{ item }}</Badge>
		</div>
	</div>
</template>

<script>
import Users from './Users';
import Badge from '../../common/badge/Badge_v3';

export default {
  extends: Users,
  name: 'Users',
  components: {
    Badge
  }
}
</script>