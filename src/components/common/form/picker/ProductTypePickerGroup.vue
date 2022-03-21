<template>
	<div class="form-group mb-0" withReadOnlyMode>
		<label class="form-control-label" v-if="text != null">
			{{ text }}
			<sup class="astera" v-if="propToBool(required)">*</sup>
		</label>
		<ProductTypePicker :class="{ notValid: !isValid }" v-model="currentValue" :removedItems="value" @add="addType" />
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
		<div v-if="value && value.length" class="mt-3 p-3 lightGrayBg rounded borderTRBL">
			<Badge class="m-1" @delete="removeType(item)" :title="getTranslation('I00.00027390', 'Remove')" v-for="(item, ind) in value" :key="ind">
				{{ getTranslation(findTypeName(item), 'Product type') }}
			</Badge>
		</div>
	</div>
</template>

<script>
import ProductTypePicker from './ProductTypePicker';
import Badge from '../../badge/Badge';
import { propToBool, setAllValidationParents, removeAllValidationParents } from '../../../../libraries/vue';
import { checkIsValid } from '../../../../libraries/forms';
import { getProductTypeTreeData } from '../../../../libraries/tree';
import { idsAreEqual } from '../../../../libraries/common';
export default {
  components: {
    ProductTypePicker,
    Badge,
  },
  props: ['value', 'text', 'required', 'validations'],
  data() {
    return {
      isValid: true,
      propToBool: propToBool,
      errorMessage: null,
      currentValue: null,
      productTypes: null,
    };
  },
  methods: {
    addType(event) {
      this.$emit('input', [...(this.value || []), event]);
      this.$nextTick(() => this.checkIsValid());
      this.currentValue = null;
    },
    removeType(event) {
      this.$emit('input', this.value.filter(f => f !== event));
      this.$nextTick(() => this.checkIsValid());
    },
    findTypeName(item) {
      var find = (this.productTypes || []).find(f => idsAreEqual(f.item.orgID, item));
      return find ? find.item.name : null;
    },
    checkIsValid: checkIsValid,
  },
  mounted() {
    getProductTypeTreeData()
      .then(response => this.productTypes = response);

    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  },
}
</script>