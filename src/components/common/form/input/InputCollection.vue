<template>
	<div>
		<div class="input-group" :class="{ notValid: !isValid, specialType: isCollection }">
			<Input :class="{ notValid: !isValid }" v-model="inputValue" :focus="focus" @input="onInput" @blur="onBlur" @keydown.enter="pushValue" @keydown.up="editLast" />
			<div class="input-group-append" :title="getTranslation('I00.00006260', 'Edit')" @click="(modalInput = null), (cloneValue = value.map((f) => f))" withReadOnlyMode v-if="isCollection">
				<span class="input-group-text icons icon-edit" v-tooltip="getTranslation('I00.00006260', 'Edit')"></span>
			</div>
		</div>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
		<label class="alert alert-warning w-100 mt-2" v-show="!isNullOrEmpty(inputValue) && enterPressed">{{ getTranslation('I00.00054210', 'You must add this value to a collection by pressing "Enter" button!') }}</label>
		<div v-if="isCollection">
			<Badge class="mt-2 mr-2" v-for="(item, ind) in value" :key="item + ind" @delete="removeAt(ind)">{{ item }}</Badge>
		</div>
		<ModalDialog :title="getTranslation('I00.00054070', 'Items')" @close="cloneValue = null" additional-class="wp-400" v-if="cloneValue">
			<InputGroup class="mb-3" v-model="modalInput">
				<ButtonIconAdd :class="{ disabled: isNullOrEmpty(modalInput) }" @click="cloneValue.push(modalInput), (modalInput = null)" withBorder />
			</InputGroup>
			<InputGroup class="mb-3" v-model="cloneValue[ind]" v-for="(item, ind) in cloneValue" :key="ind" :validations="[validators.isNotEmpty]" ref="items">
				<ButtonIconRemove @click="cloneValue.removeAt(ind)" withBorder />
			</InputGroup>
			<div class="mt-4 text-right" :class="{ disabled: !true }">
				<ButtonOk @click="emitCloneValue" />
				<ButtonCancel @click="cloneValue = null" />
			</div>
		</ModalDialog>
	</div>
</template>
<script>
import Badge from '../../badge/Badge';
import ButtonIconAdd from '../../button/buttonIcon/ButtonIconAdd';
import ButtonIconRemove from '../../button/buttonIcon/ButtonIconRemove';
import { checkIsValid, validators } from '../../../../libraries/forms';
import { setAllValidationParents, removeAllValidationParents, propToBool } from '../../../../libraries/vue';
import { deepClone, hashCode, isNullOrEmpty } from '../../../../libraries/common';

export default {
  components: {
    Badge,
    ButtonIconAdd,
    ButtonIconRemove,
  },
  props: ['value', 'required', 'validations', 'placeholder', 'focus'],
  data(self) {
    return {
      inputValue: (self.value || []).length === 1 ? self.value.first() : null,
      isValid: true,
      errorMessage: null,
      enterPressed: (self.value || []).length > 1,
      cloneValue: null,
      validators,
      modalInput: null,
      lastEmittedValue: self.value
    };
  },
  methods: {
    onInput(event) {
      if (!this.value || !this.value.length || (this.value.length === 1 && !this.enterPressed)) {
        this.lastEmittedValue = isNullOrEmpty(event) ? [] : [event];
        this.$emit('input', this.lastEmittedValue);
      }
      this.$nextTick(() => this.checkIsValid());
    },
    onBlur(event) {
      this.$emit('blur', event);
      this.$nextTick(() => this.checkIsValid());
    },
    pushValue() {
      if (!isNullOrEmpty(this.inputValue)) {
        if (this.enterPressed) {
          this.lastEmittedValue = [...this.value, this.inputValue];
          this.$emit('input', this.lastEmittedValue);
        }
        this.inputValue = null;
        this.enterPressed = true;
        this.$nextTick(() => this.checkIsValid());
      }
    },
    removeAt(index) {
      var value = this.value.filter((_, ind) => ind !== index);
      this.lastEmittedValue = value;
      this.$emit('input', value);
      if (value.length === 1 && isNullOrEmpty(this.inputValue)) {
        this.inputValue = value.first();
        this.enterPressed = false;
      } else if (!value.length) {
        this.enterPressed = false;
      }
      this.$nextTick(() => this.checkIsValid());
    },
    editLast() {
      //   if (isNullOrEmpty(this.inputValue) && (this.value || []).length) {
      //     this.inputValue = this.value.last();

      //     setTimeout(() => event.target.selectionStart = event.target.selectionEnd = this.inputValue.length, 5);

      //     if (this.value.length > 1) {
      //       this.$emit('input', this.value.head());
      //       this.$nextTick(() => this.checkIsValid());
      //     } else {
      //       this.enterPressed = false;
      //     }
      //   }
    },
    emitCloneValue() {
      this.lastEmittedValue = this.cloneValue;
      this.$emit('input', this.cloneValue);
      if (this.cloneValue.length <= 1)
        this.enterPressed = false;
      this.cloneValue = null;
    },
    checkIsValid,
    isNullOrEmpty,
    deepClone,
  },
  computed: {
    isCollection() {
      return this.value && (this.value.length > 1 || (this.value.length == 1 && this.enterPressed));
    }
  },
  watch: {
    value() {
      if ((hashCode(this.lastEmittedValue) !== (this.value && hashCode(this.value)) || (this.lastEmittedValue || []).length === 1)) {
        this.inputValue = (this.value || []).length === 1 ? this.value.first() : null;
        this.enterPressed = (this.value || []).length > 1;
      }
    }
  },
  mounted() {
    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }

    if (propToBool(this.focus)) {
      this.$nextTick(() => this.$el.focus());
    }
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  },
}
</script>