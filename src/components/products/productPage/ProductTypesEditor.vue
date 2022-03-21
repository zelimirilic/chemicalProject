<template>
	<div>
		<InformationBox additionalClass="p-4" :tooltipTtl="getTranslation('I00.00006260', 'Edit')" :title="getTranslation('I00.00002870', 'Product types')" :loading="!allTypes" @edit="editTypes" v-show="!typesForEdit">
			<div class="col-12">
				<div class="emptyTxt text-center" v-if="!(product.productTypes && product.productTypes.length)">
					<p class="icons icon-noitems plainIcn bigIcn m-0 p-0"></p>
					<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055680', 'No items found') }}</h4>
					<h6 class="mb-0">{{ getTranslation('I00.00055690', 'You don’t have any items here.') }}</h6>
				</div>
				<template v-else>
					<Badge class="m-1" v-for="(item, ind) in product.productTypes.filter((f) => !f.deleted)" :key="ind" :title="getNodeNamePath(item)">{{ getTranslation(item.productType.name, 'Product type name') }}</Badge>
				</template>
			</div>
		</InformationBox>
		<InformationBoxEdit class="widthDropdown" additionalClass="p-4" :title="getTranslation('I00.00002870', 'Product types')" :loader="isSaving" :isChanged="isChanged" :isModelValid="true" @cancel="typesForEdit = null" @save="saveTypes" v-if="typesForEdit">
			<div class="col-12">
				<div class="form-group mb-0">
					<label class="form-control-label">{{ getTranslation('I00.00055840', 'Add types') }}</label>
					<ProductTypePicker v-model="newType" :removedItems="filteredTypes.map((f) => f.productType.id)" @add="addType" />
				</div>
			</div>
			<div class="col-12 pt-3">
				<Badge class="m-1" v-for="(item, ind) in filteredTypes" :key="ind" @delete="deleteType(item)" :title="getTranslation('I00.00027390', 'Remove')">{{ getTranslation(item.productType.name, 'Product type name') }}</Badge>
			</div>
		</InformationBoxEdit>
	</div>
</template>

<script>
import InformationBox from './InformationBox';
import InformationBoxEdit from './InformationBoxEdit';
import Badge from '../../common/badge/Badge';
import ProductTypePicker from '../../common/form/picker/ProductTypePicker';
import { hashCode, deepClone, idsAreEqual, errorDebug } from '../../../libraries/common';
import { getProductTypeTreeData, nodeNamePath } from '../../../libraries/tree';
import axios from '../../../axios';
export default {
  components: {
    InformationBox,
    InformationBoxEdit,
    Badge,
    ProductTypePicker,
  },
  props: ['product'],
  data() {
    return {
      allTypes: null,
      typesForEdit: null,
      newType: null,
      isSaving: false,
    };
  },
  methods: {
    addType() {
      var deletedType = this.typesForEdit.find(f => idsAreEqual(f.productType.id, this.newType));
      if (deletedType) {
        deletedType.deleted = false;
        this.typesForEdit.remove(deletedType).push(deletedType);
      } else {
        var find = this.allTypes.find(f => idsAreEqual(f.item.orgID, this.newType));
        this.typesForEdit.push({
          productType: {
            id: find.item.orgID,
            name: find.item.name,
          }
        });
      }
      this.newType = null;
    },
    editTypes() {
      this.typesForEdit = this.product.productTypes.map(f => deepClone(f));
    },
    saveTypes() {
      this.isSaving = true;
      axios.post('/LocalProduct/SaveProductTypes', { productId: this.product.id, types: this.typesForEdit })
        .then(response => {
          this.product.productTypes = response.data;
          this.typesForEdit = null;
          this.isSaving = false;
        }).catch(error => {
          this.isSaving = false;
          errorDebug(error);
        });
    },
    getNodeNamePath(item) {
      if (!this.allTypes) return null;
      var find = this.allTypes.find(f => idsAreEqual(f.item.orgID, item.productType.id));
      return nodeNamePath(find);
    },
    deleteType(item) {
      if (item.id)
        this.$set(item, 'deleted', true);
      else
        this.typesForEdit = this.typesForEdit.filter(f => f !== item);
    }
  },
  computed: {
    isChanged() {
      return hashCode(this.product.productTypes) !== hashCode(this.typesForEdit);
    },
    filteredTypes() {
      return this.typesForEdit.filter((f) => !f.deleted);
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisProductTypes'] = this;

    getProductTypeTreeData()
      .then(response => this.allTypes = response);
  }
}
</script>