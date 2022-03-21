<template>
	<div>
		<MainTitle class="card pageWrapper mt-4 mb-20" :text="getTranslation('I00.00009870', 'User info')" v-if="!appSettings.overviewAttributeListDisableContactBoxes && !data.Plausibility && data.Documents.length > 0">
			<template #linkSlot>
				<ButtonIconSave :class="{ disabled: !dataChanged }" @click="save()" />
			</template>
			<div class="row p-4">
				<InputGroup class="col-6" v-model="data.UserName" :text="getTranslation('I00.00009950', 'Your name')" required />
				<InputGroup class="col-6" v-model="data.UserEmail" :text="getTranslation('I00.00009930', 'Your e-mail')" required />
			</div>
		</MainTitle>
		<DataTable class="mt-4" tableWrapClass="hp-375 mt-2 borderTRBL" :tableData="data.Documents.length > 0 ? data.Documents.find((x) => x.Attribute === data.Attribute).Remarks : []" :perPage="1000" @update:per-page="$emit('update:per-page', $event)" noHeader>
			<template #head>
				<tr>
					<Th class="w-20" prop="ArtNo" sort export>{{ getTranslation('I00.00002880', 'Prod. No.') }}</Th>
					<Th class="w-40" prop="Name" sort defaultSort export>{{ getTranslation('I00.00004270', 'Name') }}</Th>
					<Th class="w-60" prop="Publisher" sort export>{{ getTranslation('I00.00004110', 'Supplier') }}</Th>
					<Th class="wp-100" name="SetDate" sort :export="(f) => parseDate(f.SetDate)">{{ getTranslation('I00.00008620', 'Date') }}</Th>
				</tr>
			</template>
			<template #body="data">
				<tr>
					<td class="w-20">
						<router-link :to="`/product/${data.item.ProductID}_${data.item.ProductID_mdbID}`">
							<span>{{ data.item.ArtNo }}</span>
						</router-link>
					</td>
					<td class="wp-40">
						<router-link :to="`/product/${data.item.ProductID}_${data.item.ProductID_mdbID}`">
							<span>{{ data.item.Name }}</span>
						</router-link>
					</td>
					<td class="wp-60">
						<p class="mb-0">{{ data.item.Publisher }}</p>
						<div class="mt-3" v-if="!appSettings.overviewAttributeListDisableContactBoxes && !data.Plausibility">
							<p>{{ data.item.NoteText }}</p>
							<InputGroup v-model="data.item.CustomerAnswer" :text="getTranslation('I00.00027270', 'Answer') + ':'" />
						</div>
					</td>
					<td class="wp-100 noWrap">{{ parseDate(data.item.SetDate) }}</td>
				</tr>
			</template>
		</DataTable>
	</div>
</template>

<script>
import { parseDate } from '../../libraries/date';
import { checkIsValid } from '../../libraries/vue';
import { hashCode } from '../../libraries/common'
import MainTitle from '../../components/common/cardBox/MainTitle';
export default {
  components: {
    MainTitle
  },
  props: ['data', 'perPage'],
  data() {
    return {
      startHash: hashCode(this.data)
    };
  },
  methods: {
    save() {
      if (!checkIsValid(this)) return;
      this.$emit('saveCustomerAnswers', this.data);
    },
    parseDate
  },
  computed: {
    dataChanged() {
      return this.startHash !== hashCode(this.data);
    }
  }
};
</script>