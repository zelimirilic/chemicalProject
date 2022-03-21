<template>
	<div class="specialType w-100" @click.stop.prevent @keydown.down.stop.prevent="go(1)" @keydown.up="go(-1)" @keydown.enter.stop.prevent="selectHoverItem">
		<div class="input-group align-items-center">
			<button class="input-group-prepand" @click="setSearchTextFromValue(-1)"><span class="input-group-text icons icon-producttype"></span></button>
			<div class="form-inline mr-auto">
				<template v-for="(val, ind) in currentValue">
					<span class="py-1" :class="{ hover: ind <= searchHoverIndex }" @mouseenter="searchHoverIndex = ind" @mousemove="searchHoverIndex = ind" @mouseleave="searchHoverIndex = -1" @click="setSearchTextFromValue(ind)" :key="ind">{{ val }}</span>
					<span class="py-1 px-1" :class="{ hover: ind <= searchHoverIndex }" @mouseenter="searchHoverIndex = ind" @mousemove="searchHoverIndex = ind" @mouseleave="searchHoverIndex = -1" @click="setSearchTextFromValue(ind)" v-if="ind < currentValue.length - 1" :key="`spl${ind}`">{{ splitter }}</span>
				</template>
				<template v-if="searchText">
					<span class="py-1 px-1" :class="{ hover: currentValue.length - 1 <= searchHoverIndex }" @mouseenter="searchHoverIndex = currentValue.length - 1" @mousemove="searchHoverIndex = currentValue.length - 1" @mouseleave="searchHoverIndex = -1" @click="setSearchTextFromValue(currentValue.length - 1)" v-if="currentValue.length">{{ splitter }}</span>
					<input class="ml-1" v-model="searchText[searchText.length - 1]" :style="`width: ${calculatedWidth}px;`" @input="hoverIndex = -1" @keydown.delete="textDeleted" @keydown.esc="searchText = null" :focus="focus($refs.searchInp)" ref="searchInp" />
				</template>
				<input ref="inp" v-show="false" />
			</div>
			<button class="input-group-append" @click="setSearchTextFromValue((propFnc(value) || []).length)" v-if="!searchText">
				<span class="input-group-text icons icon-sortup arrowDown" />
			</button>
			<button class="input-group-append" @click="searchText = null" v-else>
				<span class="input-group-text icons icon-sortup" />
			</button>
			<slot name="menuBtns"></slot>
		</div>
		<div class="options bg-white rounded" :style="optionsStyle" ref="optionsParent" v-show="searchText">
			<div class="option" :class="{ hover: hoverIndex === ind }" v-for="(item, ind) in filteredItems" @click="optionSelected(item)" @mouseenter="hoverIndex = ind" @mousemove="hoverIndex = ind" :key="ind" ref="options">
				{{ propFnc(item).join(splitter) }}
			</div>
		</div>
	</div>
</template>
<script>
import SearchSelect from './SearchSelect';

export default {
  extends: SearchSelect,
  name: 'SearchSelect'
}
</script>
