<template>
	<div class="row no-gutters" :class="{ 'stripedBg borderTRBL rounded': isEdit }" @dblclick.stop="$emit('set-selected-container', element)">
		<div class="col-12 py-3 cursor" :class="{ containerSelected: isSelected }" v-if="isEdit"></div>
		<div v-for="(item, index) in childs" :key="index" :class="item.props.className + (isEdit ? ' whiteBg p-3' : '')" ref="items">
			<div class="btn-toolbar" v-if="isEdit" @dblclick="selectContainer(item, $event)">
				<div class="btn-group ml-auto">
					<button type="button" class="btn btn-light wide cursorDrag" v-if="isEdit" @mousedown="emitGrabbed(childs, item, $event)" :title="getTranslation('I00.00049470', 'Drag & drop')"><span class="icons icon-drag"></span></button>
					<button type="button" class="btn btn-light small" @click="$emit('set-selected', item)" v-if="isEdit" :title="getTranslation('I00.00006260', 'Edit')"><span class="icons icon-edit accentColor"></span></button>
					<button type="button" class="btn btn-light small" @click="removeChild(item)" v-if="isEdit" :title="getTranslation('I00.00039230', 'Delete')"><span class="icons icon-delete accentColor"></span></button>
				</div>
			</div>
			<component :is="item.template" :class="!item.children && additionalClass" :element="item" :childs="item.children" v-bind="item.props" :isEdit="isEdit" :dat="dat" :additionalClass="additionalClass" :value="getFnc(item.props.dataProp)(dat)" @input="setFnc(item.props.dataProp)(dat, $event)" @set-selected="$emit('set-selected', $event)" @set-selected-container="$emit('set-selected-container', $event)" @grabbed="emitGrabbed" />
		</div>
		<div class="col-12 py-3 cursor" :class="{ containerSelected: isSelected }" v-if="isEdit" />
	</div>
</template>

<script>
import Container from './Container';
import ImortedComponents from '../../components/applicationForm/imortedComponents_v3';


export default {
  extends: Container,
  name: 'Container',
  components: {
    ImortedComponents
  }
}
</script>
