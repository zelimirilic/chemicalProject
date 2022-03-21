<template>
	<div class="scrollWrap pb-4">
		<RiskDetail :risk="risk" showProductLink></RiskDetail>
		<div class="row px-4 pt-3 align-items-center">
			<h6 class="col-3 mb-0">{{ getTranslation('I00.00019800', 'Next revision') }}:</h6>
			<div class="col-2">
				<div><Date v-model="risk.validUntil" /></div>
			</div>
		</div>
		<div class="px-4 pt-3">
			<CheckBoxGroup v-model="showComposition" alwaysOn>{{ getTranslation('I00.00006960', 'Composition') }}</CheckBoxGroup>
		</div>
		<CardBox class="mt-3" additionalClass="lightGrayBg borderT" :text="getTranslation('I00.00006960', 'Composition')" v-if="showComposition">
			<CompositionTable :substances="allSubstances" />
		</CardBox>
		<CardBox class="mt-5 no-gutters" additionalClass="lightGrayBg borderT" :text="getTranslation('I00.00014610', 'Danger')">
			<div class="doubleBox row no-gutters">
				<HalfBox>
					<Subtitle :text="getTranslation('I00.00006610', 'Pictogram')"></Subtitle>
					<div v-if="common.getGhsClpSymbols(risk.activity.activityItems).length > 0" class="symbolsBox">
						<img class="img-fluid iconPx48 mx-4 mt-3" v-for="(symbol, ind) in common.getGhsClpSymbols(risk.activity.activityItems)" :src="getPictogram(symbol)" alt="" :title="getPictogramTitle(symbol)" :key="ind" />
					</div>
					<div v-else class="emptyTxt text-center p-4">
						<p class="icons icon-noitems plainIcn bigIcn m-0 p-0"></p>
						<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055680', 'No items found') }}</h4>
						<h6 class="mb-3">{{ getTranslation('I00.00055690', 'You don’t have any items here.') }}</h6>
					</div>
				</HalfBox>
				<HalfBox>
					<Subtitle :text="getTranslation('I00.00018840', 'Warnings')"></Subtitle>
					<div v-if="false" class="symbolsBox">
						{{ 'This is not implemented yet!!!' }}
					</div>
					<div v-else class="emptyTxt text-center p-4">
						<p class="icons icon-noitems plainIcn bigIcn m-0 p-0"></p>
						<h4 class="mt-3 mb-2">{{ getTranslation('I00.00055680', 'No items found') }}</h4>
						<h6 class="mb-3">{{ getTranslation('I00.00055690', 'You don’t have any items here.') }}</h6>
					</div>
				</HalfBox>
			</div>
		</CardBox>
		<CardBox class="mt-5 no-gutters" additionalClass="lightGrayBg borderT" :text="getTranslation('I00.00054960', 'Health')">
			<Subtitle :text="getTranslation('I00.00006170', 'Risk')"></Subtitle>
			<HseRisks blnProp="isHealth" @clicked="updateRiskList()" :risks="getRisks('health')" :allRiskItems="groupedRiskItems" @add="addRiskItem('health', $event)" @remove="risk.health.risks.remove($event)"></HseRisks>
			<Subtitle class="mt-5 borderT" :text="getTranslation('I00.00054970', 'Safety')">
				<CheckBoxGroup v-model="risk.productAttributesIncludedSubstancesHaveHygienicExposureLimits">{{ getTranslation('I00.00050460', 'Hygienic exposure limits') }}</CheckBoxGroup>
			</Subtitle>
			<TextAreaGroup class="px-4 pt-4" :text="getTranslation('I00.00050470', 'Risk of exceeding occupational exposure limits')" v-model="risk.health.internalComment" />
			<Subtitle class="mt-5 borderT" :text="getTranslation('I00.00005730', 'OneOfMeasures')">
				<CheckBoxGroup :value="healthActionNeeded" @input="setActionNeeded('H_NoNeeded', $event)">{{ getTranslation('I00.00050480', 'No action needed') }}</CheckBoxGroup>
			</Subtitle>
			<OneOfMeasures :measures="risk.measures" measureType="I00.00054960" @add="addResponsiblePerson" @remove="removeResponsiblePerson"></OneOfMeasures>
		</CardBox>
		<CardBox class="mt-5 no-gutters" additionalClass="lightGrayBg borderT" :text="getTranslation('I00.00054970', 'Safety')">
			<Subtitle :text="getTranslation('I00.00006170', 'Risk')"></Subtitle>
			<HseRisks blnProp="isSafety" @clicked="updateRiskList()" :risks="getRisks('safety')" :allRiskItems="groupedRiskItems" @add="addRiskItem('safety', $event)" @remove="risk.safety.risks.remove($event)"></HseRisks>
			<Subtitle class="mt-5 borderT" :text="getTranslation('I00.00005730', 'OneOfMeasures')">
				<CheckBoxGroup :value="safetyActionNeeded" @input="setActionNeeded('S_NoNeeded', $event)">{{ getTranslation('I00.00050480', 'No action needed') }}</CheckBoxGroup>
			</Subtitle>
			<OneOfMeasures :measures="risk.measures" measureType="I00.00054970" @add="addResponsiblePerson" @remove="removeResponsiblePerson"></OneOfMeasures>
		</CardBox>
		<CardBox class="mt-5 no-gutters" additionalClass="lightGrayBg borderT" :text="getTranslation('I00.00054980', 'Environment')">
			<Subtitle :text="getTranslation('I00.00006170', 'Risk')"></Subtitle>
			<HseRisks blnProp="isEnvironment" @clicked="updateRiskList()" :risks="getRisks('environment')" :allRiskItems="groupedRiskItems" @add="addRiskItem('environment', $event)" @remove="risk.environment.risks.remove($event)"></HseRisks>
			<Subtitle class="mt-5 borderT" :text="getTranslation('I00.00005730', 'OneOfMeasures')">
				<CheckBoxGroup :value="environmentActionNeeded" @input="setActionNeeded('E_NoNeeded', $event)">{{ getTranslation('I00.00050480', 'No action needed') }}</CheckBoxGroup>
			</Subtitle>
			<OneOfMeasures :measures="risk.measures" measureType="I00.00054980" @add="addResponsiblePerson" @remove="removeResponsiblePerson"></OneOfMeasures>
		</CardBox>
		<CardBox class="mt-5" additionalClass="lightGrayBg borderT" :text="getTranslation('I00.00019100', 'InternalNotes')">
			<TextAreaGroup class="mt-4 mb-0 px-4" v-model="risk.mainInternalComment"></TextAreaGroup>
		</CardBox>
	</div>
</template>

<script>
import RiskDetail from './components/RiskDetail';
import HseRisks from './components/HseRisks';
import OneOfMeasures from './components/OneOfMeasures';
import Subtitle from '../../common/cardBox/Subtitle';
import axios from '../../../axios';
import { errorDebug, camelCaseObj, hashCode } from '../../../libraries/common';
import { allSubstances } from '../../../libraries/risk';
import CompositionTable from '../../../components/common/composition/CompositionTable';
import { getPictogram, getPictogramTitle } from '../../../libraries/product';
import moment from 'moment';

export default {
  components: {
    RiskDetail,
    HseRisks,
    OneOfMeasures,
    Subtitle,
    CompositionTable
  },
  data: function () {
    return {
      showComposition: false,
      allRiskItems: [],
      groupedRiskItems: [],
      startAdditionalRiskSrcHash: null
    };
  },
  props: ['title', 'close', 'additionalClass', 'risk', 'common'],
  methods: {
    addRiskItem(prop, it) {

      if (!this.risk[prop]) this.$set(this.risk, prop, {});
      if (!this.risk[prop].risks) this.$set(this.risk[prop], 'risks', []);

      this.risk[prop].risks.push({ itemRisk: it, name: it.text == null ? it.itemText : null });
    },
    getPictogram: getPictogram,
    getPictogramTitle: getPictogramTitle,
    riskItems(prop, type) {
      return this.allRiskItems
        .filter(f => f[prop] && f.type === type);
    },
    addResponsiblePerson(person) {
      this.risk.measures.push(person);
    },
    setActionNeeded(type, value) {
      var person = this.risk.measures.filter(x => x.task == 'NO_ACTION_NEEDED' && x.measureType == type).firstOrDefault();
      if (!person) {
        person = {
          date: moment(new Date(), 'YYYY-MM-DD').toDate(),
          email: null,
          responsiblePerson: this.appSettings.user.name,
          measureType: type,
          user: { id: this.appSettings.user.userID.id, id_mdbID: this.appSettings.user.userID.id_mdbID },
          task: value ? 'NO_ACTION_NEEDED' : null
        }
      }
      if (value)
        this.addResponsiblePerson(person)
      else
        this.removeResponsiblePerson(person)
    },
    removeResponsiblePerson(person) {
      this.risk.measures.remove(person);
    },
    getRisks(prop) {
      if (!this.risk[prop]) return [];
      return this.risk[prop].risks || [];
    },
    getAdditionalRiskItemObject(value) {
      return { isEnvironment: true, isHealth: true, isSafety: true, itemValue: 0, itemID: { id: 25, id_mdbID: 10 }, itemValue_v3: 0, itemText: value, text: null, type: "Risk" };
    },
    updateRiskList() {
      if (this.startAdditionalRiskSrcHash != hashCode(this.risk.additionalRiskSource)) {
        this.groupedRiskItems = [...this.allRiskItems];
        this.risk.additionalRiskSource.forEach(x => this.groupedRiskItems.some(f => f.itemText == x) ? '' : this.groupedRiskItems.push(this.getAdditionalRiskItemObject(x)));
        this.startAdditionalRiskSrcHash = hashCode(this.risk.additionalRiskSource);
      }
    }
  },
  computed: {
    allSubstances() {
      return allSubstances(camelCaseObj(this.risk.activity.activityItems));
    },
    healthActionNeeded() {
      return this.risk.measures.filter(x => x.task == 'NO_ACTION_NEEDED' && x.measureType == 'H_NoNeeded').length > 0;
    },
    safetyActionNeeded() {
      return this.risk.measures.filter(x => x.task == 'NO_ACTION_NEEDED' && x.measureType == 'S_NoNeeded').length > 0;
    },
    environmentActionNeeded() {
      return this.risk.measures.filter(x => x.task == 'NO_ACTION_NEEDED' && x.measureType == 'E_NoNeeded').length > 0;
    }
  },
  translationsLoaded() {
    axios.get('/RiskAssessmentComplete/GetAllRiskItems')
      .then(response => {
        this.allRiskItems = response.data;
        this.updateRiskList();
        this.startAdditionalRiskSrcHash = hashCode(this.risk.additionalRiskSource);
      }).catch(errorDebug);
  },
  mounted() {
    window['moment'] = moment;
  }
};
</script>