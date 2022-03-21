<template>
	<div class="backdrop" tabindex="0">
		<div class="modalCard">
			<div class="card" :class="additionalClass">
				<div class="mainTtl card-header align-items-center">
					<h5>{{ title }}</h5>
					<button class="btn btn-plain" type="button" @click="$emit('close')" v-if="!propToBool(hideClose)"><span class="icons icon-delete plainIcn smallIcn"></span></button>
				</div>
				<slot v-if="withFooter == true"></slot>
				<div class="card-body" v-else>
					<slot></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { propToBool } from '../../../libraries/vue';

export default {
  props: ['title', 'additionalClass', 'hideClose', 'cardFooter', 'withFooter'],
  methods: {
    propToBool: propToBool
  },
  mounted() {
    document.body.appendChild(this.$el);
  },
  beforeDestroy() {
    if (this.$el.parentNode)
      this.$el.parentNode.removeChild(this.$el);
  },
  created() {
    document.onkeyup = evt => {
      evt = evt || window.event;
      if (evt.keyCode == 27) {
        this.$emit('esc');
      }
    };
  }
};
</script>