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

import OwnFieldAdditionalCell from './OwnFieldAdditionalCell';
import Input from '../../../common/form/input/Input_v3'
import Select from '../../../common/form/select/Select_v3'

export default {
  extends: OwnFieldAdditionalCell,
  name: 'OwnFieldAdditionalCell',
  components: {
    Select,
    Input
  }
}
</script>
