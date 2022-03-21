<template>
	<Tabs class="card pageWrapper" :class="{ disabled: isPickingProduct }" :tabs="tabs" prop="text" :value="selectedTab" @input="$emit('tabChanged', $event)">
		<SmallLoader v-if="!products" />
		<div v-else>
			<DataTable tableWrapClass="hp-300" tableClass="border0" :tableData="products" noHeader noFooter noSearch :perPage="10000" v-if="products.length !== 0">
				<template #head>
					<tr>
						<Th v-if="addedProductIds" class="iconCol" prop="ArtNo" sort>&nbsp;</Th>
						<Th class="prodNo" prop="ArtNo" sort>{{ getTranslation('I00.00002880', 'Product number') }}</Th>
						<Th class="prodName w-25" prop="Name" sort defaultSort>{{ getTranslation('I00.00003590', 'TradeName') }}</Th>
						<Th class="prodNo" prop="SupplierArtNo" sort>{{ getTranslation('I00.00010730', 'SupplierArtNo') }}</Th>
						<Th class="supplier" prop="SupplierName" sort>{{ getTranslation('I00.00004110', 'SupplierName') }}</Th>
						<Th class="symbols" prop="DangerCodes" sort>{{ getTranslation('I00.00006610', 'DangerSimbols') }}</Th>
						<Th class="phrases" prop="RKods" sort>{{ getTranslation('I00.00014490', 'RPhrase') }}</Th>
						<Th class="iconCol twoIcons" prop="MSDSLinks" sort v-if="appSettings.inventoryPreviewMSDS">{{ getTranslation('I00.00005280', 'SDS') }}</Th>
					</tr>
				</template>
				<template #body="prod">
					<tr @click="productSelected(prod.item)" :key="prod.ID" :class="{ grayBg: findAddedProductId(prod.item) }">
						<td v-if="addedProductIds" class="iconCol">
							<span class="icons icon-plus" @click="addProduct(prod.item)" v-if="!findAddedProductId(prod.item)"></span>
							<span class="icons icon-delete" @click="removeProduct(prod.item)" v-else></span>
						</td>
						<td class="prodNo">
							<p v-if="isLocalID(createProdId(prod.item))" class="mb-1">&nbsp;</p>
							<p class="mb-0">{{ prod.item.ArtNo }}</p>
						</td>
						<td class="prodName w-25">
							<p v-if="isLocalID(createProdId(prod.item))" class="tag mb-1">{{ getTranslation('I00.00050300', 'Own product') }}</p>
							<p class="mb-0">{{ prod.item.Name }}</p>
						</td>
						<td class="prodNo">{{ prod.item.SupplierArtNo }}</td>
						<td class="supplier">{{ prod.item.SupplierName }}</td>
						<td class="symbols">
							<img v-for="(sym, ind) in prod.item.DangerCodes" :src="appSettings.imageFolder + sym.PictureName + '_medium.gif'" :alt="sym.FaroKod" :key="ind" />
						</td>
						<td class="phrases">{{ prod.item.RKods }}</td>
						<td class="iconCol twoIcons">
							<template v-if="appSettings.inventoryPreviewMSDS">
								<a class="p-2" v-for="(link, ind) in prod.item.MsdsObjectLinks" :key="ind" :href="getMsdsLink(link.Url)" target="_blank">
									<span class="flags" :class="link.Flag" :title="link.Language"></span>
								</a>
							</template>
						</td>
					</tr>
				</template>
			</DataTable>
			<p class="p-3" v-if="products.length == 0 && lastSearchObj.search_word">{{ getTranslation('I00.00011840', 'The search returned no results. If you want search on other than the product name or intersolias Prod. no., please click above for more specific search.') }}</p>
		</div>
	</Tabs>
</template>

<script>
import axios from '../../../axiosOld-DONOTUSE';
import { errorDebug, idsAreEqual, isLocalID, parseID } from '../../../libraries/common_v3';
import Tabs from '../../common/tabs/Tabs_v3';
import { parseDate } from '../../../libraries/date_v3';
import SmallLoader from '../../common/loaders/SmallLoader_v3';
import DataTable from '../../common/dataTable/DataTable_v3';

export default {
  components: {
    Tabs,
    SmallLoader,
    DataTable
  },
  props: ['products', 'units', 'tabs', 'selectedTab', 'addedProductIds', 'lastSearchObj'],
  data() {
    return {
      showTooltip: false,
      prodTooltips: {},
      tooltipProdList: null,
      isPickingProduct: false
    };
  },
  methods: {
    pickProduct(prod) {
      this.isPickingProduct = true;
      var defaultUnit = this.units.find(f => idsAreEqual(f.id, { ID: 3, ID_mdbID: 10 })) || this.units.first();
      return this.getProductDetails(prod)
        .then(() => {
          this.isPickingProduct = false;
          return {
            id: {
              id: prod.Id,
              id_mdbID: prod.Id_mdbId,
              clvid: prod.VariantId,
            },
            artNo: prod.ArtNo,
            name: prod.Name,
            supplierName: prod.SupplierName,
            isCustomerProduct: this.tabs[this.selectedTab].id === 0,
            usage: { unit: defaultUnit, isSet: true },
            storage: { unit: defaultUnit, isSet: false },
            startDate: parseDate(new Date()),
            productTypes: JSON.parse(prod.ProductTypeIds || '[]').map(f => ({ id: parseID(f) })),
            productGuid: prod.ProductGuid,
          };
        });
    },
    addProduct(prod) {
      this.pickProduct(prod)
        .then((response) => this.$emit('addProduct', response));
    },
    removeProduct(prod) {
      this.$emit('removeProduct', this.findAddedProductId(prod));
    },
    productSelected(prod) {
      if (!this.addedProductIds) {
        this.pickProduct(prod)
          .then((response) => this.$emit('productSelected', response));
      }
    },
    getMsdsLink(content) {
      return this.settings.appUrl + content.replace('../', '');
    },
    findAddedProductId(item) {
      return this.addedProductIds ? this.addedProductIds.find(x => x.id === item.Id && x.id_mdbID === item.Id_mdbId && x.clvid === item.VariantId) : null;
    },
    getProductDetails(prod) {
      var selectedNode = this.sideTree.getSelectedDepartment();
      if (this.selectedTab === 0) {
        var url = '/InventoryAmountsAndLocalVariations/' + (this.appSettings.systemUsesLocalVariation ? "ShowWithVariantsJson" : "ShowJson");
        return axios.post(url,
          {
            prod_id: prod.Id,
            prodid_mdbID: prod.Id_mdbId,
            prod_variation_id: prod.VariantId,
            orgid: selectedNode ? selectedNode.orgID.id : 0,
            org_mdbid: selectedNode ? selectedNode.orgID.id_mdbID : 0,
            close_on_add: null,
            hide_amounts_ui: null,
            inventory_add: null,
            call_from_local_info: null,
            min_date: null,
            year: null,
            add_substitution: null,
            isCustomerProduct: true,
            productTypes: null,
            fromKit: null,
          })
          .then(response => response.data)
          .catch(errorDebug);
      } else {
        return Promise.resolve({
          ...prod,
          isCustomerProduct: false,
          variants: this.appSettings.systemUsesLocalVariation ? [] : null
        });
      }
    },
    createProdId(prod) {
      return { id: prod.Id, id_mdbID: prod.Id_mdbId, clvid: prod.VariantId };
    },
    isLocalID: isLocalID
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisInventoryProducts'] = this;
  }
}
</script>