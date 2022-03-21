<template>
	<div class="row px-4" component>
		<div v-for="(item, index) in childs" :key="index" :class="item.props.className + (isEdit ? ' pb-3' : '')" ref="items">
			<div class="btn-toolbar pt-3 pb-1" v-if="isEdit" @dblclick="selectContainer(item, $event)">
				<div class="btn-group ml-auto">
					<button type="button" class="btn cursorDrag" v-if="isEdit" @mousedown="emitGrabbed(childs, item, $event)" v-tooltip="getTranslation('I00.00049470', 'Drag & drop')"><span class="icons icon-drag"></span></button>
					<button type="button" class="btn" @click="$emit('set-selected', item)" v-if="isEdit" v-tooltip="getTranslation('I00.00006260', 'Edit')"><span class="icons icon-edit"></span></button>
					<button type="button" class="btn" @click="removeChild(item)" v-if="isEdit" v-tooltip="getTranslation('I00.00039230', 'Delete')"><span class="icons icon-delete"></span></button>
				</div>
			</div>
			<component :is="item.template" :class="!item.children && additionalClass" :childs="item.children" v-bind="item.props" :element="item" :isEdit="isEdit" :dat="dat" :value="getFnc(item.props.dataProp)(dat)" :additionalClass="additionalClass" @input="setFnc(item.props.dataProp)(dat, $event)" @set-selected="$emit('set-selected', $event)" @set-selected-container="$emit('set-selected-container', $event)" @grabbed="emitGrabbed" />
		</div>
	</div>
</template>

<script>
import Container from './Container';
import imortedComponents from './imortedComponents';
import { getAllChildrens, getFnc, setFnc } from '../../libraries/common';
export default {
  name: 'Section',
  components: {
    ...imortedComponents,
    Container,
  },
  props: ['childs', 'text', 'activeTab', 'required', 'dat', 'isEdit', 'isSelected', 'element', 'additionalClass'],
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
  computed: {
    hasChilds() { return this.childs.any(); },
  }
}
</script>