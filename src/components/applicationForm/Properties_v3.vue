<template>
	<div class="p-4">
		<component :is="selected.template" :selected="selected" v-if="propsComponentExists" />
		<template v-else>
			<InputGroup class="mb-3" :text="this.getTranslation('I00.00039450', 'Text')" :placeholder="this.getTranslation('I00.00055450', 'Label text')" v-model="selected.props.text" v-if="selected.props.text !== undefined" />
			<SelectGroup :text="this.getTranslation('I00.00046250', 'Class')" :items="Object.keys(widthTranslator)" v-model="selected.props.className" :prop="(f) => widthTranslator[f]" v-if="selected.props.className !== undefined" />
			<template v-if="selected.template === 'InformationBoxProps'">
				<TextAreaGroup class="mb-3" :text="this.getTranslation('I00.00055430', 'Placeholder')" :placeholder="this.getTranslation('I00.00055440', 'Placeholder text')" v-model="selected.props.placeholder" v-if="selected.props.placeholder !== undefined" />
			</template>
			<template v-else>
				<InputGroup class="mb-3" :text="this.getTranslation('I00.00055430', 'Placeholder')" :placeholder="this.getTranslation('I00.00055440', 'Placeholder text')" v-model="selected.props.placeholder" v-if="selected.props.placeholder !== undefined" />
			</template>
			<template v-if="selected.props.items">
				<InputGroup class="mb-3" v-model="propsItemsValue" :text="getTranslation('I00.00054070', 'Items')">
					<ButtonIconAdd :class="{ disabled: isNullOrEmpty(propsItemsValue) }" @click="selected.props.items.push(propsItemsValue), (propsItemsValue = null)" withBorder />
				</InputGroup>
				<InputGroup class="mb-3" v-model="selected.props.items[ind]" v-for="(item, ind) in selected.props.items" :key="ind" :validations="[validators.isNotEmpty]" ref="items">
					<ButtonIconRemove :class="{ disabled: selected.props.items.length <= 2 }" @click="selected.props.items.removeAt(ind)" withBorder />
				</InputGroup>
			</template>
			<UsersApplicationFormProp v-model="selected.props.users" v-if="selected.props.users" />
			<CheckBoxGroup v-model="selected.props.required" :text="getTranslation('I00.00044270', 'Required')" v-if="selected.props.required !== undefined" />
			<CheckBoxGroup class="mt-2" v-model="selected.props.disableProductNameEditing" :text="getTranslation('I00.00056680', 'Disable product free text')" v-if="selected.props.disableProductNameEditing !== undefined" />
			<CheckBoxGroup class="mt-2" v-model="selected.props.sdsNotRequired" :text="getTranslation('I00.00011440', 'SDS not required')" v-if="selected.props.sdsNotRequired !== undefined" />
			<CheckBoxGroup class="mt-2" v-model="selected.props.shouldShowRequestButton" :text="getTranslation('I00.00056890', 'Show request button')" v-if="selected.props.shouldShowRequestButton !== undefined && !appSettings.disableInventoryShowRequestButton" />
			<CheckBoxGroup class="mt-2" v-model="selected.props.iSafe" :text="getTranslation('I00.00057270', 'Show on iSafe')" v-if="selected.props.iSafe !== undefined" />
		</template>
		<div class="d-flex mt-4 text-right" :class="{ disabled: !isModelValid }">
			<ButtonOk @click="$emit('close')" />
			<ButtonCancel @click="cancel" />
		</div>
	</div>
</template>

<script>
import Properties from './Properties';
import CheckBoxGroup from '../common/form/checkBox/CheckBoxGroup_v3';
import DepartmentWithConsumptionProps from './properties/DepartmentWithConsumptionProps_v3';
import InputGroup from '../common/form/input/InputGroup_v3';
import SelectGroup from '../common/form/select/SelectGroup_v3';
import ButtonIconAdd from "../common/button/buttonIcon/ButtonIconAdd_v3";
import ButtonOk from "../common/button/button/ButtonOk_v3";
import ButtonCancel from "../common/button/button/ButtonCancel_v3";
import UsersApplicationFormProp from "../../components/applicationForm/properties/UsersApplicationFormProp_v3";
import A from '../../components/common/others/A_v3';
import TextAreaGroup from '../common/form/textArea/TextAreaGroup_v3.vue';

export default {
  extends: Properties,
  name: 'Properties',
  components: {
    CheckBoxGroup,
    DepartmentWithConsumptionProps,
    InputGroup,
    SelectGroup,
    ButtonIconAdd,
    ButtonOk,
    ButtonCancel,
    UsersApplicationFormProp,
    A,
    TextAreaGroup
  }
}
</script>