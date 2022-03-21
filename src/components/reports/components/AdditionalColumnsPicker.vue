<template>
	<div>
		<div class="specialType input-group mb-3" v-for="(item, ind) in items" :key="ind">
			<Select class="additionalOpt" :value="item" @input="modifyItem($event, ind)" :items="itemsForSelect(item)" :prop="(f) => getTranslation(f.columnPhrase)" />
			<div class="input-group-append"><span class="input-group-text icons icon-delete" v-tooltip="getTranslation('I00.00039230', 'Delete')" @click="removeItem(item)"></span></div>
		</div>
		<Select class="additionalOpt" :class="{ disabled: items.length > 4 }" :value="emptyItem" @input="addItem" :items="itemsForSelect(emptyItem)" :prop="(f) => getTranslation(f.columnPhrase)" />
		<div class="pt-4 text-right">
			<ButtonOk @click="$emit('input', items)" />
			<ButtonCancel @click="$emit('cancel')" />
		</div>
	</div>
</template>

<script>

export default {
  props: ['value'],
  data() {
    return {
      selectedItem: null,
      emptyItem: { columnPhrase: '-' },
      items: [],
    };
  },
  methods: {
    getOption(item) {
      return (this.$store.getters.state.reportsAdditionalColumns || []).find(f => f.id === item.id);
    },
    addItem(item) {
      this.items.push(item);
    },
    removeItem(item) {
      this.items.remove(item);
    },
    modifyItem(item, ind) {
      this.$set(this.items, ind, item);
    },
    itemsForSelect(item) {
      return [item]
        .pushMany(this.optionItems)
        .sortBy(f => this.getTranslation(f.columnPhraseId));
    }
  },
  computed: {
    optionItems() {
      var ids = this.items.map(f => f.id);
      return (this.$store.getters.state.reportsAdditionalColumns || [])
        .filter(f => ids.indexOf(f.id) === -1);
    },
  },
  mounted() {
    this.items = this.value.map(f => this.getOption(f));
  },
}
</script>