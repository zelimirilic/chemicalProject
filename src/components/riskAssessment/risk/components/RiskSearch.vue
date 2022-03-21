<template>
	<div class="specialType input-group">
		<div class="input-group-prepend noColor" @click="submitSearch">
			<span class="input-group-text icons icon-search" :class="{ disabled: searchButtonDisabled }"></span>
		</div>
		<Input class="form-control" v-model="searchWord" @keydown.enter="submitSearch" focus ref="input" />
	</div>
</template>

<script>
import { isNullOrEmpty } from '../../../../libraries/common';

export default {
  props: ['numberOfItems'],
  data() {
    return {
      searchWord: '',
      lastSearchObj: {},
    };
  },
  methods: {
    submitSearch() {
      if (!this.searchButtonDisabled) {
        this.lastSearchObj = this.searchObject;
        this.$emit('search', this.searchObject);
      }
    },
    resetSearch() {
      this.searchWord = '';
      this.lastSearchObj = {};
    },
    focus() {
      this.$nextTick(() => this.$refs.input.$el.focus())
    },
  },
  computed: {
    searchButtonDisabled() {
      if (this.searchWord.length === 0 || isNullOrEmpty(this.searchWord))
        return true;

      return false;
    },
    searchObject() {
      var obj = {
        search_word: this.searchWord
      };

      return obj;
    },
  }
}
</script>