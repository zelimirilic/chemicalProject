<template>
	<span v-if="departmentValue" class="flags" :class="'language' + departmentValue" :title="departmentValue"></span>
	<span v-else>{{ '-' }}</span>
</template>

<script>
import langAdditionalCell from './LangAdditionalCell';
export default {
  extends: langAdditionalCell,
  name: 'langAdditionalCell',
}
</script>