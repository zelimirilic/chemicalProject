<template>
	<div>
		<SmallLoader v-if="!value || isLoading" />
		<template v-else>
			<label class="form-control-label">{{ text }}</label>
			<DataTable :class="{ readOnly: !appSettings.permissions.organizationSpecificField.full }" :tableData="value || []" noHeader noSearch noFooter>
				<template #head>
					<tr>
						<th class="w-25">{{ getTranslation('I00.00020000', 'Name') }}</th>
						<th class="w-75">{{ getTranslation('I00.00005460', 'Value') }}</th>
					</tr>
				</template>
				<template #body="{ item, index }">
					<OwnFieldValueRow :value="item" :isReview="isReview" @input="itemChanged(index, $event)" ref="fields" />
				</template>
			</DataTable>
		</template>
	</div>
</template>

<script>
import { errorDebug, hashCode } from '../../../libraries/common';

import axios from '../../../axios';
import OwnFieldValueRow from './ownFields/OwnFieldValueRow.vue';

export default {
  components: { OwnFieldValueRow },
  props: ['dat', 'text', 'value', 'isReview'],
  data(self) {
    return {
      previusProduct: self.dat.product,
      previusUsagePlace: self.dat.usagePlace,
      isLoading: false,
      notTracked: { isChanged: undefined, approved: undefined, approvedBy: undefined, modifiedBy: undefined, },
      isValid: true,
    };
  },
  methods: {
    loadData() {
      if (this.dat.product.id && (this.dat.usagePlace || {}).orgID) {
        this.isLoading = true;
        return axios.postWithCancelToken('/ProductPage/GetOwnFieldsLists', { productId: this.dat.product.id, orgID: this.dat.usagePlace.orgID })
          .then(response => {
            var data = response.data
              .map(f => {
                var res = hashCode({ ...f, ...this.notTracked, });
                var previousValue = (this.value || []).find(g => g.isChanged && g.fieldId === f.fieldId);
                return {
                  ...f,
                  ...(previousValue ? Object.keys(this.notTracked).reduce((acc, key) => { acc[key] = previousValue[key]; return acc; }, {}) : {}),
                  originalValue: () => f.value,
                  value: (previousValue || {}).value || f.value,
                  isChanged: !!previousValue,
                  hashCode: () => res,
                };
              });
            this.$emit('input', data);
          }).catch(errorDebug)
          .then(() => this.isLoading = false);
      } else this.$emit('input', []);
    },
    itemChanged(ind, event) {
      var value = [...this.value];
      value[ind] = event;
      this.$emit('input', value);
    },
  },
  computed: {
    productAndUsagePlaceIdHash() {
      return hashCode([this.dat.product.id || 0, (this.dat.usagePlace || {}).orgID || 0]);
    },
    changedFields() {
      return (this.value || []).filter(f => f.isChanged);
    },
  },
  watch: {
    productAndUsagePlaceIdHash() {
      var isOrgChanged = (this.dat.usagePlace || {}).orgID !== (this.previusUsagePlace || {}).orgID;
      if (this.dat.product.id !== this.previusProduct.id || isOrgChanged) {
        var promise = Promise.resolve();
        if ((!this.dat.product.id || isOrgChanged) && this.changedFields.any())
          promise = this.confirm(this.getTranslation('I00.00044280', 'Warning'), this.getTranslation('I00.00047510', 'You will loose your changes if you continue'))
            .then(() => isOrgChanged ? this.$emit('input', null) : null);

        promise.then(() => {
          this.loadData();
          this.previusProduct = this.dat.product;
          this.previusUsagePlace = this.dat.usagePlace;
        }).catch(() => {
          this.$set(this.dat.product, 'id', this.previusProduct.id);
          this.$set(this.dat.product, 'name', this.previusProduct.name);
          this.$set(this.dat.usagePlace, 'orgID', this.previusUsagePlace.orgID);
        });
      }
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisOwnFields'] = this;
    if ((this.isReview && this.dat.applicationRequest && !this.dat.applicationRequest.closed) || !this.value)
      this.loadData();

    this.getTranslation('I00.00044280', 'Warning');
    this.getTranslation('I00.00047510', 'You will loose your changes if you continue');
  }
}
</script>