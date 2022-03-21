<template>
	<span class="form-inline" @click="$emit('click')" @mousemove="isHovering = true" @mouseleave="isHovering = false" @mouseenter="$emit('mouseEnter', item)">
		<i class="eqtree-icon eqtree-themeicon eqtree-themeicon-custom"></i>
		<span class="d-inline-block align-middle" @click.stop.prevent v-if="item.isEditing">
			<Input v-model="editingName" required :placeholder="placeholder" @keyup.enter="emitNameChange" focus />
			<span class="btn-group ml-2">
				<button type="button" class="btn" :class="{ disabledTooltip: !isModelValid }" @click="isModelValid ? emitNameChange() : ''" v-tooltip="getTranslation('I00.00004810', 'Save')"><span class="icons icon-check"></span></button>
				<button type="button" class="btn" @click="cancelEditName" v-tooltip="getTranslation('I00.00017780', 'Cancel')"><span class="icons icon-delete"></span></button>
			</span>
		</span>
		<A :treeid="idStr" :title="item.name" v-else>{{ item.name }}{{ numberOfProducts(item) }}</A>
		<span class="d-inline-block align-middle ml-2">
			<template v-if="isHovering && !isEditing">
				<span class="btn-group">
					<button type="button" class="btn" @mousedown.stop.prevent="$emit('markAsRoot', item, $el, $event)" v-if="!item.isRoot && idStr.split(':')[1] != 10" v-tooltip="getTranslation('I00.00040440', 'Mark as root')"><span class="icons icon-pin"></span></button>
					<button type="button" class="btn" @mousedown.stop.prevent="$emit('resetRoot', item, $el, $event)" v-if="item.isRoot" v-tooltip="getTranslation('I00.00040560', 'Reset root')"><span class="icons icon-restore"></span></button>
					<button type="button" class="btn" @mousedown.stop.prevent="$emit('move', item, $el, $event)" v-if="!isRoot && !disabled" v-tooltip="getTranslation('I00.00010190', 'Move')"><span class="icons icon-drag"></span></button>
					<button type="button" class="btn" @click="$emit('add', item)" v-if="!isRoot" v-tooltip="getTranslation('I00.00013100', 'Add')"><span class="icons icon-plus"></span></button>
					<button type="button" class="btn" @click.stop.prevent="editName" v-if="!isRoot && !disabled" v-tooltip="getTranslation('I00.00006260', 'Edit')"><span class="icons icon-edit"></span></button>
					<button type="button" class="btn" @click.stop.prevent="$emit('delete', item)" v-if="!isRoot && !disabled" v-tooltip="getTranslation('I00.00039230', 'Delete')"><span class="icons icon-delete"></span></button>
				</span>
			</template>
		</span>
	</span>
</template>

<script>
import { isNullOrEmpty, idToString } from '../../libraries/common';

export default {
  props: ['item', 'isRoot', 'isEditing', 'placeholder'],
  data() {
    return {
      isHovering: false,
      editingName: '',
      $modelValidators: [],
    }
  },
  methods: {
    editName() {
      this.$set(this.item, 'isEditing', true);
      this.editingName = this.item.name;
    },
    cancelEditName() {
      this.$set(this.item, 'isEditing', false);
      this.isHovering = false;
      this.editingName = null;
      this.$emit('cancel', this.item);
    },
    emitNameChange() {
      if (this.isModelValid) {
        this.$set(this.item, 'isEditing', false);
        this.isHovering = false;
        this.$emit('edit', { ...this.item, name: this.editingName });
      }
    },
    numberOfProducts(item) {
      return item.numberOfProducts != null ? ' (' + item.numberOfProducts + ')' : '';
    }
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid) && !isNullOrEmpty(this.editingName);
    },
    idStr() {
      return idToString(this.item.orgID);
    },
    disabled() {
      if (!this.item.orgID) return;
      return (this.item.orgID.id != 0 && this.item.orgID.id_mdbID == 10);
    }
  }
}
</script>