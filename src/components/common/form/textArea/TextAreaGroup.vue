<template>
	<div class="form-group mb-0">
		<label class="d-flex form-control-label" v-if="text != null">
			{{ text }}
			<sup class="astera" v-if="propToBool(required)">*</sup>
			<span class="icons icon-restore plainIcn ml-auto" @click="$emit('reset', resetIcon)" v-if="resetIcon"></span>
		</label>
		<textarea class="form-control" :class="{ notValid: !isValid, infobox: informationBox }" :placeholder="placeholder" :value="value" :readonly="informationBox" ref="textarea" @input="onInput" @blur="onBlur"></textarea>
		<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
	</div>
</template>
<script>
import { propToBool, setAllValidationParents, removeAllValidationParents } from '../../../../libraries/vue';
import { checkIsValid } from '../../../../libraries/forms';
export default {
  props: ['text', 'value', 'placeholder', 'required', 'validations', 'resetIcon', 'informationBox'],
  data() {
    return {
      isValid: true,
      errorMessage: null,
    };
  },
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value);
      this.$nextTick(() => this.checkIsValid());
    },
    onBlur(event) {
      this.$emit('blur', event.target.value);
      this.$nextTick(() => this.checkIsValid());
    },
    onScrollHeightChanged() {
      this.$refs.textarea.style.height = "auto";
      let newHeight = this.$refs.textarea.scrollHeight + 4;
      this.$refs.textarea.style.height = `${newHeight}px`;
    },
    propToBool: propToBool,
    checkIsValid: checkIsValid,
  },
  mounted() {
    if (this.validations || propToBool(this.required)) {
      setAllValidationParents(this);
    }

    if (this.informationBox)
      this.onScrollHeightChanged();
  },
  beforeDestroy() {
    removeAllValidationParents(this);
  },
  watch: {
    placeholder() {
      if (this.informationBox)
        this.$nextTick(() => this.onScrollHeightChanged());
    }
  }
}
</script>