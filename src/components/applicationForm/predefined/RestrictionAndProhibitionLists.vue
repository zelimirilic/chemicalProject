<template>
	<div class="form-group mb-0">
		<label class="form-control-label">{{ text }}</label>
		<SmallLoader v-if="showLoader" />
		<DataTable :tableData="restrictionLists" noHeader noSearch noFooter v-else>
			<template #head>
				<tr>
					<th>{{ getTranslation('I00.00004130', 'Lists') }}</th>
					<th>{{ getTranslation('I00.00006070', 'Substances') }}</th>
					<th v-if="hasSunsetDate" class="dateCol">{{ getTranslation('I00.00049290', 'Sunset date') }}</th>
				</tr>
			</template>
			<template #body="{ item }">
				<tr>
					<td>{{ getTranslation(item.listText, 'Restriction list name') }}</td>
					<td>{{ item.substances || '-' }}</td>
					<td v-if="hasSunsetDate" class="dateCol">{{ item.sunsetDate }}</td>
				</tr>
			</template>
		</DataTable>
	</div>
</template>

<script>
import { errorDebug, hashCode } from '../../../libraries/common';
import axios from '../../../axios';
import { isLocalProduct } from '../../../libraries/product';

export default {
  props: ['dat', 'text'],
  data() {
    return {
      restrictionLists: null,
      hasSunsetDate: false,
      showLoader: false
    };
  },
  methods: {
    getLists() {
      if (this.dat.product.id) {
        this.showLoader = true;
        return axios.postWithCancelToken('/ProductPage/GetLists', { productId: this.dat.product.id })
          .then(response => {
            this.restrictionLists = response.data.filter(f => !f.isExcluded);
            this.hasSunsetDate = this.restrictionLists.any(f => f.sunsetDate != null);
            this.showLoader = false;
          })
          .catch(errorDebug);
      } else this.restrictionLists = [];
    },
    isLocalProduct,
  },
  watch: {
    productIdHash() {
      this.getLists();
    },
  },
  computed: {
    productIdHash() {
      return this.dat.product.id ? hashCode(this.dat.product.id) : 0;
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisRestrictionsAndProhibitionLists'] = this;
    this.getLists();
  }
}
</script>