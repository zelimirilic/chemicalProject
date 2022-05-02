<template>
	<Tabs class="card pageWrapper" :class="{ disabled: isPickingProduct }" :tabs="tabs" prop="text" :value="selectedTab" @input="$emit('tabChanged', $event)">
		<SmallLoader v-if="!products" />
		<template v-else>
			<DataTable tableClass="border0" :tableData="products" :isSearchResult="true" :hasOuterSearchWord="lastSearchObj.search_word" noHeader noFooter noSearch :perPage="10000">
				<template #head>
					<tr>
						<Th class="prodNo" prop="ArtNo" sort>{{ getTranslation('I00.00002880', 'Product number') }}</Th>
						<Th class="prodName w-25" prop="Name" sort defaultSort>{{ getTranslation('I00.00003590', 'TradeName') }}</Th>
						<Th class="prodNo wp-150" prop="SupplierArtNo" sort>{{ getTranslation('I00.00010730', 'SupplierArtNo') }}</Th>
						<Th class="supplier" prop="SupplierName" sort>{{ getTranslation('I00.00004110', 'SupplierName') }}</Th>
						<Th class="symbols" prop="DangerCodes" sort>{{ getTranslation('I00.00006610', 'DangerSimbols') }}</Th>
						<Th class="phrases" prop="RKods" sort>{{ getTranslation('I00.00014490', 'RPhrase') }}</Th>
						<Th class="iconCol twoIcons" prop="MSDSLinks" sort v-if="appSettings.inventoryPreviewMSDS">{{ getTranslation('I00.00005280', 'SDS') }}</Th>
					</tr>
				</template>
				<template #body="prod">
					<tr :key="prod.ID" :class="{ disabled: findAddedProductId(prod.item), selectedRow: !findAddedProductId(prod.item) && isSelectedProduct(prod) }">
						<td class="prodNo bold">
							<span class="d-block mb-1" v-if="isLocalID(createProdId(prod.item))">&nbsp;</span>
							<div class="d-flex align-items-center">
								<span class="icons smallIcn circle icon-plus" v-tooltip="getTranslation('I00.00010750', 'Add product')" @click="productSelected(prod.item)" v-if="!findAddedProductId(prod.item) && !isSelectedProduct(prod)"></span>
								<span class="icons smallIcn circle icon-check active" v-tooltip="getTranslation('I00.00011100', 'Remove product')" @click="removeProduct(prod.item)" v-else></span>
								<span class="d-block ml-3">{{ prod.item.ArtNo }}</span>
							</div>
						</td>
						<td class="prodName w-25 bold">
							<p v-if="isLocalID(createProdId(prod.item))" class="tag mb-1">{{ getTranslation('I00.00050300', 'Own product') }}</p>
							<p class="mb-0">{{ prod.item.Name }}</p>
						</td>
						<td class="prodNo wp-150">{{ prod.item.SupplierArtNo }}</td>
						<td class="supplier">{{ prod.item.SupplierName }}</td>
						<td class="symbols">
							<img v-for="(sym, ind) in prod.item.DangerCodes" :src="getSymbol(sym)" :alt="getSymbolTitle(sym)" :title="getSymbolTitle(sym)" :key="ind" />
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
		</template>
	</Tabs>
</template>

<script>
import axios from '../../../axiosOld-DONOTUSE';
import { errorDebug, idsAreEqual, isLocalID, parseID } from '../../../libraries/common';
import Tabs from '../../common/tabs/Tabs';
import { parseDate } from '../../../libraries/date';

export default {
	components: {
		Tabs
	},
	props: ['products', 'units', 'tabs', 'selectedTab', 'addedProductIds', 'lastSearchObj', 'isVisible'],
	data() {
		return {
			showTooltip: false,
			prodTooltips: {},
			tooltipProdList: null,
			isPickingProduct: false,
			selectedProductId: null
		};
	},
	methods: {
		pickProduct(prod) {
			this.isPickingProduct = true;
			var defaultUnit = this.units.find(f => idsAreEqual(f.id, { ID: 3, ID_mdbID: 10 })) || this.units.first();
			return this.getProductDetails(prod).then(() => {
				this.isPickingProduct = false;
				return {
					id: {
						id: prod.Id,
						id_mdbID: prod.Id_mdbId,
						clvid: prod.VariantId
					},
					artNo: prod.ArtNo,
					name: prod.Name,
					supplierName: prod.SupplierName,
					isCustomerProduct: this.tabs[this.selectedTab].id === 0,
					usage: { unit: defaultUnit, isSet: true },
					storage: { unit: defaultUnit, isSet: false },
					startDate: parseDate(new Date()),
					productTypes: JSON.parse(prod.ProductTypeIds || '[]').map(f => ({ id: parseID(f) })),
					productGuid: prod.ProductGuid
				};
			});
		},
		getSymbol(sym) {
			return sym.UserDefined ? sym.ImageURL : this.appSettings.imageFolder + sym.PictureName + '_medium.gif';
		},
		getSymbolTitle(sym) {
			return sym.UserDefined ? sym.Phrase : (sym.Description.match('^CLP') || []).any() ? sym.Phrase : sym.FaroKod;
		},
		addProduct(prod) {
			this.pickProduct(prod).then(response => this.$emit('addProduct', response));
		},
		removeProduct(prod) {
			this.$emit('clearPreviouslySelectedProduct');
			this.selectedProductId = null;
			this.$emit('removeProduct', this.findAddedProductId(prod));
		},
		productSelected(prod) {
			this.$emit('clearPreviouslySelectedProduct');
			this.selectedProductId = { Id: prod.Id, Id_mdbId: prod.Id_mdbId, clvid: prod.VariantId };
			this.pickProduct(prod).then(response => this.$emit('productSelected', response));
		},
		getMsdsLink(content) {
			return this.settings.appUrl + content.replace('../', '');
		},
		findAddedProductId(item) {
			return this.addedProductIds ? this.addedProductIds.find(x => x.id === item.Id && x.id_mdbID === item.Id_mdbId && x.clvid === item.VariantId) || null : null;
		},
		isSelectedProduct(prod) {
			return this.selectedProductId && this.selectedProductId.Id === prod.item.Id && this.selectedProductId.Id_mdbId === prod.item.Id_mdbId && this.selectedProductId.clvid === prod.item.VariantId;
		},
		getProductDetails(prod) {
			var selectedNode = this.sideTree.getSelectedDepartment();
			if (this.selectedTab === 0) {
				var url = '/InventoryAmountsAndLocalVariations/' + (this.appSettings.systemUsesLocalVariation ? 'ShowWithVariantsJson' : 'ShowJson');
				return axios
					.post(url, {
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
						fromKit: null
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
	},
	watch: {
		isVisible() {
			if (!this.isVisible) {
				this.selectedProductId = null;
			}
		}
	}
};
</script>
