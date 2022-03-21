<template>
	<th :class="classes" @click="changeSort">
		<div class="columnsBtns" v-if="isEditing && name">
			<button class="btn btn-plain" @click.stop="parent.toggleColumn(name, true)" v-if="!hiddenColumns.includes(name)"><span class="icons icon-delete smallest accent"></span></button>
			<button class="btn btn-plain" @click.stop="parent.toggleColumn(name, false)" v-else><span class="icons icon-plus smallest"></span></button>
		</div>
		<!-- <div class="d-flex justify-content-between" :class="{ 'mt-3': isEditing && name }"> -->
		<span :class="{ thTxt: sortFnc }"><slot></slot></span>
		<!-- <span class="icons ml-2" :class="sortClass" v-if="sortFnc"></span> -->
		<!-- </div> -->
	</th>
</template>

<script>
import Th from './Th';

export default {
  extends: Th,
  name: 'Th',
}
</script>