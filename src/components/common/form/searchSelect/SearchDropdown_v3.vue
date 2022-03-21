<template>
	<WithDropdown class="specialType w-100" :value="showDropdown && filteredItems.length" @input="hideDropdown" @keydown.down.prevent="go(1)" @keydown.up.prevent="go(-1)" @keydown.enter="selectHoverItem" @keydown.esc="onEsc()">
		<div class="input-group align-items-center">
			<input class="form-control" v-model="inputValue" @input="inputChanged(), (hoverIndex = -1)" @keyup.enter="onEnter()" @focus="onFocus()" @click="onFocus()" @blur="hideDropdown" ref="searchInp" />
			<button class="input-group-append px-0" @click="showDropdown = !showDropdown">
				<span class="input-group-text icons icon-arrowup" :class="{ arrowDown: !showDropdown }"></span>
			</button>
		</div>
		<template #dropdown>
			<div class="option" :class="{ hover: hoverIndex === ind }" v-for="(item, ind) in filteredItems" @click="itemSelected(item)" @mouseenter="hoverIndex = ind" @mousemove="hoverIndex = ind" :key="ind" ref="options">
				{{ propFnc(item) }}
			</div>
		</template>
	</WithDropdown>
</template>
<script>
import SearchDropdown from './SearchDropdown.vue'
import WithDropdown from './WithDropdown_v3'
export default {
  extends: SearchDropdown,
  name: 'SearchDropdown',
  components: {
    WithDropdown
  }
}
</script>