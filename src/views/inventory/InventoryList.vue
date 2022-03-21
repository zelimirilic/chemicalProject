<template>
	<MainLoader v-if="!inventoryData" />
	<div v-else>
		<MainTitle class="card pageWrapper" :class="{ readOnly: locked }" :text="getTranslation('I00.00003910', 'Invenotory list')">
			<template #linkSlot>
				<div class="d-flex align-items-center actionLink">
					<div class="mr-1" :class="{ disabled: isSaveEnabled }" @click="toggleLockDepartment(!locked)" v-if="writeRights && appSettings.inventoryYearLock && appSettings.permissions.inventory.full">
						<ButtonIcon iconClass="icon-lock" v-tooltip="getTranslation('I00.00054750', 'Lock')" v-if="!locked" />
						<ButtonIcon iconClass="icon-unlock" v-tooltip="getTranslation('I00.00054760', 'Unlock')" v-else />
					</div>
					<ButtonIcon iconClass="icon-copy" :class="{ disabled: !areItemsSelected || !isCurrentYear }" v-tooltip="getTranslation('I00.00016270', 'Copy')" @click="showCopyModal = true" />
					<ButtonIcon iconClass="icon-move" :class="{ disabled: !areItemsSelected || locked || !isCurrentYear }" v-tooltip="getTranslation('I00.00010190', 'Move')" @click="showMoveModal = true" v-if="writeRights" />
					<ButtonIcon iconClass="icon-trash" :class="{ disabled: !areItemsSelected || locked }" @click="deleteCurrentOrOldYears" v-if="writeRights" />
					<ButtonIconAdd :class="{ disabled: locked }" @click="showAddProductModal = true" v-if="writeRights" />
					<ButtonIconSave :class="{ disabled: !isSaveEnabled }" v-tooltip="getTranslation('I00.00004810', 'Save')" @click="save" v-if="writeRights" />
				</div>
			</template>
			<SmallLoader v-if="isSaving" />
			<div class="filterSpecial form-inline borderB px-4 py-12">
				<p class="title mr-3 mb-0 pr-3">
					<span>{{ getTranslation('I00.00019660', 'Modified') }}:</span>
					{{ lastUserData == null ? '' : lastUserData.user + ', ' + lastUserData.shortDate }}
				</p>
				<SelectGroup class="form-inline" :items="years" :value="getYear(selectedYear)" @input="yearChanged($event)" :text="getTranslation('I00.00022850', 'Active year')" compareByHash />
				<CheckBoxGroup class="ml-3" :class="{ disabled: this.disableInactiveProducts }" v-model="inactiveProducts" :text="getTranslation('I00.00028620', 'Show inactive product')" @input="toggleCheck()">{{ getTranslation('I00.00028620', 'Show inactive product') }}</CheckBoxGroup>
			</div>
			<DataTable :class="{ readOnly: !writeRights }" :tableData="inventoryData" :perPage.sync="perPage" :title="getTranslation('I00.00003910', 'Invenotory list')" excelTitle noHeader v-show="!isSaving">
				<template #head>
					<tr>
						<th class="iconCol" v-if="writeRights"><CheckBoxGroup :value="areAllSelected" @input="selectAll" alwaysOn /></th>
						<Th class="prodNo" prop="artNo" sort export>{{ getTranslation('I00.00002880', 'ArticleNo') }}</Th>
						<Th class="prodName w-25" prop="artName" sort export defaultSort>{{ getTranslation('I00.00003590', 'ProductName') }}</Th>
						<Th class="w-15" prop="supplierName" sort export>{{ getTranslation('I00.00004110', 'SupplierName') }}</Th>
						<Th class="iconCol" sort="usageIsSet" :export="boolToPlus('usageIsSet')"></Th>
						<Th class="consume" :prop="getValueUnit('usage')" sort="usage" export="usage">{{ getTranslation('I00.00003420', 'Annual Consumption') }}</Th>
						<Th :export="(f) => getUnit(f.usageUnit).shortName" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
						<Th class="iconCol" sort="storageIsSet" :export="boolToPlus('storageIsSet')"></Th>
						<Th class="consume" :prop="getValueUnit('storage')" sort="storage" export="storage">{{ getTranslation('I00.00004090', 'Maximum Stock') }}</Th>
						<Th :export="(f) => getUnit(f.storageUnit).shortName" v-show="false">{{ getTranslation('I00.00027360', 'Unit') }}</Th>
						<Th class="dateCol" :prop="(f) => parseDate(f.startDate) || '-'" sort export>{{ getTranslation('I00.00017670', 'StartDate') }}</Th>
						<Th class="dateCol" :prop="(f) => parseDate(f.endDate) || '-'" sort export>{{ getTranslation('I00.00022030', 'EndDate') }}</Th>
					</tr>
				</template>
				<template #body="prod">
					<tr :class="{ inactive: prod.item.deleted }" :key="idExtendoString(createProdId(prod.item))">
						<td class="iconCol" v-if="writeRights"><CheckBoxGroup v-if="!prod.item.deleted" :value="selects.indexOf(prod.item) !== -1" @input="selects.toggle(prod.item, $event)" alwaysOn /></td>
						<td class="prodNo">
							<p v-if="isLocalID(createProdId(prod.item))" class="mb-1">&nbsp;</p>
							<p class="mb-0">
								<router-link :to="{ name: 'product', params: { id: idToSlashedString(createProdId(prod.item)) } }">
									<span>{{ prod.item.artNo }}</span>
								</router-link>
							</p>
						</td>
						<td class="prodName w-25">
							<p v-if="isLocalID(createProdId(prod.item))" class="tag mb-1">{{ getTranslation('I00.00050300', 'Own product') }}</p>
							<p class="mb-0">
								<router-link :to="{ name: 'product', params: { id: idToSlashedString(createProdId(prod.item)) } }">{{ prod.item.artName }}</router-link>
							</p>
						</td>
						<td class="w-15">{{ prod.item.supplierName }}</td>
						<td class="iconCol"><CheckBoxGroup v-model="prod.item.usageIsSet" @input="setChange(prod, true)" /></td>
						<td class="consume">
							<div class="specialType input-group">
								<Number v-model="prod.item.usage" required:prod.item.usageIsSet />
								<Select :items="units" prop="shortName" :value="getUnit(prod.item.usageUnit)" @input="setUsageUnit(prod.item, $event)" />
							</div>
						</td>
						<td class="iconCol"><CheckBoxGroup v-model="prod.item.storageIsSet" @input="setChange(prod, false)" /></td>
						<td class="consume">
							<div class="specialType input-group">
								<Number v-model="prod.item.storage" />
								<Select :items="units" prop="shortName" :value="getUnit(prod.item.storageUnit)" @input="setStorageUnit(prod.item, $event)" />
							</div>
						</td>
						<td class="dateCol">
							<div class="d-flex flex-row align-items-center">
								<Date :value="prod.item.startDate" @input="prod.item.startDate = $event" :minDate="minDate" :maxDate="maxDate" required />
							</div>
						</td>
						<td class="dateCol">
							<div class="d-flex flex-row align-items-center">
								<Date v-if="prod.item.deleted" :value="prod.item.endDate" @input="prod.item.endDate = $event" :minDate="prod.item.startDate" :maxDate="new Date()" required />
							</div>
						</td>
					</tr>
				</template>
			</DataTable>
		</MainTitle>
		<ModalDialog additional-class="w-80" :title="getTranslation('I00.00049020', 'Add to inventory')" :withFooter="true" @close="showAddProductModal = false" v-show="showAddProductModal">
			<InventoryAdd :minDate="minDate" :maxDate="maxDate" @productPicked="productPicked" @addProduct="addProduct" @productRemoved="removeProduct" @cancel="showAddProductModal = false" :withFooter="true" :addedProductsIds="getAddedProductIds()" withConsumption withProductType :validations="validations" :isVisible="showAddProductModal" :okButtonText="getTranslation('I00.00054510', 'Add & close')" />
		</ModalDialog>
		<ModalDialog additional-class="w-50" :title="getTranslation('I00.00027220', 'Move products to other department.')" @close="showMoveModal = false" v-if="showMoveModal">
			<InventoryMove @input="moveProducts" @cancel="showMoveModal = false" />
		</ModalDialog>
		<ModalDialog additional-class="w-50" :title="getTranslation('I00.00016230', 'Copy products to other department.')" @close="showCopyModal = false" v-if="showCopyModal">
			<InventoryMove copy @input="copyProducts" @cancel="showCopyModal = false" />
		</ModalDialog>
		<ModalDialog additional-class="w-40" :title="getTranslation('I00.00027530', 'ChangeInventory')" :withFooter="true" @close="showRemoveModal = false" v-if="showRemoveModal">
			<div class="card-body">
				<DateGroup v-model="display_end_date" :value="maxDate" :text="getTranslation('I00.00033030', 'Please, set end date')" :minDate="minDate" :maxDate="maxDate" />
				<div class="custom-check radio mt-4">
					<input type="radio" class="custom-input" name="save_change" id="save_no_change" @value="false" @input="delete_no_change = false" />
					<label class="custom-label" for="save_no_change">{{ this.getTranslation('I00.00027550', 'Set end date and remove products from inventory for coming years') }}</label>
				</div>
				<div class="custom-check radio my-2">
					<input type="radio" class="custom-input" name="save_change" id="save_change" @value="true" @input="delete_no_change = true" checked="true" />
					<label class="custom-label" for="save_change">{{ this.getTranslation('I00.00027560', 'Set end date for current inventory items and leave products for coming year(s) in inventory.') }}</label>
				</div>
			</div>
			<div class="card-footer text-right">
				<ButtonCancel @click="cancelRemoveModal()" />
				<Button class="primary" @click="deleteSelected">{{ getTranslation('I00.00018220', 'Ok') }}</Button>
			</div>
		</ModalDialog>
	</div>
</template>

<script>
import axios from '../../axios';
import { errorDebug, camelCaseObj, hashCode, idToString, idToSlashedString, idsAreEqual, ticker, isLocalID, idExtendoString } from '../../libraries/common';
import { parseDate } from '../../libraries/date';
import MainTitle from '../../components/common/cardBox/MainTitle';
import InventoryAdd from '../../components/inventory/InventoryAdd';
import InventoryMove from '../../components/inventory/InventoryMove';
import ButtonIconAdd from '../../components/common/button/buttonIcon/ButtonIconAdd';
import { inventoryValidators, convertProductForSave, convertProductForDelete } from '../../libraries/inventory';
import { logOut } from '../../libraries/vue';

export default {
  name: 'InventoryList',
  components: {
    MainTitle,
    InventoryAdd,
    InventoryMove,
    ButtonIconAdd
  },
  data() {
    return {
      inventoryData: null,
      units: [],
      selects: [],
      $modelValidators: [],
      isSaving: false,
      showAddProductModal: false,
      showConfirmModal: false,
      perPage: 20,
      showMoveModal: false,
      showCopyModal: false,
      showRemoveModal: false,
      locked: null,
      inventoryHash: 0,
      lastUserData: null,
      years: [],
      selectedYear: new Date().getFullYear(),
      inactiveProducts: false,
      disableInactiveProducts: false,
      inactiveProductsCurrentYear: [],
      removeOptions: [{ "option": this.getTranslation("I00.00027550", ""), "value": 1 }, { "option": this.getTranslation("I00.00027560", ""), "value": 0 }],
      delete_no_change: true,
      display_end_date: parseDate("2020-12-31"),
      minDate: parseDate(new Date().getFullYear() + "-01-01"),
      maxDate: parseDate(new Date().getFullYear() + "-12-31"),
      usageChange: null,
    };
  },
  watch: {
    isSaveEnabled() {
      this.$store.getters.state.saveStatus = this.isSaveEnabled;
    }
  },
  methods: {
    getValueUnit(prop) {
      return product => `${product[prop] || ''}${this.getUnit(product[prop + 'Unit']).shortName}`;
    },
    getAddedProductIds() {
      return this.inventoryData ? this.inventoryData.map(x => ({ id: x.productID, id_mdbID: x.productID_mdbID, clvid: x.variantID })) : [];
    },
    removeProduct() {
      this.selectedProduct = null;
      this.$emit('input', {});
    },
    logOut: logOut,
    nodeSelected(node) {
      ticker.clearMessages();
      this.inventoryData = null;
      this.selects = [];

      var post;
      if (this.isCurrentYear)
        post = axios.post('/Inventory/ListJson', { organisation: { orgID: node.orgID, nodePath: node.nodePath }, show_inactive_products: this.inactiveProducts });
      else
        post = axios.post('/InventoryArchive/ListJson', { organisation: { orgID: node.orgID, nodePath: node.nodePath }, year: this.selectedYear });

      post.then(response => {
        var data = camelCaseObj(JSON.parse(response.data));
        this.inventoryData = data.inventoryData
          .map(f => ({
            ...f,
            startDate: new Date(f.startDate)
          }));
        this.inventoryData.forEach(f => { var hash = hashCode(f); this.$set(f, 'hashCode', () => hash); });
        this.changeInventoryHash(this.inventoryData);
        this.units = [{ shortName: "-" }, ...data.units];
        this.locked = data.locked;
        this.lastUserData = data.lastUserData;
      })
        .catch(errorDebug);

      if (!this.writeRights) {
        ticker.addWarningMessage(this.getTranslation('I00.00016210', 'You don\'t have enough permissions. This page is read-only.'));
      }
    },
    deleteCurrentOrOldYears() {
      this.isCurrentYear ? this.deleteSelected() : this.deleteSelectedModal();
    },
    setUsageUnit(item, unit) {
      item.usageUnit = unit.shortName;
      item.usageUnitID = unit.id.id;
      item.usageUnitID_mdbID = unit.id.id_mdbID;
    },
    setStorageUnit(item, unit) {
      item.storageUnit = unit.shortName;
      item.storageUnitID = unit.id.id;
      item.storageUnitID_mdbID = unit.id.id_mdbID;
    },
    getUnit(unit) {
      return this.units.find(f => f.shortName === unit) || this.units.first();
    },
    getYear(year) {
      if (this.years)
        return this.years.find(f => f === year) || this.years.first();
    },
    checkProductsHaveRaOnDepartment(prodIds, nod) {
      return axios.post('/Inventory/ProductsHaveRaOnDepartment', { productIds: prodIds, orgId: nod.orgID.id, orgId_mdbId: nod.orgID.id_mdbID })
        .then(response => {
          if (response.data) {
            return this.confirm(this.getTranslation('I00.00038820', 'Warning'), this.getTranslation('I00.00039700', 'Warning text'));
          }
        });
    },
    fillYears() {
      return axios.post('/InventoryArchive/GetYears')
        .then(response => {
          if (response.data) {
            this.years = response.data.years;
          }
        });
    },
    cancelRemoveModal() {
      if (this.usageChange)
        this.selects[this.selects.length - 1].usageIsSet = true;
      else
        this.selects[this.selects.length - 1].storageIsSet = true;

      this.usageChange = null;
      this.$delete(this.selects, this.selects.length - 1);
      this.showRemoveModal = false;
    },
    deleteSelectedModal() {
      this.delete_no_change = true;

      var selectedDates = this.selects
        .map(f => (
          new Date(f.startDate)
        ));

      this.minDate = new Date(Math.max.apply(null, selectedDates));

      this.showRemoveModal = true
    },
    deleteSelected() {
      this.inventoryData = this.inventoryData.filter(f => !f.isNew);
      this.selects = this.selects.filter(f => !f.isNew);
      var prodIds = this.selects.map(f => this.createProdId(f));

      if (prodIds.length) {
        var nod = this.sideTree.getSelectedDepartment();
        if (this.isCurrentYear) {
          this.confirm(this.getTranslation('I00.00019210', 'Remove product from inventory'), this.getTranslation('I00.00016350', 'Are you sure you want to remove selected product(s) from inventory?'))
            .then(() => {
              this.isSaving = true;
              return this.checkProductsHaveRaOnDepartment(prodIds, nod);
            })
            .then(() => {
              axios.post('/Inventory/Delete', { deleted_ids: prodIds.map(f => idToString(f)), orgId: nod.orgID.id, orgId_mdbId: nod.orgID.id_mdbID })
                .then(response => {
                  this.isSaving = false;
                  if (response.data.status) {
                    if (this.inactiveProducts)
                      this.inventoryData.filter(f => this.selects.includes(f)).forEach(x => {
                        x.endDate = new Date();
                        x.deleted = true
                      })
                    else {
                      this.inventoryData = this.inventoryData.filter(f => !this.selects.includes(f));
                    }

                    this.selects = [];

                  } else {
                    ticker.addErrorMessage(response.data.message);
                  }
                })
            })
            .catch(() => {
              this.cancelRemoveModal();
              this.errorDebug
            });
        } else {
          var ids_for_delete = [];
          var org_path_for_save = this.sideTree.getSelectedDepartment().nodePath;
          for (var i = 0; i < this.selects.length; i++) {
            var product = this.selects[i];
            var deleteItem = convertProductForDelete(product, this.display_end_date, this.selectedYear, org_path_for_save);
            ids_for_delete.push(deleteItem);
          }
          axios.post('/InventoryArchive/Delete', { delete_items: ids_for_delete, orgId: nod.orgID.id, orgId_mdbId: nod.orgID.id_mdbID, keep_product_in_following_inventories: this.delete_no_change })
            .then(response => {
              this.isSaving = false;
              if (response.data) {
                this.inventoryData.filter(f => this.selects.includes(f)).forEach(x => {
                  x.endDate = this.display_end_date;
                  x.deleted = true
                });

                this.selects = [];
                this.showRemoveModal = false;
              } else {
                ticker.addErrorMessage(response.data.message);
              }
            })
            .catch(this.errorDebug);
        }
      }
    },
    save() {
      this.isSaving = true;
      var nod = this.sideTree.getSelectedDepartment();
      var changedItems = this.editedItems;
      var saveData = changedItems
        .map(f => ({
          ...f,
          usageUnit: [f.usageUnitID, f.usageUnitID_mdbID].filter(f => f).join(':'),
          storageUnit: [f.storageUnitID, f.storageUnitID_mdbID].filter(f => f).join(':'),
          productTypes: (f.productTypes || []).map(g => ({ item: g.id, deleted: g.deleted })),
          isChanged: true
        }));

      var post;
      if (this.isCurrentYear)
        post = axios.post('/Inventory/Save', { archiveItems: saveData, orgId: nod.orgID.id, orgId_mdbId: nod.orgID.id_mdbID, orgPathForSave: nod.nodePath, year: new Date().getFullYear() });
      else
        post = axios.post('/InventoryArchive/Save', { archiveItems: saveData, orgId: nod.orgID.id, orgId_mdbId: nod.orgID.id_mdbID, orgPathForSave: nod.nodePath, year: this.selectedYear }, true);

      post.then(() => {
        changedItems.forEach(f => {
          f.isNew = false;
          var hash = hashCode(f);
          f.deleted = f.deleted ? !f.restore : false;
          this.$set(f, 'hashCode', () => hash)
        });

        this.selects = [];
        this.isSaving = false;
        this.inventoryData.__ob__.dep.notify();
        this.changeInventoryHash(this.inventoryData);
      }).catch(this.errorDebug);
    },
    addProduct(product) {
      var invProd = convertProductForSave(product);
      invProd.usageUnit = product.usage.unit.shortName;
      invProd.storageUnit = product.storage.unit.shortName;
      this.inventoryData.push(invProd);
      ticker.addInfoMessage(this.getTranslation('I00.00053950', 'Unsaved data'));
    },
    productPicked(product) {
      this.addProduct(product);
      this.showAddProductModal = false;
    },
    moveProducts(event) {
      this.showMoveModal = false;
      var fromOrg = this.sideTree.getSelectedDepartment().orgID;
      var toOrg = { id: event.toDepartmentId, id_mdbID: event.toDepartmentId_mdbID }
      var selectedCheckboxes = this.selects.map(f => idToString(this.createProdId(f))).join(',') + ',';
      this.isSaving = true;
      axios.post('/InventoryCopy/Submit', { selectedKeyID: fromOrg.id, selectedKeyID_mdbID: fromOrg.id_mdbID, ...event, selectedCheckboxes })
        .then(result => {
          this.inventoryData = this.inventoryData.filter(f => !this.selects.includes(f));
          this.selects = [];
          if (!result.data.areAllProductsCopied) {
            var substitution_move_message = this.getTranslation('I00.00043890', 'Some products are not moved because of existing substitution work on destination department.');
            ticker.addErrorMessage(substitution_move_message + ': ' + result.data.productNames.join(', '));
          }
          if (!result.data.areAllESComplianceCopied) {
            var es_compliance_copy_message = this.getTranslation('I00.00047400', 'Exposure scenario decisions for below products already had a decision for destination department. Decision was not copied/moved.');
            ticker.addErrorMessage(es_compliance_copy_message + ': ' + result.data.productNamesCompliance.join(', '));
          }
          this.changeInventoryHash(this.inventoryData);
          var node = this.sideTree.getAllData().find(f => idsAreEqual(f.item.orgID, toOrg));
          this.$store.getters.treeStateClick(node);
          this.nodeSelected(node.item);

        })
        .catch(errorDebug)
        .then(() => this.isSaving = false);
    },
    copyProducts(event) {
      this.showCopyModal = false;
      var fromOrg = this.sideTree.getSelectedDepartment().orgID;
      var selectedCheckboxes = this.selects.map(f => idToString(this.createProdId(f))).join(',') + ',';
      this.isSaving = true;
      axios.post('/InventoryCopy/Submit', { selectedKeyID: fromOrg.id, selectedKeyID_mdbID: fromOrg.id_mdbID, ...event, selectedCheckboxes })
        .then(result => {
          this.selects = [];
          if (!result.data.areAllProductsCopied) {
            var substitution_copy_message = this.getTranslation('I00.00043900', 'Some substitutes of products are not copied because of existing substitution work on destination department.');
            ticker.addErrorMessage(substitution_copy_message + ': ' + result.data.productNames.join(', '));
          }
          if (!result.data.areAllESComplianceCopied) {
            var es_compliance_copy_message = this.getTranslation('I00.00047400', 'Exposure scenario decisions for below products already had a decision for destination department. Decision was not copied/moved.');
            ticker.addErrorMessage(es_compliance_copy_message + ': ' + result.data.productNamesCompliance.join(', '));
          }
        })
        .catch(errorDebug)
        .then(() => this.isSaving = false);
    },
    setChange(prod, usageChange) {
      if (!prod.item.deleted) {
        if (!prod.item.usageIsSet && !prod.item.storageIsSet) {
          this.selects.push(prod.item);
          this.usageChange = usageChange;
          this.deleteCurrentOrOldYears()
        }
      }
      else {
        if (prod.item.usageIsSet || prod.item.storageIsSet) {
          prod.item.restore = true;
          this.selects.push(prod.item);
        }
      }
    },
    toggleLockDepartment(locked) {
      var year = new Date().getFullYear();
      var title = locked ? this.getTranslation('I00.00054750', 'Lock') : this.getTranslation('I00.00054760', 'Unlock');
      var message = locked ? this.getTranslation('I00.00030870', 'Are you sure you want to complete and lock the inventory for this department for year') : this.getTranslation('I00.00030880', 'Are you sure you want to unlock the inventory for this department for year');
      this.confirm(title, message + ' ' + year)
        .then(() => {
          var orgID = this.sideTree.getSelectedDepartment().orgID;
          this.isSaving = true;
          axios.post('./Inventory/LockDepartment', { year, locked, orgID: orgID.id, orgID_mdbID: orgID.id_mdbID })
            .then(() => this.locked = locked)
            .catch(errorDebug)
            .then(() => this.isSaving = false);
        }).catch(errorDebug);
    },
    toggleCheck() {
      if (this.isCurrentYear)
        this.inactiveProductsCurrentYear = this.inactiveProducts;

      this.yearChanged(this.selectedYear)
    },
    selectAll() {
      if (!this.areAllSelected)
        this.selects = this.inventoryData.map(f => f);
      else
        this.selects = [];
    },
    errorDebug(response) {
      this.isSaving = false;
      errorDebug(response);
    },
    createProdId(prod) {
      return { id: prod.productID, id_mdbID: prod.productID_mdbID, clvid: prod.variantID, itemid: prod.itemID };
    },
    boolToPlus(prop) {
      return item => item[prop] ? '+' : '';
    },
    changeInventoryHash(inventoryData) {
      this.inventoryHash = hashCode(inventoryData);
    },
    yearChanged(event) {
      this.selectedYear = (this.years.find(f => f === event));

      if (!this.isCurrentYear) {
        this.disableInactiveProducts = true;
        this.inactiveProductsCurrentYear = this.inactiveProducts;
        this.inactiveProducts = true;
        this.maxDate = parseDate(this.selectedYear + "-12-31");
        this.minDate = parseDate(this.selectedYear + "-01-01");
        this.display_end_date = this.maxDate;
      }
      else {
        this.disableInactiveProducts = false;
        this.inactiveProducts = this.inactiveProductsCurrentYear;
        this.maxDate = parseDate(this.selectedYear + "-12-31");
        this.minDate = parseDate(this.selectedYear + "-01-01");
      }

      if (this.sideTree.getSelectedDepartment()) {
        this.nodeSelected(this.sideTree.getSelectedDepartment());
      }
    },
    parseDate,
    idToString,
    idToSlashedString,
    idExtendoString,
    isLocalID: isLocalID
  },
  computed: {
    currentInventoryHash() {
      return hashCode(this.inventoryData);
    },
    inventoryIsChanged() {
      return this.inventoryHash !== this.currentInventoryHash;
    },
    areItemsSelected() {
      return this.selects.any();
    },
    editedItems() {
      return (this.inventoryData || []).filter(f => !f.hashCode || f.hashCode() !== hashCode(f));
    },
    isSaveEnabled() {
      return this.isModelValid && this.editedItems.any();
    },
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    areAllSelected() {
      return this.selects.length !== 0 && this.selects.length === this.inventoryData.length
    },
    validations() {
      return selectedProduct => [
        {
          fnc: () => !this.inventoryData.length || this.inventoryData.all(f => !idsAreEqual(this.createProdId(f), selectedProduct.id)),
          message: () => this.getTranslation('I00.00012100', 'Product is already in inventory')
        },
        inventoryValidators.isSet(selectedProduct),
        inventoryValidators.isNumber(selectedProduct),
      ];
    },
    writeRights() {
      return this.hasWriteRights() && this.appSettings.permissions.inventory.full;
    },
    isCurrentYear() {
      return this.selectedYear == new Date().getFullYear();
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisInventory'] = this;
    if (this.sideTree.getSelectedDepartment()) {
      this.nodeSelected(this.sideTree.getSelectedDepartment());
    }

    this.getTranslation('I00.00039700', 'Warning text');
    this.getTranslation('I00.00038820', 'Warning');
    this.getTranslation('I00.00012100', 'Product is already in inventory');
    this.getTranslation('I00.00019210', 'Remove product from inventory');
    this.getTranslation('I00.00016350', 'Are you sure you want to remove selected product(s) from inventory?');
    this.getTranslation('I00.00030870', 'Are you sure you want to complete and lock the inventory for this department for year');
    this.getTranslation('I00.00030880', 'Are you sure you want to unlock the inventory for this department for year');
    this.fillYears();
    this.getTranslation('I00.00012130', 'All');
  },
  beforeDestroy() {
    axios.cancelAll();
    ticker.clearMessages();
  },
  beforeRouteLeave(to, from, next) {
    this.$store.state.saveStatus = false;
    if (this.inventoryData && !this.isSaving && this.inventoryIsChanged) {
      this.$store.state.saveStatus = true;
      this.confirm(this.getTranslation('I00.00053950', 'Unsaved data'), this.getTranslation('I00.00053960', 'You have unsaved data. Are you sure you want to proceed?'))
        .then(() => {
          this.$store.state.saveStatus = false;
          var routeMatch = to.path.indexOf('login') > -1;
          if (routeMatch)
            this.logOut();

          next()
        })
        .catch(errorDebug);
    } else next();
  },
}
</script>