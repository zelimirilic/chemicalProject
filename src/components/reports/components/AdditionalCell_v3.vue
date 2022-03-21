<template>
	<td :class="{ dangerSymbol: type + 'AdditionalCell' == 'pictogramAdditionalCell' }">
		<component :is="type + 'AdditionalCell'" :departmentValue="departmentValue" :value="value" @input="$emit('input', $event)" :edit="edit" v-if="componentExists(type + 'AdditionalCell')" />
		<template v-else>
			<Input :value="value" @input="$emit('input', $event)" v-if="edit" />
			<template v-else>{{ value || '-' }}</template>
		</template>
	</td>
</template>

<script>
import AdditionalCell from './AdditionalCell';
import langAdditionalCell from './additionalCells/LangAdditionalCell_v3';
import pictogramAdditionalCell from './additionalCells/PictogramAdditionalCell_v3';
import unitAdditionalCell from './additionalCells/UnitAdditionalCell';
import ownFieldAdditionalCell from './additionalCells/OwnFieldAdditionalCell_v3';
import Input from '../../common/form/input/Input_v3'

export default {
  extends: AdditionalCell,
  name: 'AdditionalCell',
  components: {
    langAdditionalCell,
    pictogramAdditionalCell,
    unitAdditionalCell,
    ownFieldAdditionalCell,
    Input
  }
}
</script>