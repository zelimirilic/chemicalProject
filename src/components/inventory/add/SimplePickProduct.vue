<template>
	<div class="row">
		<div class="col-xl-6 col-12 mb-4">
			<div class="input-group">
				<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
			</div>
		</div>
	</div>
</template>

<script>
import { checkIsValid } from '../../../libraries/forms';
import { setAllValidationParents, removeAllValidationParents } from '../../../libraries/vue';
export default {
  props: ['validations'],
  data() {
    return {
      isValid: true,
      errorMessage: null
    };
  },
  methods: {
    onInput(value) {
      this.$emit('input', value);
      this.$nextTick(() => this.checkIsValid());
    },
    checkIsValid: checkIsValid,
  },
  mounted() {
    if (this.validations) {
      setAllValidationParents(this);
    }
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  }
}
</script>