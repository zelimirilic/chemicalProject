<template>
	<div class="row" component>
		<div v-for="(item, index) in childs" :key="index" :class="item.props.className + (isEdit ? ' pb-3' : '')" ref="items">
			<div class="btn-toolbar pb-2 pt-3" v-if="isEdit" @dblclick="selectContainer(item, $event)">
				<div class="btn-group ml-auto">
					<button type="button" class="btn small cursorDrag" v-if="isEdit" @mousedown="emitGrabbed(childs, item, $event)" :title="getTranslation('I00.00049470', 'Drag & drop')"><span class="icons icon-drag"></span></button>
					<button type="button" class="btn small accentColor" @click="$emit('set-selected', item)" v-if="isEdit" :title="getTranslation('I00.00006260', 'Edit')"><span class="icons icon-edit accentColor"></span></button>
					<button type="button" class="btn small accentColor" @click="removeChild(item)" v-if="isEdit" :title="getTranslation('I00.00039230', 'Delete')"><span class="icons icon-delete accentColor"></span></button>
				</div>
			</div>
			<component :is="item.template" :class="!item.children && additionalClass" :childs="item.children" v-bind="item.props" @modalInModal="$emit('modalInModal', $event)" :element="item" :isEdit="isEdit" :dat="dat" :value="getFnc(item.props.dataProp)(dat)" :additionalClass="additionalClass" @input="setFnc(item.props.dataProp)(dat, $event)" @set-selected="$emit('set-selected', $event)" @set-selected-container="$emit('set-selected-container', $event)" @grabbed="emitGrabbed" />
		</div>
	</div>
</template>

<script>
import { getAllChildrens, getFnc, setFnc } from '../../libraries/common_v3';
import Container from './Container_v3';
import imortedComponents from './imortedComponents_v3';
import CheckBoxGroup from '../common/form/checkBox/CheckBoxGroup_v3';
export default {
	name: 'Section',
	components: {
		...imortedComponents,
		Container,
		CheckBoxGroup,
	},
	props: ['childs', 'text', 'activeTab', 'required', 'dat', 'isEdit', 'isSelected', 'element', 'additionalClass'],
	methods: {
		removeChild(item) {
			this.childs.remove(item);

			if (item.props.isSelected || getAllChildrens(item).any((f) => f.props.isSelected)) this.$emit('set-selected-container', this.element);
		},
		selectContainer(item, event) {
			if (item.children) {
				event.stopPropagation();
				this.$emit('set-selected-container', item);
			}
		},
		emitGrabbed(grabCol, element, event) {
			this.$emit('grabbed', grabCol, element, event);
		},
		getFnc,
		setFnc,
	},
	computed: {
		hasChilds() {
			return this.childs.any();
		},
	},
};
</script>
