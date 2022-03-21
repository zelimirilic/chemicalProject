
<template>
	<div>
		<div class="card-body">
			<Tree :data="data" :state="state" @click="selectedItem = $event" v-if="data" />
		</div>
		<div class="pt-4 text-right">
			<ButtonOk @click="$emit('input', selectedItem)" />
			<ButtonCancel @click="$emit('cancel')" />
		</div>
	</div>
</template>

<script>
import Tree from './Tree_v3';
import { defineState } from '../../libraries/tree_v3';
import ButtonOk from "../common/button/button/ButtonOk_v3";
import ButtonCancel from "../common/button/button/ButtonCancel_v3";
export default {
  components: {
    Tree,
    ButtonOk,
    ButtonCancel
  },
  props: ['data', 'value'],
  data(self) {
    var state = {};
    if (self.value)
      self.value.getParents().forEach(f => defineState(state, f.item, 'opened', true));

    defineState(state, (self.value || self.data).item, 'opened', open);
    defineState(state, (self.value || self.data).item, 'clicked', open);
    return {
      selectedItem: (self.value || self.data),
      state,
    }
  },
}
</script>