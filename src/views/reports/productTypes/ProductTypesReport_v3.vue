<template>
	<SmallLoader v-if="!data" />
	<ProductTypesList :data="data.items" :orgId="getOrgId(data)" :title="data.department" :perPage="perPage" v-else />
</template>

<script>
import axios from '../../../axios';
import { errorDebug, camelCaseObj } from '../../../libraries/common_v3';
import ProductTypesList from '../../../components/reports/productTypes/ProductTypesList_v3';
import SmallLoader from '../../../components/common/loaders/SmallLoader_v3'

export default {
  name: 'ProductTypesReport',
  components: {
    ProductTypesList,
    SmallLoader
  },
  data() {
    return {
      data: null,
      usages: [],
      storages: [],
      perPage: 15,
    };
  },
  methods: {
    loadData() {
      this.data = null;
      var node = window.SideTree.GetSelectedNode();

      return axios
        .cancelAll()
        .postWithCancelToken('/OrgProdListProductTypes/GetProductTypes', { orgid: node.KeyID, org_mdbid: node.KeyID_mdbID })
        .then(response => {
          if (response) {
            this.data = response.data;
          }
        })
        .catch(errorDebug);
    },
    getOrgId(data) {
      var orgId = camelCaseObj(data.orgId);
      return (orgId.id + '_' + orgId.id_mdbID);
    }
  },
  mounted() {
    this.loadData();
  },
  beforeDestroy() {
    axios.cancelAll();
  }
};
</script>