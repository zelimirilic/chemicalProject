<template>
	<MainLoader v-if="isSaving || !tableData" />
	<div v-else>
		<MainTitle class="card pageWrapper" :text="getTranslation('I00.00048290', 'Own products')">
			<template #linkSlot>
				<div class="d-flex align-items-center actionLink">
					<ButtonIcon iconClass="icon-trash" :class="{ disabled: !selects.any() }" v-tooltip="getTranslation('I00.00027390', 'Remove')" @click="deleteSelected" />
					<ButtonIconAdd @click="$router.push({ name: 'localProductNew' })" />
				</div>
			</template>
			<SmallLoader v-if="isSaving" />
			<DataTable :tableData="tableData.notDeleted()" :perPage.sync="perPage" :title="getTranslation('I00.00048290', 'Own products')" excelTitle noHeader v-show="!isSaving">
				<template #head>
					<tr>
						<th class="iconCol text-center"><CheckBoxGroup :value="areAllSelected" @input="selectAll" /></th>
						<Th class="prodNo" prop="artNo" sort export>{{ getTranslation('I00.00002880', 'ArticleNo') }}</Th>
						<Th class="prodName w-75" prop="productName" sort export defaultSort>{{ getTranslation('I00.00004270', 'Name') }}</Th>
						<Th class="dateCol" prop="createdDate" sort export>{{ getTranslation('I00.00022900', 'Created') }}</Th>
					</tr>
				</template>
				<template #body="prod">
					<tr :key="idToString(prod.item)">
						<td class="iconCol"><CheckBoxGroup :class="{ disabled: prod.item.disabled }" :value="selects.indexOf(prod.item) !== -1" @input="selects.toggle(prod.item, $event)" /></td>
						<td class="prodNo">
							<p v-if="isLocalID(prod.item.id) || prod.item.disabled" class="mb-1">&nbsp;</p>
							<p class="mb-0">
								<router-link :to="{ name: 'product', params: { id: idToSlashedString(prod.item) } }">
									<span>{{ prod.item.artNo }}</span>
								</router-link>
							</p>
						</td>
						<td class="prodName w-75">
							<p v-if="isLocalID(prod.item.id)" class="tag mb-1">{{ getTranslation('I00.00050300', 'Own product') }}</p>
							<p v-if="prod.item.disabled" class="tag mb-1">{{ getTranslation('I00.00055310', 'Inventoried') }}</p>
							<p class="mb-0">
								<router-link :to="{ name: 'product', params: { id: idToSlashedString(prod.item) } }">{{ prod.item.productName }}</router-link>
							</p>
						</td>
						<td class="dateCol">
							<div class="d-flex flex-row align-items-center">{{ prod.item.createdDate }}</div>
						</td>
					</tr>
				</template>
			</DataTable>
		</MainTitle>
	</div>
</template>

<script>
import MainTitle from '../../../components/common/cardBox/MainTitle';
import { errorDebug, idToSlashedString, idToString, isLocalID } from '../../../libraries/common';
import axios from '../../../axios';
import ButtonIconAdd from '../../../components/common/button/buttonIcon/ButtonIconAdd';

export default {
  components: {
    MainTitle,
    ButtonIconAdd
  },
  data() {
    return {
      tableData: null,
      selects: [],
      isSaving: false,
      perPage: 20,
    };
  },
  methods: {
    deleteSelected() {
      this.confirm(this.getTranslation('I00.00019210', 'Remove product from inventory'), this.getTranslation('I00.00016350', 'Are you sure you want to remove selected product(s) from inventory?'))
        .then(() => this.isSaving = true)
        .then(() => axios.post('OwnProductsList/Delete', { selected_products: this.selects.map(f => idToString(f)) }))
        .then(() => {
          this.tableData = this.tableData.filter(f => !this.selects.includes(f));
          this.selects = this.selects.filter(f => !this.selects.includes(f));
          this.isSaving = false;
        }).catch(this.errorDebug);
    },
    selectAll() {
      if (!this.selects.any())
        this.selects = this.tableData.filter(f => !f.disabled);
      else this.selects = [];
    },
    idToString,
    idToSlashedString,
    isLocalID: isLocalID
  },
  computed: {
    areAllSelected() {
      return this.selects.length && this.selects.length === this.tableData.filter(f => !f.disabled).length
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisLocalProducts'] = this;

    axios.get(`OwnProductsList/Show?show_deleted=false`)
      .then(response => this.tableData = response.data)
      .catch(errorDebug);

    this.getTranslation('I00.00019210', 'Remove product from inventory');
    this.getTranslation('I00.00016350', 'Are you sure you want to remove selected product(s) from inventory?');
    this.getTranslation('I00.00012130', 'All');
  },
  beforeDestroy() {
    axios.cancelAll();
  }
};
</script>