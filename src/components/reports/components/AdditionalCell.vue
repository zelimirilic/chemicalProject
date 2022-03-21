<template>
	<td>
		<component :is="type + 'AdditionalCell'" :departmentValue="departmentValue" :value="value" @input="$emit('input', $event)" :edit="edit" v-if="componentExists(type + 'AdditionalCell')" />
		<template v-else>
			<Input :value="value" @input="$emit('input', $event)" v-if="edit" />
			<template v-else>{{ value || '-' }}</template>
		</template>
	</td>
</template>

<script>
import langAdditionalCell from './additionalCells/LangAdditionalCell';
import pictogramAdditionalCell from './additionalCells/PictogramAdditionalCell';
import unitAdditionalCell from './additionalCells/UnitAdditionalCell';
import ownFieldAdditionalCell from './additionalCells/OwnFieldAdditionalCell';

export default {
  components: {
    langAdditionalCell,
    pictogramAdditionalCell,
    unitAdditionalCell,
    ownFieldAdditionalCell,
  },
  props: ['value', 'type', 'edit', 'departmentValue'],
  methods: {
    componentExists(name) {
      return this.$options.components[name] != null;
    }
  },
}
</script>