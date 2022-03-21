<template>
	<InformationBoxEdit additionalClass="p-4" :title="getTranslation('I00.00004890', 'Synonyms')" @cancel="$emit('cancel')" @save="$emit('save')" :isChanged="isChanged" :isModelValid="isModelValid" :loader="loader" :synonyms="synonyms">
		<div class="col-12">
			<div class="form-group mb-0">
				<label class="form-control-label">{{ getTranslation('I00.00055850', 'Add synonyms') }}</label>
				<div class="specialType" :class="{ 'input-group': newSynonymIsValid, 'input-group notValid': !newSynonymIsValid }">
					<input :class="{ 'form-control': newSynonymIsValid, 'form-control notValid': !newSynonymIsValid }" v-model="newSynonym" type="text" />
					<div class="input-group-append" @click="addSynonim(synonyms)" v-tooltip="getTranslation('I00.00013100', 'Add')"><span class="input-group-text icons icon-plus"></span></div>
					<label class="alert alert-danger w-100 mt-2" v-if="!newSynonymIsValid">{{ getTranslation('I00.00051610', 'Text field is limited to {0} characters.').replace('{0}', '250') }}</label>
				</div>
			</div>
		</div>
		<div class="col-12 mt-3" v-if="synonyms.length > 0">
			<Badge class="m-1" v-for="(synonym, ind) in synonyms" :key="ind" @delete="synonyms.remove(synonym)">{{ synonym.name }}</Badge>
		</div>
	</InformationBoxEdit>
</template>

<script>
import { validators } from '../../../libraries/forms';
import { hashCode } from '../../../libraries/common';
import Badge from '../../common/badge/Badge';
import InformationBoxEdit from './InformationBoxEdit';
export default {
  components: {
    InformationBoxEdit,
    Badge
  },
  props: ['synonyms', 'loader'],
  data() {
    return {
      newSynonym: '',
      newSynonymIsValid: true,
      $modelValidators: [],
      startHash: hashCode(this.synonyms),
    };
  },
  methods: {
    maxLength: validators.maxLength,
    addSynonim(synonyms) {
      if (this.newSynonym.length < 1) { return; }
      if (synonyms[synonyms.length - 1] && !synonyms[synonyms.length - 1].name) return;
      if (this.newSynonym.length > 255) { this.newSynonymIsValid = false; return; }
      this.newSynonymIsValid = true;
      var newOne = { name: this.newSynonym, language: this.appSettings.documentLanguage };
      synonyms.push(newOne);
      this.newSynonym = '';
    }
  },
  computed: {
    isModelValid() {
      return this.$data.$modelValidators.all(f => f.isValid);
    },
    isChanged() {
      return this.startHash !== hashCode(this.synonyms);
    }
  }
};
</script>