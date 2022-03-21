<template>
	<div>
		<div class="card-body">
			<div class="my-3 p-3 lightGrayBg borderTRBL rounded">
				<h6 class="primaryTxt mb-3">{{ getTranslation('I00.00027700', 'View general safety sheet for') }}</h6>
				<div class="custom-check radio mTopPadding my-2">
					<input type="radio" class="custom-input" id="radioSS" name="chooseSS" :checked="radio == 'ss'" :value="'ss'" @change="radio = $event.target.value" />
					<label for="radioSS" class="custom-label">
						{{ product.name }}
					</label>
				</div>
			</div>
			<div class="my-3 p-3 lightGrayBg borderTRBL rounded">
				<h6 class="primaryTxt mb-3">{{ getTranslation('I00.00027710', 'View safety sheet for activity') }}</h6>
				<div class="d-flex mTopPadding my-2" v-for="(item, ind) in data" :key="item.id + ind">
					<div class="custom-check radio">
						<input type="radio" :id="'radio' + item.id" class="custom-input" name="chooseSS" :checked="radio == item.id" :value="item.activity.id" @change="radio = $event.target.value" />
						<label :for="'radio' + item.id" :title="item.activity.name" class="custom-label wp-400 text-truncate">
							{{ item.activity.name }}
						</label>
					</div>
					<div class="text-truncate" v-tooltip="findNodeNamePath(item.activity.department.orgID)">
						<span class="mx-2">{{ item.activity.department.name }}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="card-footer text-right">
			<ButtonCancel @click="$emit('cancel')" />
			<ButtonOk class="primary" @click="emitData" />
		</div>
	</div>
</template>

<script>
import { findNodeNamePath } from '../../../libraries/tree';
export default {
  props: ['data', 'product', 'title'],
  data() {
    return {
      radio: this.data[0].id
    }
  },
  methods: {
    emitData() {
      if (this.radio == 'ss')
        this.$router.push({ name: 'product', params: { id: this.$route.params.id, component: 'safety_sheet' } });
      else
        this.$router.push({ name: 'activity', params: { id: this.data.find(x => x.activity.id == this.radio).activity.id, component: 'safety_sheet' } });
    },
    findNodeNamePath
  }
};
</script>