<template>
	<AccordionBoxEdit additionalClass="no-gutters" @cancel="$emit('cancel')" @save="save" :isChanged="isChanged" :isModelValid="isModelValid">
		<SelectGroup class="col-12 mb-0" :text="getTranslation('I00.00028610', 'Choose a list') + ':'" :items="restrictionAndProhibitionLists" prop="listText" :value="restrictionAndProhibitionLists[0]" @input="listSelected" />
		<div class="mt-3" v-if="list.any()">
			<Badge class="m-1" @delete="removeProductList(item)" withReadOnlyMode :title="getTranslation('I00.00027390', 'Remove')" v-for="(item, index) in list.sortBy((f) => getTranslation(f.listText, 'List translation'))" :key="index">
				{{ getTranslation(item.listText, 'List translation') }}
			</Badge>
		</div>
	</AccordionBoxEdit>
</template>

<script>
import AccordionBoxEdit from './AccordionBoxEdit';
import Badge from '../../common/badge/Badge';
import { hashCode, idsAreEqual } from '../../../libraries/common';
import { checkIsValid } from '../../../libraries/vue';

export default {
  components: {
    AccordionBoxEdit,
    Badge
  },
  props: ['productLists', 'list'],
  data() {
    return {
      $modelValidators: [],
      startHash: hashCode(this.list)
    };
  },
  methods: {
    save() {
      if (!checkIsValid(this)) return;
      this.$emit('input', this.list);
    },
    listSelected(addList) {
      this.list.push({
        ...addList,
        userDefined: true
      });
    },
    removeProductList(item) {
      var list = this.list.find(x => idsAreEqual(x.id, item.id));
      this.list.remove(list);
    },
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    isChanged() {
      return this.startHash !== hashCode(this.list);
    },
    restrictionAndProhibitionLists() {
      return [{ listText: this.getTranslation('I00.00006640', 'Pick from list') + '...' }]
        .pushMany((this.productLists || [])
          .filter(f => !this.list.any(sel => idsAreEqual(f.id, sel.id)))
          .sortBy(f => this.getTranslation(f.listText, 'List text'))
        );
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisRestrictionsAndProhibitionListsEdit'] = this;
  }
};
</script>