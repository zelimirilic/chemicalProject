<template>
	<div class="row no-gutters" :class="{ 'stripedBg borderTRBL rounded': isEdit }" @dblclick.stop="$emit('set-selected-container', element)">
		<div class="col-12 py-3 cursor" :class="{ containerSelected: isSelected }" v-if="isEdit"></div>
		<div v-for="(item, index) in childs" :key="index" :class="item.props.className + (isEdit ? ' whiteBg p-3' : '')" ref="items">
			<div class="btn-toolbar" v-if="isEdit" @dblclick="selectContainer(item, $event)">
				<div class="btn-group ml-auto">
					<button type="button" class="btn cursorDrag" v-if="isEdit" @mousedown="emitGrabbed(childs, item, $event)" v-tooltip="getTranslation('I00.00049470', 'Drag & drop')"><span class="icons icon-drag"></span></button>
					<button type="button" class="btn" @click="$emit('set-selected', item)" v-if="isEdit" v-tooltip="getTranslation('I00.00006260', 'Edit')"><span class="icons icon-edit"></span></button>
					<button type="button" class="btn" @click="removeChild(item)" v-if="isEdit" v-tooltip="getTranslation('I00.00039230', 'Delete')"><span class="icons icon-delete"></span></button>
				</div>
			</div>
			<component :is="item.template" :class="!item.children && additionalClass" :element="item" :childs="item.children" v-bind="item.props" :isEdit="isEdit" :dat="dat" :additionalClass="additionalClass" :value="getFnc(item.props.dataProp)(dat)" @input="setFnc(item.props.dataProp)(dat, $event)" @set-selected="$emit('set-selected', $event)" @set-selected-container="$emit('set-selected-container', $event)" @grabbed="emitGrabbed" />
		</div>
		<div class="col-12 py-3 cursor" :class="{ containerSelected: isSelected }" v-if="isEdit" />
	</div>
</template>

<script>
import { getAllChildrens, getFnc, setFnc } from '../../libraries/common';
import imortedComponents from './imortedComponents';
export default {
  components: {
    ...imortedComponents,
  },
  props: ['childs', 'text', 'required', 'isSelected', 'templates', 'dat', 'isEdit', 'element', 'additionalClass'],
  name: 'Container',
  methods: {
    removeChild(item) {
      this.childs.remove(item);

      if (item.props.isSelected || getAllChildrens(item).any(f => f.props.isSelected))
        this.$emit('set-selected-container', this.element);
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
}
</script>
