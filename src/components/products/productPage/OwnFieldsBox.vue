<template>
	<AccordionBox :tooltipTtl="getTranslation('I00.00006260', 'Edit')" @edit="$emit('edit')" :noEdit="!canEdit">
		<SmallLoader v-if="!departmentOwnFields" />
		<DataTable :tableData="departmentOwnFields" noHeader noSearch noFooter v-else>
			<template #head>
				<tr>
					<th>{{ getTranslation('I00.00020000', 'Name') }}</th>
					<th class="w-50">{{ getTranslation('I00.00005460', 'Value') }}</th>
				</tr>
			</template>
			<template #body="{ item }">
				<tr>
					<td class="bold">{{ item.caption }}</td>
					<td class="w-50">{{ getValue(item) || '-' }}</td>
				</tr>
			</template>
		</DataTable>
	</AccordionBox>
</template>

<script>
import { tryParseArray } from '../../../libraries/common';
import AccordionBox from './AccordionBox';


export default {
  components: {
    AccordionBox
  },
  props: ['departmentOwnFields', 'canEdit'],
  methods: {
    getValue(item) {
      if (item.value)
        return item.value;
      else
        if (!tryParseArray(item.departmentValue))
          return item.departmentValue
    },
  }
};
</script>