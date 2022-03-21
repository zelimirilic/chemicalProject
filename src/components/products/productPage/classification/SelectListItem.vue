<template>
	<div v-if="data">
		<SelectGroup class="mb-0" :items="data" :disabledItems="disabledItems" :prop="(f) => replaceString(getSystemTranslation(f.text))" @input="selectedItems.push($event)" :text="text" />
		<div class="mxhp-190 mt-3 scrollBar" v-if="selectedItems.length > 0">
			<ListItem :item="item" v-for="(item, ind) in selectedItems" :key="ind" @remove="selectedItems.remove(item)" />
		</div>
	</div>
</template>

<script>
import ListItem from './ListItem';

export default {
  components: {
    ListItem
  },
  props: ['data', 'text', 'selectedItems'],
  methods: {
    replaceString(item) {
      if (item != undefined)
        return item.replaceAll('.?', '[...]');
    }
  },
  computed: {
    disabledItems() {
      return this.selectedItems.map(f => this.data.find(g => g.codeID.code == f.codeID.code && g.codeID.code_mdbID == f.codeID.code_mdbID));
    }
  }
};
</script>