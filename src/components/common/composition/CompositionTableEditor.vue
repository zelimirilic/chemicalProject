<template>
	<div>
		<CompositionTable :isLocalProduct="isLocalProduct(product)" :productId="product.id" @reRenderCompositionList="reRenderCompositionList()" :substances="substances" @edit="edit()" v-show="!isEditing" />
		<CompositionTableEdit :product="product" @cancel="cancel" :substance="substance" @reRenderCompositionList="reRenderCompositionList()" :isChanged="isChanged" v-if="isEditing" />
	</div>
</template>

<script>
import CompositionTable from './CompositionTable';
import CompositionTableEdit from './CompositionTableEdit';
import { hashCode, deepClone } from '../../../libraries/common';
import { isLocalProduct } from '../../../libraries/product';

export default {
  props: ['product', 'substances'],
  components: {
    CompositionTable,
    CompositionTableEdit,
  },
  data() {
    return {
      substance: { substanceId: null, substanceId_Mdbid: null, lowConc: null, highConc: null, concLowSign: null, concHighSign: null, name: null, cas: null, eg: null, rCodes: [], dangerClasses: [], productId: { id: this.product.id.id, id_mdbID: this.product.id.id_mdbID } },
      substanceObjCopy: null,
      startHash: null,
      isEditing: false
    };
  },
  methods: {
    edit() {
      this.isEditing = true;
      this.substanceObjCopy = deepClone(this.substance);
      this.startHash = hashCode(this.substanceObjCopy);
    },
    cancel() {
      this.isEditing = false;
      this.startHash = null;
      this.substance = this.substanceObjCopy;
    },
    reRenderCompositionList() {
      this.isEditing = false;
      this.substance = this.substanceObjCopy;
      this.$emit('getSubstances');
    },
    isLocalProduct
  },
  computed: {
    isChanged() {
      return this.startHash != hashCode(this.substance);
    }
  }
}
</script>