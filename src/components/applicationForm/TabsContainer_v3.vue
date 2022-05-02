<template>
	<div class="card pageWrapper">
		<ul class="nav nav-tabs">
			<li class="nav-item position-relative" :class="{ tabWidthIcns: isEdit }" v-for="(tab, index) in childs" :key="index">
				<A class="nav-link tab" :class="{ active: value === index }" @click="$emit('input', index)" ondragstart="event.preventDefault()">
					<span class="icons mr-2" :class="tabsIcons[index]" v-if="tabsIcons[index]"></span>
					<b>{{ tab.props.text }}</b>
					<div class="btn-group toolbar ml-3" v-if="isEdit">
						<button class="btn small cursorDrag" @mousedown="emitGrabbed(childs, tab, $event)" v-tooltip="getTranslation('I00.00049470', 'Drag & drop')" v-if="areTabsDraggable"><span class="icons icon-drag"></span></button>
						<button class="btn small" @click="$emit('set-selected', tab)" :title="getTranslation('I00.00006260', 'Edit')"><span class="icons icon-edit accentColor"></span></button>
						<button class="btn small" :class="{ disabled: childs.length === 1 }" @click="$emit('remove-tab', tab)" :title="getTranslation('I00.00039230', 'Delete')"><span class="icons icon-delete accentColor"></span></button>
					</div>
				</A>
			</li>
			<li class="nav-item ml-auto" v-if="canAdd">
				<A class="nav-link tab icons icon-plus" @click="$emit('add-tab')"></A>
			</li>
			<li class="nav-item ml-auto" v-if="sendBtn">
				<A class="nav-link tab grayBg" @click="$emit('send')"><span class="sendIcn"></span></A>
			</li>
		</ul>
		<div class="tab-content tabWrapper">
			<div class="section py-4" :class="{ sectionSelected: isEdit && element.props.isSelected, stripedBg: isEdit, borderT: !isEdit }" v-for="(element, index) in childs[value].children" :key="index" @dblclick="$emit('set-selected-container', element)" component>
				<div class="whiteBg px-3" :class="{ 'pb-3 borderTB': isEdit }">
					<div class="d-flex flex-row align-center borderB" :class="{ 'py-3': isEdit, 'py-2 darkGreenTxt': !isEdit }">
						<h5 class="cursor">
							{{ element.props.text }}
							<sup class="icons astera ml-1" v-if="required"></sup>
						</h5>
						<div class="btn-group toolbar ml-auto" v-if="isEdit">
							<button type="button" class="btn small cursorDrag" v-if="isEdit" @mousedown="emitGrabbed(childs[value].children, element, $event)" :title="getTranslation('I00.00049470', 'Drag & drop')"><span class="icons icon-drag"></span></button>
							<button type="button" class="btn small" v-if="isEdit" @click="$emit('set-selected', element)" :title="getTranslation('I00.00006260', 'Edit')"><span class="icons icon-edit accentColor"></span></button>
							<button type="button" class="btn small" v-if="isEdit" @click="removeSection(element)" :title="getTranslation('I00.00039230', 'Delete')"><span class="icons icon-delete accentColor"></span></button>
						</div>
					</div>
					<div v-if="!element.children.any()" class="mt-3 py-4 stripedBg borderTRBL rounded"></div>
					<component :is="element.template" :class="{ readOnly: tabsIcons[value] }" :element="element" v-bind="element.props" :childs="element.children" :dat="dat" :isEdit="isEdit" @modalInModal="$emit('modalInModal', $event)" :additionalClass="additionalClass" @item-dragging="$emit('item-dragging', $event)" @set-selected="$emit('set-selected', $event)" @set-selected-container="$emit('set-selected-container', $event)" @remove-section="removeSection(element)" @grabbed="emitGrabbed" />
				</div>
			</div>
		</div>
		<ModalDialog v-if="$store.state.modalConfirm.show" additional-class="wp-400" :title="$store.state.modalConfirm.title" @close="$store.state.modalConfirm.reject">
			<h6>{{ $store.state.modalConfirm.message }}</h6>
			<div class="pt-4 text-right">
				<ButtonOk @click="$store.state.modalConfirm.resolve" />
				<ButtonCancel @click="$store.state.modalConfirm.reject" />
			</div>
		</ModalDialog>
	</div>
</template>

<script>
import Section from './Section_v3';
import { getAllChildrens } from '../../libraries/common_v3';
import ModalDialog from '../../components/common/modal/ModalDialog_v3';
import ButtonOk from '../../components/common/button/button/ButtonOk_v3';
import ButtonCancel from '../../components/common/button/button/ButtonCancel_v3';
export default {
	components: {
		Section,
		ModalDialog,
		ButtonOk,
		ButtonCancel,
	},
	props: ['childs', 'text', 'value', 'required', 'dat', 'isEdit', 'canAdd', 'additionalClass', 'tabIcon', 'sendBtn', 'areTabsDraggable'],
	methods: {
		removeSection(section) {
			this.confirm(this.getTranslation('I00.00055330', 'Remove section'), this.getTranslation('I00.00055340', 'Are you sure you want to remove section and all its content?'))
				.then(() => {
					var children = this.childs[this.value].children;

					var index = this.childs[this.value].children.indexOf(section);
					children.remove(section);

					if (children.any() && (section.props.isSelected || getAllChildrens(section).any((f) => f.props.isSelected))) {
						this.$emit('set-selected-container', index >= children.length ? children.last() : children[index]);
					}
				})
				.catch(this.errorDebug);
		},
		emitGrabbed(grabCol, element, event) {
			this.$emit('grabbed', grabCol, element, event);
		},
	},
	computed: {
		tabsIcons() {
			return this.childs.map((f) => this.tabIcon && this.tabIcon(f));
		},
	},
	mounted() {
		if (process.env.NODE_ENV === 'development') window['thisTabsContainer'] = this;

		this.getTranslation('I00.00055330', 'Remove section');
		this.getTranslation('I00.00055340', 'Are you sure you want to remove section and all its content?');
	},
};
</script>
