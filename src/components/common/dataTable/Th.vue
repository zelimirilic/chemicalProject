<template>
	<th :class="classes" @click="changeSort">
		<div class="columnsBtns" v-if="isEditing && name">
			<button class="btn" @click.stop="parent.toggleColumn(name, true)" v-if="!hiddenColumns.includes(name)"><span class="icons icon-delete smallIcn accentColor"></span></button>
			<button class="btn" @click.stop="parent.toggleColumn(name, false)" v-else><span class="icons icon-plus smallIcn"></span></button>
		</div>
		<div class="d-flex" :class="{ 'mt-3': isEditing && name }">
			<span class="thTtl" :class="{ thTxt: sortFnc, sortTxt: sortDirection === true || sortDirection === false }"><slot></slot></span>
			<span class="flex-shrink-0 ml-1" :class="sortClass" v-if="sortFnc"></span>
		</div>
	</th>
</template>

<script>
import { isFunction } from '../../../libraries/common';
import { propToBool } from '../../../libraries/vue';
export default {
  props: ['prop', 'sort', 'export', 'excelTitle', 'searchable', 'defaultSort', 'name', 'placeholder'],
  data() {
    return {
      sortDirection: null,
      isEditing: false,
      hiddenColumns: [],
    }
  },
  methods: {
    changeSort() {
      if (this.sortFnc) {
        this.sortDirection = !this.sortDirection;

        var sortFnc = (data) => {
          var localCompare = (a, b) => {
            var aRes = this.sortFnc(a) || '';
            var bRes = this.sortFnc(b) || '';

            if (aRes.localeCompare)
              return aRes.localeCompare(bRes, undefined, { sensitivity: 'base' });
            else if (bRes.localeCompare)
              return -bRes.localeCompare(aRes, undefined, { sensitivity: 'base' });
            return 0;
          };

          var ret = data.map(f => f).sort((a, b) => (this.sortFnc(a) || '') > (this.sortFnc(b) || '') ? 1 : -1)
            .sort(localCompare);

          if (!this.sortDirection) {
            ret = ret.reverse();
          }
          return ret;
        }
        this.findDataTableParent().sort(this, sortFnc);
      }
    },
    findDataTableParent() {
      var rec = function rec(el) {
        if (el.isDataTable) {
          return el;
        } else if (el.$parent) {
          return rec(el.$parent);
        }
      };
      return rec(this.$parent);
    },
    reset() {
      this.sortDirection = null;
    },
  },
  computed: {
    classes() {
      return [
        this.sortClass,
        this.isEditing || !this.hiddenColumns.includes(this.name) ? null : 'hiddenColumn',
        this.name && this.hiddenColumns.includes(this.name) ? 'grayBg' : null
      ].filter(f => f).join(' ')
    },
    sortClass() {
      if (!this.sortFnc) return null;

      var ret = 'sorting';
      if (this.sortDirection === true)
        ret += '_asc';
      else if (this.sortDirection === false)
        ret += '_desc';

      return ret;
    },
    sortFnc() {
      if (!propToBool(this.sort)) return null;

      var sortBy = this.sort || this.prop;

      if (sortBy) {
        return (isFunction(sortBy)) ? sortBy : (f => f[sortBy]);
      }
      return null;
    },
    exportFnc() {
      if (!propToBool(this.export)) return null;

      var exportBy = this.export || this.prop;

      if (exportBy) {
        return (isFunction(exportBy)) ? exportBy : (f => f[exportBy]);
      }
      return null;
    },
    parent() {
      return this.findDataTableParent();
    },
  },
  mounted() {
    if (propToBool(this.defaultSort)) {
      if (this.defaultSort === 'desc') {
        this.sortDirection = true;
      }
      this.changeSort();
    }
  }
}
</script>