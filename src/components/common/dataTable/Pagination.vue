<template>
	<div class="dataTables_paginate paging_full_numbers d-flex align-items-center ml-auto">
		<A class="first arrows paginate_button ml-0" :class="{ disabled: value === 1 }" @click="selectPage(1)"><b class="icons icon-next"></b></A>
		<A class="previous arrows paginate_button" :class="{ disabled: value === 1 }" @click="selectPage(value - 1)"><b class="icons icon-arrowup"></b></A>
		<span>
			<template v-for="(page, index) in pages">
				<A class="paginate_button" :class="{ current: value === page, paginate_active: value === page }" :key="index" @click="selectPage(page)">{{ page }}</A>
				<span class="ellipsis" v-if="showEllipsis(index)" :key="index">…</span>
			</template>
		</span>
		<A class="next arrows paginate_button" :class="{ disabled: value === totalPages }" @click="selectPage(value + 1)"><b class="icons icon-arrowup"></b></A>
		<A class="last arrows paginate_button mr-0" :class="{ disabled: value === totalPages }" @click="selectPage(totalPages)"><b class="icons icon-next"></b></A>
	</div>
</template>

<script>
export default {
  props: ['perPage', 'pageChanged', 'value', 'dat'],
  methods: {
    selectPage(event) {
      this.$emit('input', event);
    },
    showEllipsis: function (index) {
      return index !== this.pages.length - 1 && this.pages[index] !== this.pages[index + 1] - 1;
    },
  },
  computed: {
    totalPages: function () {
      return Math.ceil(this.dat.length / this.perPage);
    },
    pages: function () {
      var goLeft = Math.max(this.value - (this.totalPages - 4), 2);
      var start = Math.max(this.value - goLeft, 1);
      var goRight = Math.max(start + 4 - this.value, 2);
      var end = Math.min(this.value + goRight, this.totalPages);
      return (start).rangeTo(end);
    },
  },
}
</script>