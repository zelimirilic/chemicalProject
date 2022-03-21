<template>
	<div class="dataTables_paginate paging_full_numbers">
		<A class="first paginate_button" :class="{ disabled: value === 1 }" @click="selectPage(1)"><b class="first">&nbsp;</b></A>
		<A class="previous paginate_button" :class="{ disabled: value === 1 }" @click="selectPage(value - 1)"><b class="previous">&nbsp;</b></A>
		<span>
			<template v-for="(page, index) in pages">
				<A class="paginate_button" :class="{ current: value === page, paginate_active: value === page }" :key="index" @click="selectPage(page)">{{ page }}</A>
				<span class="ellipsis" v-if="showEllipsis(index)" :key="index">…</span>
			</template>
		</span>
		<A class="next paginate_button" :class="{ disabled: value === totalPages }" @click="selectPage(value + 1)"><b class="next">&nbsp;</b></A>
		<A class="last paginate_button" :class="{ disabled: value === totalPages }" @click="selectPage(totalPages)"><b class="last">&nbsp;</b></A>
	</div>
</template>

<script>
import Pagination from './Pagination';
import A from '../others/A_v3';

export default {
  extends: Pagination,
  name: 'Pagination',
  components: {
    A
  }
}
</script>