<template>
	<div>
		<div class="input-group" :class="{ notValid: !isValid }">
			<Input :placeholder="placeholder" v-model="inputValue" @input="onInput" @blur="onBlur" @keydown.enter="pushValue" @keydown.up="editLast" :validations="[validators.maxLength(35)]" />
			<div class="input-group-append" :title="getTranslation('I00.00006260', 'Edit')" @click="(modalInput = null), (cloneValue = value.map((f) => f))" withReadOnlyMode v-if="isCollection">
				<span class="input-group-text icons icon-edit"></span>
			</div>
		</div>
		<template v-if="value && (value.length > 1 || (value.length == 1 && enterPressed))">
			<Badge class="mt-2 mr-2" v-for="(item, ind) in value" :key="item + ind" @delete="removeAt(ind)">{{ item }}</Badge>
		</template>
		<label class="notValid Box mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
		<div>
			<label class="alert alert-warning w-100 mt-2" v-show="!isNullOrEmpty(inputValue) && enterPressed">{{ getTranslation('I00.00054210', 'You must add this value to a collection by pressing "Enter" button!') }}</label>
		</div>
		<ModalDialog :title="getTranslation('I00.00054070', 'Items')" @close="cloneValue = null" additional-class="wp-400" v-if="cloneValue">
			<InputGroup class="mb-3" v-model="modalInput">
				<ButtonIconAdd :class="{ disabled: isNullOrEmpty(modalInput) }" @click="cloneValue.push(modalInput), (modalInput = null)" withBorder />
			</InputGroup>
			<InputGroup class="mb-3" v-model="cloneValue[ind]" v-for="(item, ind) in cloneValue" :key="ind" :validations="[validators.isNotEmpty]" ref="items">
				<ButtonIconRemove @click="cloneValue.removeAt(ind)" withBorder />
			</InputGroup>
			<div class="d-flex mt-4 text-right" :class="{ disabled: !true }">
				<ButtonOk @click="emitCloneValue" />
				<ButtonCancel @click="cloneValue = null" />
			</div>
		</ModalDialog>
	</div>
</template>
<script>
import InputCollection from './InputCollection';
import Badge from '../../badge/Badge_v3';
import Input from './Input_v3';
import InputGroup from './InputGroup_v3';
import ButtonIconAdd from '../../button/buttonIcon/ButtonIconAdd_v3';
import ButtonIconRemove from '../../button/buttonIcon/ButtonIconRemove_v3';
import ModalDialog from '../../modal/ModalDialog_v3';

export default {
  extends: InputCollection,
  name: 'InputCollection',
  components: {
    Badge,
    Input,
    InputGroup,
    ButtonIconAdd,
    ButtonIconRemove,
    ModalDialog
  }
}
</script>