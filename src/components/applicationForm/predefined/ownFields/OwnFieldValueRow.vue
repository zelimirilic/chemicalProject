<template>
	<tr>
		<td class="w-25">{{ value.caption }}</td>
		<td class="w-75">
			<template v-if="!tryParseArray(value.departmentValue)">
				<Input :value="value.value != null ? value.value : value.departmentValue" @input="setValue($event)" />
				<div class="note info">
					<p class="col mb-0">
						<b>{{ getTranslation('I00.00054800', 'Department field value') }}:</b>
						{{ value.departmentValue }}
					</p>
					<p class="col-auto mb-0 pl-0" :title="getTranslation('I00.00054810', 'Restore to department field value')" v-if="value.value">
						<span class="icons icon-restore plain" :class="{ disabled: !value.value }" @click="setValue(null)" withReadOnlyMode></span>
					</p>
				</div>
			</template>
			<Select :items="getItems(value)" :value="value.value" @input="setValue($event)" v-else />

			<div class="note" :class="isValid ? 'warning' : 'danger'" v-show="value.isChanged">
				<p class="col mb-0" v-if="!isReview">
					{{ getTranslation('I00.00054830', 'This change will need to be approved on the review.') }}
				</p>
				<template v-else>
					<template v-if="!value.modifiedBy">
						<p class="col mb-0">{{ value.approved ? getTranslation('I00.00013480', 'Approved') : getTranslation('I00.00054850', 'This change needs to be approved.') }}</p>
						<p class="col-auto mb-0 pl-0" :class="{ disabled: value.approved }" :title="getTranslation('I00.00009620', 'Approve')" v-if="isReview">
							<span class="icons icon-check plain" @click="approve(value)" withReadOnlyMode></span>
						</p>
					</template>
					<template v-else>
						<p class="col mb-0">{{ getTranslation('I00.00047100', 'Modified') }}</p>
					</template>
				</template>

				<p class="col-auto mb-0 pl-0" :title="getTranslation('I00.00026430', 'Restore')">
					<span class="icons icon-restore plain" @click="setValue(value.originalValue())" withReadOnlyMode></span>
				</p>
			</div>
		</td>
	</tr>
</template>

<script>
import { hashCode, tryParseArray } from '../../../../libraries/common';
export default {
  props: ['value', 'isReview'],
  data() {
    return {
      notTracked: { isChanged: undefined, approved: undefined, approvedBy: undefined, modifiedBy: undefined, },
      isValid: true,
    }
  },
  methods: {
    getItems(item) {
      var items = [null].concat(tryParseArray(item.departmentValue));
      if (item.value && !items.any(f => f === item.value))
        items.push(item.value);
      return items;
    },
    setValue(event) {
      this.$emit('input', {
        ...this.value,
        value: event,
        isChanged: hashCode({ ...this.value, value: event, ...this.notTracked, }) !== this.value.hashCode(),
        ...(this.isReview ? { modifiedBy: this.appSettings.user.userID, approved: false, approvedBy: null } : {})
      });
      this.$nextTick(() => this.checkIsValid());
    },
    approve() {
      this.$emit('input', {
        ...this.value,
        approved: true,
        approvedBy: this.appSettings.user.userID,
      });
      this.$nextTick(() => this.checkIsValid());
    },
    checkIsValid() {
      this.isValid = !this.value.isChanged || (!this.isReview || this.value.approved || this.value.modifiedBy);
      return this.isValid;
    },
    tryParseArray,
  }
}
</script>